import React, { useState, useEffect, useContext, useMemo } from "react";
import { API } from "@/config/api";
import { AuthContext } from "@/providers/authProvider";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { PreviewGrid } from "@/components/QrPreviewGrid";
import { QrForm } from "@/components/QrForm";

/* ---------------------------------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------------------------------*/
const defaultSettings = {
  productName: true,
  currentOwner: true,
  manufacturer: true,
  productImage: true,
  productStatus: true,
};

const sanitizeFilename = (name) =>
  name.replace(/[^a-z0-9_\-\. ]/gi, "_").slice(0, 180);

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const blobToDataURL = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

async function fetchBlob(url, token) {
  const tryWith = async (opts) => {
    const resp = await fetch(url, opts);
    if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status}`);
    return await resp.blob();
  };

  try {
    return await tryWith({
      mode: "cors",
      headers: token ? { "x-jwt-bearer": token } : undefined,
      cache: "no-store",
      credentials: "omit",
    });
  } catch {
    return await tryWith({
      mode: "cors",
      cache: "no-store",
      credentials: "omit",
    });
  }
}



/* ---------------------------------------------------------------------------------------
 * Main
 * -------------------------------------------------------------------------------------*/
export default function TenantQrGenerator() {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [batchName, setBatchName] = useState("");
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(API.GET_PRODUCTS, {
          headers: { "x-jwt-bearer": token },
        });
        const data = await response.json();
        const options = data.map((p) => ({
          label: p.product_name,
          value: p.product_id,
        }));
        setProducts(options);
      } catch (e) {
        console.error("Failed to fetch products", e);
      }
    })();
  }, [token]);

  const generateQrCodes = async () => {
    if (!selectedProducts.length || !batchName.trim()) return;
    setLoading(true);
    try {
      const pickedSettings = Object.entries(settings)
        .filter(([_, v]) => v)
        .map(([k]) => k);

      const generated = [];
      for (const product of selectedProducts) {
        const payload = {
          product_id: product.value,
          qr_name: batchName.trim(),
          view_permission: -1,
          qr_details: pickedSettings,
        };

        const res = await fetch(API.QR_GENERATE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-jwt-bearer": token,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to generate QR code");

        const json = await res.json();
        if (json?.success && json?.qr_image_url) {
          generated.push({
            name: `${batchName.trim()} - ${product.label}`,
            productLabel: product.label,
            url: json.qr_image_url,
          });
        }
      }
      setQrCodes(generated);
      setBatchName(""); // Clear the form on completion
      setSelectedProducts([]);
    } catch (e) {
      console.error("Error generating QR codes:", e);
      alert("Error generating QR codes. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const downloadOne = async (url, name) => {
    try {
      const blob = await fetchBlob(url, token);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${sanitizeFilename(name)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error("Download failed:", e);
    }
  };

  const printOne = async (url, name) => {
    try {
      const blob = await fetchBlob(url, token);
      const blobUrl = URL.createObjectURL(blob);
      const w = window.open("", "_blank");
      if (!w) return;
      w.document.write(`
        <html>
          <head>
            <title>Print QR - ${escapeHtml(name)}</title>
          </head>
          <body>
            <img src="${blobUrl}" alt="${escapeHtml(name)}" />
            <script>
              window.onload = function(){ window.print(); window.onafterprint = () => window.close(); }
            </script>
          </body>
        </html>
      `);
      w.document.close();
    } catch (e) {
      console.error("Print failed:", e);
    }
  };

  const downloadAllAsZip = async () => {
    if (!qrCodes.length) return;
    setBulkLoading(true);
    try {
      const zip = new JSZip();
      const folder =
        zip.folder(sanitizeFilename(batchName.trim()) || "qr-codes") || zip;

      await Promise.all(
        qrCodes.map(async (code) => {
          try {
            const blob = await fetchBlob(code.url, token);
            const ab = await blob.arrayBuffer();
            folder.file(`${sanitizeFilename(code.name)}.png`, ab);
          } catch (e) {
            console.warn(`Skipped ${code.name}`, e);
          }
        })
      );

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(
        content,
        `${sanitizeFilename(batchName.trim()) || "qr-codes"}.zip`
      );
    } catch (e) {
      console.error("ZIP creation failed:", e);
    } finally {
      setBulkLoading(false);
    }
  };

  const printAll = async () => {
    if (!qrCodes.length) return;
    setBulkLoading(true);
    try {
      const items = await Promise.all(
        qrCodes.map(async (code) => {
          const blob = await fetchBlob(code.url, token);
          return { name: code.name, dataUrl: await blobToDataURL(blob) };
        })
      );

      const chunk = (arr, size) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
          arr.slice(i * size, i * size + size)
        );

      const pages = chunk(items, 4);
      let html = "<html><body>";
      for (const group of pages) {
        html += `<div class="page">`;
        for (const item of group) {
          html += `<div class="card"><img src="${
            item.dataUrl
          }" alt="${escapeHtml(item.name)}" /><div>${escapeHtml(
            item.name
          )}</div></div>`;
        }
        html += `</div>`;
      }
      html += `<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();}}</script></body></html>`;

      const w = window.open("", "_blank");
      if (w) {
        w.document.write(html);
        w.document.close();
      }
    } catch (e) {
      console.error("Print all failed:", e);
    } finally {
      setBulkLoading(false);
    }
  };

  const previewItems = useMemo(() => qrCodes.map((c) => ({ ...c })), [qrCodes]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <QrForm
        products={products}
        batchName={batchName}
        setBatchName={setBatchName}
        selected={selectedProducts}
        setSelected={setSelectedProducts}
        settings={settings}
        setSettings={setSettings}
        onGenerate={generateQrCodes}
        loading={loading}
      />
      <PreviewGrid
        items={previewItems}
        onDownloadAll={downloadAllAsZip}
        onPrintAll={printAll}
        onDownloadOne={downloadOne}
        onPrintOne={printOne}
        busy={bulkLoading}
      />
    </div>
  );
}
