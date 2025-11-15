import React from 'react';
import { Download, Printer, Loader2, Settings2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PreviewGrid({
    items,
    onDownloadAll,
    onPrintAll,
    onDownloadOne,
    onPrintOne,
    busy,
  }) {
    return (
      <Card className="shadow-lg rounded-2xl border border-gray-200 flex flex-col">
        <CardHeader className="border-b pb-4 flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Preview</CardTitle>
          <div className="flex gap-2 items-center">
            <Button
              onClick={onDownloadAll}
              disabled={busy || !items.length}
              className="flex items-center gap-2 "
            >
              {busy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download All (ZIP)
            </Button>
            <Button
              onClick={onPrintAll}
              disabled={busy || !items.length}
              className="flex items-center gap-2"
            >
              {busy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Printer className="w-4 h-4" />
              )}
              Print All
            </Button>
          </div>
        </CardHeader>
  
        <CardContent className="w-full max-h-[65vh] overflow-x-auto">
          {items.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {items.map((code, i) => (
                <div
                  key={i}
                  className="relative group border rounded-xl overflow-hidden shadow-sm"
                >
                      {/* <div className="px-3 pt-3 text-sm text-muted-foreground text-center">
                    <span className="font-medium">{code.productLabel}</span>
                  </div> */}
                  <img
                    src={code.url}
                    alt={code.name}
                    className="w-full h-auto p-4 pt-0"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent text-white py-2 opacity-0 group-hover:opacity-300 transition-opacity flex justify-between items-center px-3">
                    <span className="truncate">{code.name}</span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => onDownloadOne(code.url, code.name)}
                        className="p-1"
                        aria-label={`Download ${code.name}`}
                        title={`Download ${code.name}`}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onPrintOne(code.url, code.name)}
                        className="p-1"
                        aria-label={`Print ${code.name}`}
                        title={`Print ${code.name}`}
                      >
                        <Printer className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              Generated QR codes will appear here.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }