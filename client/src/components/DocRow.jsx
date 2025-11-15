import React from "react";
import { useNavigate } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, File, FileText, Sheet, Presentation, FileImage, Download, Pencil, MoreVertical, RotateCcw } from "lucide-react";
import MoveToMenu from "./MoveToMenu";
import { formatBytes } from "@/pages/DocumentCenter";

// Utility to clear a stuck pointer-events: none on the body
function clearBodyPointerEventsIfStuck() {
  if (document.body.style.pointerEvents === "none") {
    document.body.style.pointerEvents = "";
  }
}

export default function DocRow({ doc, onEdit, onDelete, onMove, folders, isTrashView = false, onRestore, onPermanentDelete }) {
  const navigate = useNavigate();
  return (
    <TableRow className="hover:bg-secondary/20">
      <TableCell>
        <div className="flex items-center gap-2">
          {doc.file_type?.startsWith("image/") ? (
           <FileImage className="h-5 w-5 text-primary" />
          ) : ['docx', 'doc'].includes(doc.file_type) || 
               doc.file_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               doc.file_type === 'application/msword' ? (
            <FileText className="h-5 w-5 text-primary" />
          ) : ['xlsx', 'xls'].includes(doc.file_type) || 
               doc.file_type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
               doc.file_type === 'application/vnd.ms-excel' ? (
            <Sheet className="h-5 w-5 text-primary" />
          ) : ['pptx', 'ppt'].includes(doc.file_type) || 
               doc.file_type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || 
               doc.file_type === 'application/vnd.ms-powerpoint' ? (
            <Presentation className="h-5 w-5 text-primary" />
          ) : ['pdf'].includes(doc.file_type) || doc.file_type === 'application/pdf' ? (
            <FileText className="h-5 w-5 text-primary" />
          ) : (
            <File className="h-4 w-4 text-muted-foreground" />
          )}
          <div className="font-medium break-all">{doc.filename}</div>
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">{doc.file_type}</TableCell>
      <TableCell className="hidden md:table-cell">{formatBytes(doc.file_size || 0)}</TableCell>
      <TableCell className="hidden xl:table-cell">
        {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleString() : "—"}
      </TableCell>
      <TableCell className="hidden lg:table-cell">{doc.uploader?.username || "—"}</TableCell>
      <TableCell className="hidden lg:table-cell">{doc.product?.product_name || "—"}</TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="flex flex-wrap gap-1">
        {doc.tags?.length
          ? doc.tags.map((tag, i) => (
            <span
            key={i}
            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
                {tag}
              </span>
            ))
            : "—"}
            </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell">{doc.folder?.name || "—"}</TableCell>

      <TableCell className="text-right">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4}>
            {doc.file_url && (
              <>
                <DropdownMenuItem
                  onSelect={() => {
                    setTimeout(() => {
                      navigate(`/dashboard/document-viewer/${doc.document_id}`);
                      clearBodyPointerEventsIfStuck();
                    }, 0);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" /> View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setTimeout(() => {
                      window.open(doc.file_url, "_blank", "noopener,noreferrer");
                      clearBodyPointerEventsIfStuck();
                    }, 0);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" /> Open / Download
                </DropdownMenuItem>
              </>
            )}
            {!isTrashView && (
              <>
                <DropdownMenuItem
                  onSelect={() => {
                    setTimeout(() => {
                      onEdit?.(doc);
                      clearBodyPointerEventsIfStuck();
                    }, 0);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <MoveToMenu
                  folders={folders}
                  currentFolderId={doc.folder_id ?? null}
                  onMove={(folderId) => onMove?.(doc, folderId)}
                />

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => {
                    setTimeout(() => {
                      onDelete?.(doc);
                      clearBodyPointerEventsIfStuck();
                    }, 0);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </>
            )}

            {isTrashView && (
              <>
                <DropdownMenuItem
                  onSelect={() => {
                    setTimeout(() => {
                      onRestore?.(doc);
                      clearBodyPointerEventsIfStuck();
                    }, 0);
                  }}
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Restore
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => {
                    setTimeout(() => {
                      onPermanentDelete?.(doc);
                      clearBodyPointerEventsIfStuck();
                    }, 0);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete permanently
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
