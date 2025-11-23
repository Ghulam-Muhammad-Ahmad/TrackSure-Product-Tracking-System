import { useContext, useEffect, useState } from "react"
import { DataTable } from "@/components/DataTable"
import { API } from "@/config/api"
import { AuthContext } from "@/providers/authProvider"

const columnsConfigRaw = [
  { accessorKey: "role_id", header: "Role Id", type: "number", canAdd: false, canEdit: false, canShow: false, isId: true },
  { accessorKey: "role_name", header: "Role Name", type: "text", canAdd: true, canEdit: true, canShow: true },
  {
    accessorKey: "permissions",
    header: "Permissions",
    type: "checkbox_group",
    canAdd: true,
    canEdit: true,
    canShow: true,
    groupData: [
      { label: "Create Product", value: "PRODUCT_CREATE", group: "Product" },
      { label: "Read Product", value: "PRODUCT_READ", group: "Product" },
      { label: "Update Product", value: "PRODUCT_UPDATE", group: "Product" },
      { label: "Delete Product", value: "PRODUCT_DELETE", group: "Product" },
    
      { label: "Create Product Status", value: "PRODUCT_STATUS_CREATE", group: "Product Status" },
      { label: "Read Product Status", value: "PRODUCT_STATUS_READ", group: "Product Status" },
      { label: "Update Product Status", value: "PRODUCT_STATUS_UPDATE", group: "Product Status" },
      { label: "Delete Product Status", value: "PRODUCT_STATUS_DELETE", group: "Product Status" },
    
      { label: "Create Category", value: "CATEGORY_CREATE", group: "Category" },
      { label: "Read Category", value: "CATEGORY_READ", group: "Category" },
      { label: "Update Category", value: "CATEGORY_UPDATE", group: "Category" },
      { label: "Delete Category", value: "CATEGORY_DELETE", group: "Category" },
    
      { label: "Create Role", value: "ROLE_CREATE", group: "Role" },
      { label: "Read Role", value: "ROLE_READ", group: "Role" },
      { label: "Update Role", value: "ROLE_UPDATE", group: "Role" },
      { label: "Delete Role", value: "ROLE_DELETE", group: "Role" },
    
      { label: "Create User", value: "USER_CREATE", group: "User" },
      { label: "Read User", value: "USER_READ", group: "User" },
      { label: "Update User", value: "USER_UPDATE", group: "User" },
      { label: "Delete User", value: "USER_DELETE", group: "User" },

      { label: "Create Document", value: "DOCUMENT_CREATE", group: "Document" },
      { label: "Read Document", value: "DOCUMENT_READ", group: "Document" },
      { label: "Update Document", value: "DOCUMENT_UPDATE", group: "Document" },
      { label: "Delete Document", value: "DOCUMENT_DELETE", group: "Document" },
    
      { label: "Create Document Folder", value: "DOCUMENT_FOLDER_CREATE", group: "Document Folder" },
      { label: "Read Document Folder", value: "DOCUMENT_FOLDER_READ", group: "Document Folder" },
      { label: "Update Document Folder", value: "DOCUMENT_FOLDER_UPDATE", group: "Document Folder" },
      { label: "Delete Document Folder", value: "DOCUMENT_FOLDER_DELETE", group: "Document Folder" }
    ],
    renderAsTable: true // Flag to indicate this should render as a table
  } 
];

const validationRulesAdd = {
  role_name: { required: true, message: "Role name is required" },
  permissions: { required: true, message: "At least one permission is required" },
};

const validationRulesUpdate = {
  role_name: { required: true, message: "Role name is required" },
  permissions: { required: true, message: "At least one permission is required" },
};

const apiEndpoints = {
  get: API.GET_ROLES,
  post: API.ADD_ROLE,
  put: API.UPDATE_ROLE,
  delete: API.DELETE_ROLE,
};

export default function TanentRoles() {
  const { token, profile } = useContext(AuthContext);
  const [columnsConfig, setColumnsConfig] = useState(columnsConfigRaw);
  const permissions = profile.roles_users_role_idToroles.permissions;
  const tablePermissions = {
    canAddItem: permissions.includes("ROLE_CREATE"),
    canViewItem: permissions.includes("ROLE_READ"),
    canEditItem: permissions.includes("ROLE_UPDATE"),
    canDeleteItem: permissions.includes("ROLE_DELETE"),
  };
  useEffect(() => {
    const fetchOptions = async () => {
      const updatedConfig = await Promise.all(
        columnsConfigRaw.map(async (col) => {
          if (col.type === "select" && col.optionsEndpoint) {
            try {
              const response = await fetch(col.optionsEndpoint, {
                headers: { "x-jwt-bearer": token },
              });
              const options = await response.json();
              return {
                ...col,
                options: options.map((opt) => ({
                  label: opt[col.optionLabelKey],
                  value: opt[col.optionValueKey],
                })),
              };
            } catch (err) {
              console.error(`Failed to fetch options for ${col.accessorKey}`, err);
              return col;
            }
          }
          return col;
        })
      );
      setColumnsConfig(updatedConfig);
    };

    fetchOptions();
  }, [token]);

  return <DataTable columnsConfig={columnsConfig} apiEndpoints={apiEndpoints} token={token} tablePermissions={tablePermissions} validationRulesAdd={validationRulesAdd} validationRulesUpdate={validationRulesUpdate} />;
}
