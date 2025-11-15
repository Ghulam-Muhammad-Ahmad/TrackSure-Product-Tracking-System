 import React, { useEffect, useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { API } from "@/config/api";
import { AuthContext } from "@/providers/authProvider";

export function ProductQrModal({
  open,
  onClose,
  defaultValues,
  columnsConfig,
}) {
  const [loadingFile, setLoadingFile] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const { token } = useContext(AuthContext);

  // Generate QR when modal opens
  useEffect(() => {
    if (!open) return;
    console.log("Generating QR for productId:");

    const productId = defaultValues?.product_id;
    if (!productId) return;

    const generateQr = async () => {
      setLoadingFile(true);
      setUploadError("");

      try {
        const timestamp = new Date().getTime();
        const response = await fetch(API.QR_GENERATE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-jwt-bearer": token,
          },
          body: JSON.stringify({
            product_id: productId,
            qr_name: "QR_" + timestamp,
            view_permission: -1,
            qr_details: ["productName","currentOwner","manufacturer","productImage","productStatus","productCategory"],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate QR code");
        }

        const data = await response.json();
        if (data?.qr_image_url) {
          setQrCode(data.qr_image_url);
        } else {
          throw new Error("Invalid QR code response");
        }
      } catch (error) {
        console.error("QR code generation failed:", error);
        setUploadError("QR code generation failed. Please try again.");
      } finally {
        setLoadingFile(false);
      }
    };

    generateQr();
  }, [open, defaultValues, columnsConfig, token]);

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setQrCode(null);
      setUploadError("");
      setLoadingFile(false);
    }
  }, [open]);

  // Print QR code
  const handlePrint = () => {
    if (!qrCode) return;
    const win = window.open("");
    win.document.write(
      `<img src="${qrCode}" onload="window.print();window.close()" />`
    );
    win.focus();
  };

  // Download QR code
  const handleDownload = () => {
    if (!qrCode) return;
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "qr_code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>

        {loadingFile && <p>Generating QR code...</p>}

        {!loadingFile && uploadError && (
          <p className="text-red-500">{uploadError}</p>
        )}

        {!loadingFile && !uploadError && qrCode && (
          <img src={qrCode} alt="QR Code" className="w-full" />
        )}

        {!loadingFile && !uploadError && !qrCode && (
          <p>QR code not available.</p>
        )}

        <DialogFooter>
          <Button onClick={handlePrint} disabled={!qrCode || loadingFile}>
            Print
          </Button>
          <Button onClick={handleDownload} disabled={!qrCode || loadingFile}>
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
