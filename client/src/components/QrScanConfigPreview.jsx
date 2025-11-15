import React, { useState } from "react";
import { Mail, Phone, MapPin, Factory, User2, Tag, Eye, X } from "lucide-react";

const ProductImageModal = ({ productImage, setIsModalOpen }) => {
  return (
    <div className="fixed inset-0 z-10 bg-[#0000008e] bg-opacity-50 flex justify-center items-center">
      <img
        src={productImage}
        alt="Product Image"
        className="w-[20%]  rounded-md"
      />
      <button className="absolute top-0 right-0 m-4 text-white" onClick={() => setIsModalOpen(false)}>
        <X size={40}/>
      </button>
    </div>
  );
};

export function QrScanConfigPreview({
  brandName,
  logoUrl,
  redirectUrl,
  description,
  themeColor,
  productImage,
  manufacturer,
  owner,
  productName,
  productStatus,
  productCategory,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sample = {
    productName: productName || "Loading..",
    category: productCategory || "Loading..",
    status: productStatus || "Loading..",
    manufacturer: manufacturer || {
      name: "Loading..",
      email: "Loading..",
      phone: "Loading..",
      location: "Loading..",
    },
    owner: owner || {
      name: "Loading..",
      email: "Loading..",
      phone: "Loading..",
      location: "Loading..",
    },
    productImage: productImage || "https://placehold.co/600x200",
  };
  const accentStyle = { backgroundColor: themeColor || "#0a6cff" };
  const ringStyle = { border: `1px solid ${themeColor || "#0a6cff"}` };

  return (
    <>
     {isModalOpen && <ProductImageModal productImage={sample.productImage} setIsModalOpen={setIsModalOpen} />}
    <div className="space-y-4 max-w-[1000px]">
      <div className="overflow-hidden rounded-2xl border shadow-sm">
        <div className="h-2 w-full" style={accentStyle} />
        <div className="bg-background/75 p-4 backdrop-blur">
          <div className="mb-3 flex items-center gap-3">
            {logoUrl ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <img
              src={logoUrl}
              alt="logo"
              className="h-15 w-15 object-cover object-center rounded-full shadow-sm"
              />
            ) : (
              <div className="h-10 w-10 rounded-md border bg-muted" />
            )}
            <div>
              <h2 className="text-xl font-semibold">
                {brandName || "Your Brand"}
              </h2>
            </div>
          </div>
          {description ? (
            <p className="text-sm text-muted-foreground my-4">{description}</p>
          ) : null}
          <div
            className="rounded-xl bg-background p-4 shadow-xl"
            style={ringStyle}
            >
            <div className="mb-2 flex items-center justify-between gap-2">
              {sample.productName !== "NA" && (
                <div className="text-lg font-medium">
                  {sample.productName === "Loading.." ? null : sample.productName}
                </div>
              )}
              {sample.status !== "NA" && (
                <span
                className="rounded-full px-2 py-1 text-xs text-white"
                style={accentStyle}
                >
                  {sample.status}
                </span>
              )}
            </div>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {sample.category !== "NA" && (
                <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">
                  <Tag className="h-3 w-3" />
                  {sample.category}
                </span>
              )}
            </div>

            {redirectUrl ? (
              <a
              href={redirectUrl}
                className="mt-3 inline-block rounded-xl px-4 py-2 text-sm font-medium text-white"
                style={accentStyle}
              >
                Learn more
              </a>
            ) : null}
            {sample.productImage ? (
              <div className="mb-3 relative">
                <img
                  src={sample.productImage}
                  alt="Product Image"
                  className="w-full h-[300px] object-cover rounded-md"
                  />
                <Eye className="h-8 w-8  absolute top-2 right-2 cursor-pointer" size={40} onClick={() => setIsModalOpen(true)} />
              </div>
            ) : null}
          </div>
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-2">
          {sample.manufacturer !== "NA" && (
            <div
            className="rounded-2xl border bg-background p-4 shadow-xl"
            style={ringStyle}
            >
              <div className="mb-2 flex items-center gap-2">
                <Factory className="h-4 w-4" />
                <h3 className="text-base font-semibold">Manufacturer</h3>
              </div>
              {sample.manufacturer?.name !== "Loading.." ? (
                <>
                  <div className="mb-1 text-sm font-medium">
                    {sample.manufacturer?.name}
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {sample.manufacturer?.email}
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {sample.manufacturer?.phone}
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {sample.manufacturer?.location}
                    </li>
                  </ul>
                </>
              ) : null}
            </div>
          )}
          {sample.owner !== "NA" && (
            <div
              className="rounded-2xl border bg-background p-4 shadow-xl"
              style={ringStyle}
            >
              <div className="mb-2 flex items-center gap-2">
                <User2 className="h-4 w-4" />
                <h3 className="text-base font-semibold">Current Owner</h3>
              </div>
              {sample.owner?.name !== "Loading.." ? (
                <>
                  <div className="mb-1 text-sm font-medium">
                    {sample.owner?.name}
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {sample.owner?.email}
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {sample.owner?.phone}
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {sample.owner?.location}
                    </li>
                  </ul>
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
              </>
  );
}
