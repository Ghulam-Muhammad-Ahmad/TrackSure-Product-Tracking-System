import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function FolderBreadcrumbs({ path, onNavigate }) {
  // path: array of { folder_id|null, name }
  const lastIndex = path.length - 1;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {path.map((node, idx) => (
          <React.Fragment key={node.folder_id ?? "root"}>
            <BreadcrumbItem>
              {idx === lastIndex ? (
                <BreadcrumbPage>{node.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); onNavigate(node.folder_id ?? null); }}>
                  {node.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {idx !== lastIndex && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
