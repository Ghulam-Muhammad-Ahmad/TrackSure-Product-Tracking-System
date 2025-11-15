import { useContext, useEffect, useState } from "react"
import { DataTable } from "@/components/DataTable"
import { API } from "@/config/api"
import { AuthContext } from "@/providers/authProvider"

const columnsConfigRaw = [
  { accessorKey: "category_id", header: "Category Id", type: "number", canAdd: false, canEdit: false, canShow: false, isId: true },
  { accessorKey: "category_name", header: "Category Name", type: "text", canAdd: true, canEdit: true, canShow: true },
];

const apiEndpoints = {
  get: API.GET_TANENTCATEGORIES,
  post: API.ADD_TANENTCATEGORY,
  put: API.UPDATE_TANENTCATEGORY,
  delete: API.DELETE_TANENTCATEGORY,
};

const validationRulesAdd = {
  category_name: { required: true, message: "Category name is required" },
};

const validationRulesUpdate = {
  category_name: { required: true, message: "Category name is required" },
};

export default function TanentCategories() {
  const { token, profile } = useContext(AuthContext);
  const [columnsConfig, setColumnsConfig] = useState(columnsConfigRaw);
  const permissions = profile.roles_users_role_idToroles.permissions;
  const tablePermissions = {
    canAddItem: permissions.includes("CATEGORY_CREATE"),
    canViewItem: permissions.includes("CATEGORY_READ"),
    canEditItem: permissions.includes("CATEGORY_UPDATE"),
    canDeleteItem: permissions.includes("CATEGORY_DELETE"),
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
                  label: opt[col.labelKey],
                  value: opt[col.valueKey],
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
