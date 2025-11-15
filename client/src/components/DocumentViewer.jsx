import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, X, ZoomIn, ZoomOut, RotateCw, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const DocumentViewer = ({ document, open, onClose }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  if (!document) return null;

  const isImage = document.file_type?.startsWith('image/');
  const isPDF = document.file_type === 'application/pdf';
  const isVideo = document.file_type?.startsWith('video/');
  const isAudio = document.file_type?.startsWith('audio/');
  
  // Common document types that can be previewed
  const isPreviewable = isImage || isPDF || isVideo || isAudio;

  const handleDownload = async () => {
    try {
      const response = await fetch(document.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed');
    }
  };

  const handlePrint = () => {
    if (isImage || isPDF) {
      const printWindow = window.open(document.file_url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } else {
      toast.info('Print is only available for images and PDFs');
    }
  };

  const handleOpenInNewTab = () => {
    window.open(document.file_url, '_blank', 'noopener,noreferrer');
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const renderPreview = () => {
    if (isImage) {
      return (
        <div className="flex justify-center items-center h-full overflow-auto">
          <img
            src={document.file_url}
            alt={document.filename}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            }}
          />
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="h-full w-full">
          <iframe
            src={`${document.file_url}#zoom=${zoom}`}
            className="w-full h-full border-0"
            title={document.filename}
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="flex justify-center items-center h-full">
          <video
            src={document.file_url}
            controls
            className="max-w-full max-h-full"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (isAudio) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-24 h-24 mx-auto bg-secondary rounded-full flex items-center justify-center">
                <span className="text-2xl">🎵</span>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-4">{document.filename}</h3>
            <audio src={document.file_url} controls className="w-full max-w-md">
              Your browser does not support the audio tag.
            </audio>
          </div>
        </div>
      );
    }

    // For non-previewable files
    return (
      <div className="flex flex-col justify-center items-center h-full text-center">
        <div className="w-24 h-24 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📄</span>
        </div>
        <h3 className="text-lg font-medium mb-2">{document.filename}</h3>
        <p className="text-muted-foreground mb-4">
          Preview not available for this file type
        </p>
        <div className="flex gap-2">
          <Button onClick={handleDownload} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={handleOpenInNewTab} variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate">{document.filename}</span>
            <div className="flex items-center gap-2 ml-4">
              {isPreviewable && (
                <>
                  {(isImage || isPDF) && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleZoomOut}
                        disabled={zoom <= 25}
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-sm min-w-[3rem] text-center">{zoom}%</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleZoomIn}
                        disabled={zoom >= 200}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {isImage && (
                    <Button variant="ghost" size="sm" onClick={handleRotate}>
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  )}
                </>
              )}
              <Button variant="ghost" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleOpenInNewTab}>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden bg-muted/20 rounded-lg">
          {renderPreview()}
        </div>

        <DialogFooter className="flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {document.file_type} • {formatFileSize(document.file_size)}
              {document.uploaded_at && (
                <> • Uploaded {new Date(document.uploaded_at).toLocaleDateString()}</>
              )}
            </div>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export default DocumentViewer;
