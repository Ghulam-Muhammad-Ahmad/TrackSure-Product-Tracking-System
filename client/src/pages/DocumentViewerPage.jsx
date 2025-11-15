import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Printer, ZoomIn, ZoomOut, RotateCw, ExternalLink, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { API } from "../config/api";
import { AuthContext } from "../providers/authProvider";

const DocumentViewerPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    fetchDocument();
  }, [documentId]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(API.GET_DOCUMENTS, {
        headers: { "x-jwt-bearer": token }
      });
      const documents = await response.json();
      const doc = documents.find(d => d.document_id === parseInt(documentId));
      
      if (doc) {
        setDocument(doc);
      } else {
        toast.error("Document not found");
        navigate("/document-center");
      }
    } catch (error) {
      console.error("Failed to fetch document:", error);
      toast.error("Failed to load document");
      navigate("/document-center");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading document...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Document not found</p>
          <Button onClick={() => navigate("/document-center")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Document Center
          </Button>
        </div>
      </div>
    );
  }

  const isImage = document.file_type?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(document.file_type);
  const isPDF = document.file_type === 'application/pdf' || document.file_type === 'pdf';
  const isVideo = document.file_type?.startsWith('video/') || ['mp4', 'avi', 'mov'].includes(document.file_type);
  const isAudio = document.file_type?.startsWith('audio/') || ['mp3', 'wav'].includes(document.file_type);
  const isOfficeDoc = ['docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt'].includes(document.file_type) ||
                     document.file_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                     document.file_type === 'application/msword' ||
                     document.file_type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                     document.file_type === 'application/vnd.ms-excel' ||
                     document.file_type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
                     document.file_type === 'application/vnd.ms-powerpoint';
  const isPreviewable = isImage || isPDF || isVideo || isAudio || isOfficeDoc;

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
    if (isImage || isPDF || isOfficeDoc) {
      const printWindow = window.open(document.file_url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } else {
      toast.info('Print is only available for images, PDFs, and Office documents');
    }
  };

  const handleOpenInNewTab = () => {
    window.open(document.file_url, '_blank', 'noopener,noreferrer');
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const renderPreview = () => {
    if (isImage) {
      return (
        <div className="flex justify-center items-center h-full overflow-auto bg-muted/20 rounded-lg">
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
        <div className="h-full w-full bg-muted/20 rounded-lg">
          <iframe
            src={`${document.file_url}#zoom=${zoom}`}
            className="w-full h-full border-0 rounded-lg"
            title={document.filename}
          />
        </div>
      );
    }

    if (isOfficeDoc) {
      // Use Google Docs Viewer for Office documents
      const encodedUrl = encodeURIComponent(document.file_url);
      const viewerUrl = `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`;
      
      return (
        <div className="h-full w-full bg-muted/20 rounded-lg">
          <iframe
            src={viewerUrl}
            className="w-full h-full border-0 rounded-lg"
            title={document.filename}
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="flex justify-center items-center h-full bg-muted/20 rounded-lg">
          <video
            src={document.file_url}
            controls
            className="max-w-full max-h-full rounded-lg"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (isAudio) {
      return (
        <div className="flex justify-center items-center h-full bg-muted/20 rounded-lg">
          <div className="text-center p-8">
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto bg-secondary rounded-full flex items-center justify-center">
                <span className="text-4xl">🎵</span>
              </div>
            </div>
            <h3 className="text-xl font-medium mb-6">{document.filename}</h3>
            <audio src={document.file_url} controls className="w-full max-w-md">
              Your browser does not support the audio tag.
            </audio>
          </div>
        </div>
      );
    }

    if (isOfficeDoc) {
      // Use Google Docs Viewer for Office documents
      const encodedUrl = encodeURIComponent(document.file_url);
      const viewerUrl = `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`;
      
      return (
        <div className="h-full w-full bg-muted/20 rounded-lg">
          <iframe
            src={viewerUrl}
            className="w-full h-full border-0 rounded-lg"
            title={document.filename}
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-center items-center h-full text-center bg-muted/20 rounded-lg">
        <div className="w-32 h-32 mx-auto bg-secondary rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">📄</span>
        </div>
        <h3 className="text-xl font-medium mb-4">{document.filename}</h3>
        <p className="text-muted-foreground mb-6">
          Preview not available for this file type
        </p>
        <div className="flex gap-3">
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard/document-center")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-lg font-semibold truncate max-w-md">
                  {document.filename}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {document.file_type} • {formatFileSize(document.file_size)}
                  {document.uploaded_at && (
                    <> • Uploaded {new Date(document.uploaded_at).toLocaleDateString()}</>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="h-[calc(100vh-200px)]">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerPage;
