import React from "react";
import { DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";

// Renders a nested "Move to" menu from a flat folders array
export default function MoveToMenu({ folders, currentFolderId, onMove }) {
  // For simplicity, build a tree in-memory (parent_id assumed present)
  const byParent = folders.reduce((acc, f) => {
    const pid = f.parent_id ?? null;
    acc[pid] = acc[pid] || [];
    acc[pid].push(f);
    return acc;
  }, {});

  const renderNode = (parentId = null) => {
    const children = byParent[parentId] || [];
    return children.map((f) => (
      <DropdownMenuSub key={f.folder_id}>
        <DropdownMenuSubTrigger>{f.name}</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem onClick={() => onMove(f.folder_id)}>Move here</DropdownMenuItem>
          {byParent[f.folder_id]?.length ? renderNode(f.folder_id) : null}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    ));
  };

  return (
    <>
      <DropdownMenuItem onClick={() => onMove(null)}>Root</DropdownMenuItem>
      {renderNode(null)}
    </>
  );
}