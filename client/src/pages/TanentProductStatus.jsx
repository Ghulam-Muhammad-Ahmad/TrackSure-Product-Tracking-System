import { useContext, useEffect, useState } from "react"
import { DataTable } from "@/components/DataTable"
import { API } from "@/config/api"
import { AuthContext } from "@/providers/authProvider"

const columnsConfigRaw = [
  { accessorKey: "id", header: "Id", type: "number", canAdd: false, canEdit: false, canShow: false, isId: true },
  { accessorKey: "status", header: "Status", type: "text", canAdd: true, canEdit: true, canShow: true },
  { accessorKey: "color_hex", header: "Color", type: "color", canAdd: true, canEdit: true, canShow: true, defaultValue: "#6B7280" },
];

const apiEndpoints = {
  get: API.GET_STATUSES,
  post: API.ADD_STATUS,
  put: API.UPDATE_STATUS,
  delete: API.DELETE_STATUS,
};

const validationRulesAdd = {
  status: { required: true, message: "Status is required" },
  color_hex: { required: false },
};

const validationRulesUpdate = {
  status: { required: true, message: "Status is required" },
  color_hex: { required: false },
};

export default function TanentProductStatus() {
  const { token, profile } = useContext(AuthContext);
  const [columnsConfig, setColumnsConfig] = useState(columnsConfigRaw);
  const permissions = profile.roles_users_role_idToroles.permissions;
  const tablePermissions = {
    canAddItem: permissions.includes("PRODUCT_STATUS_CREATE"),
    canViewItem: permissions.includes("PRODUCT_STATUS_READ"),
    canEditItem: permissions.includes("PRODUCT_STATUS_UPDATE"),
    canDeleteItem: permissions.includes("PRODUCT_STATUS_DELETE"),
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
