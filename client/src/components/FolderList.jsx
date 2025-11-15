import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Folder as FolderIcon, FolderOpen, MoreVertical, Pencil, Trash2, Check, X } from "lucide-react";

export default function FolderList({ folders, onOpen, onRename, onDelete }) {
  const [inlineEditId, setInlineEditId] = useState(null);
  const [newName, setNewName] = useState("");

  const startEdit = (folder) => { setInlineEditId(folder.folder_id); setNewName(folder.name); };
  const cancelEdit = () => { setInlineEditId(null); setNewName(""); };
  const commitEdit = () => { onRename(inlineEditId, newName); cancelEdit(); };

  if (!folders?.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
      {folders.map((folder) => (
        <div key={folder.folder_id} className="flex items-center justify-between rounded-xl border p-3 hover:bg-secondary/20">
          <div className="flex items-center gap-3">
            <button onClick={() => onOpen(folder.folder_id)}>
              <FolderIcon className="h-5 w-5 hover:text-primary cursor-pointer" />
            </button>
            {inlineEditId === folder.folder_id ? (
              <div className="flex items-center gap-2">
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} className="h-8 w-40" />
                <Button size="sm" variant="secondary" onClick={commitEdit}><Check className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={cancelEdit}><X className="h-4 w-4" /></Button>
              </div>
            ) : (
              <div className="cursor-pointer" onClick={() => onOpen(folder.folder_id)}>
                <div className="font-medium truncate max-w-[220px]">{folder.name}</div>
                <div className="text-xs text-muted-foreground">
                  {folder.file_count || 0} {folder.file_count === 1 ? 'file' : 'files'}
                </div>
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onOpen(folder.folder_id)}>
                <FolderOpen className="mr-2 h-4 w-4" /> Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => startEdit(folder)}>
                <Pencil className="mr-2 h-4 w-4" /> Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(folder.folder_id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}
