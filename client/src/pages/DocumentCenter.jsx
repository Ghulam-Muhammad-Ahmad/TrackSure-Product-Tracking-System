import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Select from "react-select";
import { toast, Toaster } from "sonner";
import { Search, RefreshCw, Upload, PlusCircle } from "lucide-react";
import { API } from "../config/api";
import { AuthContext } from "../providers/authProvider";
import { validateDocumentFile, getShortFileType } from "../utils/fileValidation";
import DocumentDropZone from "@/components/DocumentDropZone";
import FolderBreadcrumbs from "@/components/FolderBreadcrumbs";
import DocRow from "@/components/DocRow";
import FolderList from "@/components/FolderList";
import MoveToMenu from "@/components/MoveToMenu";

export default function DocumentCenter() {
  const { token } = useContext(AuthContext);
  const authHeader = { "x-jwt-bearer": token, "Content-Type": "application/json" };

  // Core state
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [trashDocuments, setTrashDocuments] = useState([]);
  const [folders, setFolders] = useState([]); // {folder_id, name, parent_id}
  const [currentFolderId, setCurrentFolderId] = useState(null); // null = root
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState("active");
  const isTrashView = viewMode === "trash";

  // Products state
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Upload state (URL mode)
  const [openUploadSheet, setOpenUploadSheet] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localFiles, setLocalFiles] = useState([]);
  const [filename, setFilename] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [uploadTags, setUploadTags] = useState("");
  const [uploadPermissions, setUploadPermissions] = useState("");
  const [uploadFolderId, setUploadFolderId] = useState(null);

  // Edit state
  const [editingDoc, setEditingDoc] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editFilename, setEditFilename] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editFolderId, setEditFolderId] = useState(null);
  const [editSelectedProductId, setEditSelectedProductId] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Folder modals (simple inline actions handled in FolderList for brevity)
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");


  const fetchFolders = async () => {
    try {
      const res = await fetch(API.GET_FOLDERS, { headers: authHeader });
      const data = await res.json();
      setFolders(Array.isArray(data) ? data : (data?.data || []));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFolderFileCounts = async () => {
    try {
      const res = await fetch(API.GET_FOLDER_FILE_COUNTS, { headers: authHeader });
      const fileCounts = await res.json();
      
      // Update folders with file counts
      setFolders(prevFolders => 
        prevFolders.map(folder => {
          const countData = fileCounts.find(fc => fc.folder_id === folder.folder_id);
          return {
            ...folder,
            file_count: countData ? countData.file_count : 0
          };
        })
      );
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(API.GET_PRODUCTS, { headers: { "x-jwt-bearer": token } });
      const data = await res.json();
      // Based on the provided sample response, the API directly returns an array of products.
      // Therefore, we can simplify the assignment to directly use the `data` received.
      setProducts(data);
    } catch (e) {
      console.error(e);
      // Optionally, clear products on error to reflect an empty state
      setProducts([]);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch(API.GET_DOCUMENTS, { headers: { "x-jwt-bearer": token } });
      const data = await res.json();
      // Based on the server-side `getDocumentsService`, the API directly returns an array of documents.
      // Therefore, we can simplify the assignment to directly use the `data` received.
      setDocuments(data);
    } catch (e) {
      console.error(e);
      // Optionally, clear documents on error to reflect an empty state
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrashDocuments = async () => {
    try {
      const res = await fetch(API.GET_TRASH_DOCUMENTS, { headers: { "x-jwt-bearer": token } });
      const data = await res.json();
      setTrashDocuments(Array.isArray(data) ? data : (data?.data || []));
    } catch (e) {
      console.error(e);
      setTrashDocuments([]);
    }
  };

  useEffect(() => { 
    fetchFolders(); 
    fetchDocuments(); 
    fetchTrashDocuments();
    fetchProducts(); 
  }, []);

  // Fetch file counts after folders are loaded
  useEffect(() => {
    if (folders.length > 0) {
      fetchFolderFileCounts();
    }
  }, [folders.length]);

  // Cleanup body styles when no overlays are open
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (!document.querySelector('[data-state="open"]')) {
        document.body.style.pointerEvents = "auto";
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => observer.disconnect();
  }, []);

  // Derived: path (breadcrumbs)
  const path = useMemo(() => {
    const byId = new Map(folders.map(f => [f.folder_id, f]));
    const chain = [];
    let node = currentFolderId ? byId.get(currentFolderId) : null;
    while (node) {
      chain.unshift({ folder_id: node.folder_id, name: node.name });
      node = node.parent_id ? byId.get(node.parent_id) : null;
    }
    chain.unshift({ folder_id: null, name: "All Documents" });
    return chain;
  }, [folders, currentFolderId]);

  // Derived: children folders + docs in current folder
  const childFolders = useMemo(() => folders.filter(f => (f.parent_id ?? null) === (currentFolderId ?? null)), [folders, currentFolderId]);

  const displayedDocs = useMemo(() => {
    const q = query.toLowerCase();
    if (isTrashView) {
      return trashDocuments.filter(d => (d.filename || "").toLowerCase().includes(q));
    }
    return documents
      .filter(d => (d.folder_id ?? null) === (currentFolderId ?? null))
      .filter(d => (d.filename || "").toLowerCase().includes(q));
  }, [documents, trashDocuments, currentFolderId, query, isTrashView]);

  /*****************
   * Folder actions
   *****************/
  const addFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const payload = { name: newFolderName.trim(), parent_id: currentFolderId };
      await fetch(API.ADD_FOLDER, { method: "POST", headers: authHeader, body: JSON.stringify(payload) });
      setNewFolderName("");
      setCreatingFolder(false);
      fetchFolders();
    } catch (e) { console.error(e); }
  };

  const renameFolder = async (folder_id, name) => {
    try {
      const payload = { folder_id, name };
      const response = await fetch(API.UPDATE_FOLDER, { 
        method: "PUT", 
        headers: authHeader, 
        body: JSON.stringify(payload) 
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to rename folder");
      }
      
      fetchFolders();
      toast.success("Folder renamed successfully!");
    } catch (e) { 
      console.error("Rename folder error:", e);
      toast.error(e.message || "Failed to rename folder.");
    }
  };

  const deleteFolder = async (folder_id) => {
    try {
      await fetch(`${API.DELETE_FOLDER}/${folder_id}`, { method: "DELETE", headers: { "x-jwt-bearer": token } });
      if (currentFolderId === folder_id) setCurrentFolderId(null);
      fetchFolders();
      fetchDocuments();
    } catch (e) { console.error(e); }
  };

  const moveDocumentTo = async (doc, folderId) => {
    try {
      const payload = {
        document_id: doc.document_id,
        filename: doc.filename,
        file_url: doc.file_url,
        file_type: doc.file_type,
        file_size: Number(doc.file_size || 0),
        folder_id: folderId,
        tags: doc.tags || [],
        product_id: doc.product_id
      };
      
      const response = await fetch(API.UPDATE_DOCUMENT, { 
        method: "PUT", 
        headers: authHeader, 
        body: JSON.stringify(payload) 
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to move document");
      }
      
      await fetchDocuments();
      await fetchFolderFileCounts();
      const folderName = folderId ? folders.find(f => f.folder_id === folderId)?.name || "Unknown" : "Root";
      toast.success(`Document moved to ${folderName}!`);
    } catch (e) { 
      console.error("Move document error:", e);
      toast.error(e.message || "Failed to move document.");
    }
  };

  /*****************
   * Doc CRUD
   *****************/
  const onFilesChosen = (files) => {
    const f = files?.[0];
    if (!f) return;
    
    // Validate document file (30MB max)
    const validation = validateDocumentFile(f);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }
    
    setLocalFiles(files);
    setFilename(f.name.replace(/\.[^/.]+$/, ""));
    setFileType(f.type || f.name.split(".").pop());
    setFileSize(String(f.size));
  };

  const handleAddDocument = async () => {
    if (!localFiles.length) return;
    setUploading(true);
    try {
      const file = localFiles[0];

      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(API.UPLOAD_DOCUMENT_CLOUDINARY, { method: "POST", headers: { "x-jwt-bearer": token }, body: formData });

      // Check if response is JSON
      const contentType = uploadRes.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Please check server configuration.");
      }

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.message || "Failed to upload to Cloudinary");

      const file_url = uploadData.url;

      const payload = { filename, file_url, file_type: getShortFileType(fileType), file_size: Number(fileSize), folder_id: uploadFolderId, tags: uploadTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''), permissions: uploadPermissions.split(',').map(p => p.trim()).filter(p => p !== ''), product_id: selectedProductId };
      await fetch(API.ADD_DOCUMENT, { method: "POST", headers: authHeader, body: JSON.stringify(payload) });
      setFilename(""); setLocalFiles([]);
      setUploadTags(""); setUploadPermissions(""); setSelectedProductId(null); setUploadFolderId(null);
      setOpenUploadSheet(false);
      fetchDocuments();
      fetchFolderFileCounts();
      toast.success("Document added successfully!");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to add document.");
    } finally { setUploading(false); }
  };

  const handleDelete = async (doc) => {
    try {
      const response = await fetch(`${API.DELETE_DOCUMENT}/${doc.document_id}`, { method: "DELETE", headers: { "x-jwt-bearer": token } });
      const result = await response.json();
      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || "Failed to move document to trash.");
      }
      await fetchDocuments();
      await fetchTrashDocuments();
      await fetchFolderFileCounts();
      toast.success("Document moved to trash.");
    } catch (e) { 
      console.error(e); 
      toast.error(e.message || "Failed to delete document.");
    }
  };

  const handleRestore = async (doc) => {
    try {
      const response = await fetch(`${API.RESTORE_DOCUMENT}/${doc.document_id}`, { method: "PATCH", headers: { "x-jwt-bearer": token } });
      const result = await response.json();
      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || "Failed to restore document.");
      }
      await fetchDocuments();
      await fetchTrashDocuments();
      toast.success("Document restored.");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to restore document.");
    }
  };

  const handlePermanentDelete = async (doc) => {
    try {
      const response = await fetch(`${API.PERMANENT_DELETE_DOCUMENT}/${doc.document_id}`, { method: "DELETE", headers: { "x-jwt-bearer": token } });
      const result = await response.json();
      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || "Failed to permanently delete document.");
      }
      await fetchTrashDocuments();
      toast.success("Document permanently deleted.");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to permanently delete document.");
    }
  };

  const openEdit = (doc) => {
    setEditingDoc(doc);
    setEditOpen(true);
    setEditFilename(doc.filename || "");
    setEditTags(doc.tags ? doc.tags.join(", ") : "");
    setEditFolderId(doc.folder_id || null);
    setEditSelectedProductId(doc.product_id || null);
  };


  const submitEdit = async () => {
    if (!editingDoc || editSubmitting) return;

    setEditSubmitting(true);
    try {
      const payload = {
        document_id: editingDoc.document_id,
        filename: editFilename,
        file_url: editingDoc.file_url,
        file_type: editingDoc.file_type,
        file_size: Number(editingDoc.file_size),
        folder_id: editFolderId,
        tags: editTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        product_id: editSelectedProductId
      };

      const response = await fetch(API.UPDATE_DOCUMENT, {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update document");
      }

      // Close modal and refresh data
      setEditOpen(false);
      setEditingDoc(null);
      await fetchDocuments();
      await fetchFolderFileCounts();
      toast.success("Document updated successfully!");

    } catch (e) {
      console.error("Edit submission error:", e);
      toast.error(e.message || "Failed to update document.");
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Document Center</h1>
          <p className="text-sm text-muted-foreground">Browse, add, update, delete, and organize documents inside folders.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="gap-2" onClick={() => { fetchFolders(); fetchDocuments(); fetchTrashDocuments(); }}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>

          <Button variant="outline" className="gap-2" onClick={() => setCreatingFolder(true)} disabled={isTrashView}>
            <PlusCircle className="h-4 w-4" /> New Folder
          </Button>

          <div className="flex rounded-xl border">
            <Button
              variant={isTrashView ? "ghost" : "default"}
              className="rounded-none rounded-l-xl"
              onClick={() => setViewMode("active")}
              disabled={!isTrashView}
            >
              Documents
            </Button>
            <Button
              variant={isTrashView ? "default" : "ghost"}
              className="rounded-none rounded-r-xl"
              onClick={() => setViewMode("trash")}
            >
              Trash
            </Button>
          </div>

          <Sheet open={openUploadSheet} onOpenChange={setOpenUploadSheet}>
            <SheetTrigger asChild>
              <Button className="gap-2" disabled={isTrashView}>
                <Upload className="h-4 w-4" /> Add Document
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-2xl px-6 pt-6" >
              <SheetHeader>
                <SheetTitle>Add document</SheetTitle>
              </SheetHeader>

              <div className="mt-4 space-y-4">
                <DocumentDropZone onFiles={onFilesChosen} disabled={uploading} />
                {localFiles.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Prefilled from: <strong>{localFiles[0].name}</strong>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Filename</Label>
                  <Input value={filename} onChange={(e) => setFilename(e.target.value)} placeholder="e.g. spec-v1.pdf" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>File type (MIME or ext)</Label>
                    <Input value={fileType} onChange={(e) => setFileType(e.target.value)} placeholder="" className="pointer-events-none opacity-75" />
                  </div>
                  <div className="space-y-2">
                    <Label>File size (bytes)</Label>
                    <Input type="number" value={fileSize} onChange={(e) => setFileSize(e.target.value)} placeholder="" className="pointer-events-none opacity-75" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags (comma-separated)</Label>
                  <Input value={uploadTags} onChange={(e) => setUploadTags(e.target.value)} placeholder="e.g. report, urgent" />
                </div>
                {/* <div className="space-y-2">
                  <Label>Permissions (comma-separated)</Label>
                  <Input value={uploadPermissions} onChange={(e) => setUploadPermissions(e.target.value)} placeholder="e.g. read, write" />
                </div> */}

                <div className="space-y-2">
                  <Label>Folder</Label>
                  <Select
                    value={uploadFolderId ? { value: uploadFolderId, label: folders.find(f => f.folder_id === uploadFolderId)?.name || "Root" } : null}
                    onChange={(option) => setUploadFolderId(option ? option.value : null)}
                    options={[{ value: null, label: "Root" }, ...folders.map(f => ({ value: f.folder_id, label: f.name }))]
                    }
                    placeholder="Select a folder"
                    isClearable
                    isSearchable
                  />
                </div>

                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select
                    value={selectedProductId ? products.map(product => ({ value: product.product_id.toString(), label: product.product_name })).find(option => option.value === selectedProductId) : null}
                    onChange={(option) => setSelectedProductId(option ? option.value : null)}
                    options={products.map(product => ({
                      value: product.product_id.toString(),
                      label: product.product_name
                    }))}
                    placeholder="Select a product"
                    isClearable
                    isSearchable
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="secondary" onClick={() => setOpenUploadSheet(false)} disabled={uploading}>Cancel</Button>
                  <Button onClick={handleAddDocument} disabled={uploading || !filename || !fileType || !fileSize}>
                    {uploading ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        {isTrashView ? (
          <div>
            <h2 className="text-xl font-semibold">Trash</h2>
            <p className="text-sm text-muted-foreground">Files stay here until restored or permanently deleted.</p>
          </div>
        ) : (
          <FolderBreadcrumbs path={path} onNavigate={setCurrentFolderId} />
        )}
        <div className="md:w-80">
          <div className="flex items-center gap-2 rounded-xl border bg-secondary/20 px-3 py-0">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search filenames..." className="border-0 bg-transparent focus-visible:ring-0 shadow-none" />
          </div>
        </div>
      </div>

      {/* Folders */}
      {!isTrashView && (
        <FolderList folders={childFolders} onOpen={setCurrentFolderId} onRename={renameFolder} onDelete={deleteFolder} />
      )}

      {/* Documents Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow>
                <TableHead>Filename</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Size</TableHead>
                <TableHead className="hidden xl:table-cell">Uploaded</TableHead>
                <TableHead className="hidden lg:table-cell">Uploader</TableHead>
                <TableHead className="hidden lg:table-cell">Product</TableHead>
                <TableHead className="hidden lg:table-cell">Tags</TableHead>
                <TableHead className="hidden lg:table-cell">Folder</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedDocs.length ? (
                displayedDocs.map((doc) => (
                  <DocRow
                    key={doc.document_id}
                    doc={doc}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onMove={moveDocumentTo}
                    folders={folders}
                    isTrashView={isTrashView}
                    onRestore={handleRestore}
                    onPermanentDelete={handlePermanentDelete}
                  />
                ))
              ) : (
                <TableRow>
                  <TableHead className="p-6 text-sm text-muted-foreground">No documents found.</TableHead>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={setEditOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit document</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Filename</Label>
              <Input value={editFilename} onChange={(e) => setEditFilename(e.target.value)} placeholder="e.g. spec-v1.pdf" />
            </div>

            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input value={editTags} onChange={(e) => setEditTags(e.target.value)} placeholder="e.g. report, urgent" />
            </div>

            <div className="space-y-2">
              <Label>Folder</Label>
              <Select
                value={editFolderId ? { value: editFolderId, label: folders.find(f => f.folder_id === editFolderId)?.name || "Root" } : null}
                onChange={(option) => setEditFolderId(option ? option.value : null)}
                options={[{ value: null, label: "Root" }, ...folders.map(f => ({ value: f.folder_id, label: f.name }))]
                }
                placeholder="Select a folder"
                isClearable
                isSearchable
              />
            </div>

            <div className="space-y-2">
              <Label>Product</Label>
              <Select
                value={editSelectedProductId ? products.map(product => ({ value: product.product_id.toString(), label: product.product_name })).find(option => option.value === editSelectedProductId) : null}
                onChange={(option) => setEditSelectedProductId(option ? option.value : null)}
                options={products.map(product => ({
                  value: product.product_id.toString(),
                  label: product.product_name
                }))}
                placeholder="Select a product"
                isClearable
                isSearchable
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditOpen(false)} disabled={editSubmitting}>Cancel</Button>
            <Button onClick={submitEdit} disabled={editSubmitting}>
              {editSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Folder Inline Row */}
      {creatingFolder && (
        <div className="mt-3 flex items-center gap-2">
          <Input placeholder="New folder name" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} className="max-w-xs" />
          <Button size="sm" onClick={addFolder}>Create</Button>
          <Button size="sm" variant="ghost" onClick={() => { setCreatingFolder(false); setNewFolderName(""); }}>Cancel</Button>
        </div>
      )}


      <Toaster richColors position="bottom-right" />
    </div>
  );
}

export const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 B";
  const k = 1024, sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const fileIconName = (type = "") => (type.toLowerCase().includes("pdf") ? "FileText" : "File");