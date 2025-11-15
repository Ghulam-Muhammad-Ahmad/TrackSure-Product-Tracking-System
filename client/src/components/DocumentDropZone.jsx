import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DocumentDropZone({ onFiles, disabled }) {
  const [isOver, setIsOver] = useState(false);
  const inputRef = useRef(null);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        if (!disabled && e.dataTransfer?.files?.length) {
          onFiles(Array.from(e.dataTransfer.files));
        }
      }}
      className={cn(
        "rounded-2xl border-2 border-dashed p-6 transition-all",
        isOver ? "border-primary bg-primary/5" : "border-secondary/40 hover:bg-secondary/10",
        disabled && "opacity-60 cursor-not-allowed"
      )}
    >
      <div className="flex items-center gap-3">
        <Upload className="h-5 w-5" />
        <div>
          <p className="text-sm font-medium">Drag & drop files here</p>
          <p className="text-xs text-muted-foreground">or click to browse</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => onFiles(Array.from(e.target.files || []))}
        disabled={disabled}
      />
      <div className="mt-4">
        <Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={disabled}>
          Browse files
        </Button>
      </div>
    </div>
  );
}
