 import { useContext, useEffect, useState } from "react"
import { DataTable } from "@/components/DataTable"
import { API } from "@/config/api"
import { AuthContext } from "@/providers/authProvider"

const columnsConfigRaw = [
  { accessorKey: "id", header: "Log Id", type: "number", canAdd: false, canEdit: false, canShow: false, isId: true },
  { accessorKey: "activityName", header: "Activity Name", type: "text", canAdd: false, canEdit: false, canShow: true },
  { accessorKey: "userName", header: "User Name", type: "text", canAdd: false, canEdit: false, canShow: true },
  { accessorKey: "email", header: "Email", type: "text", canAdd: false, canEdit: false, canShow: true },
  { accessorKey: "activityDetail", header: "Activity Detail", type: "text", canAdd: false, canEdit: false, canShow: true },
  { accessorKey: "createdAt", header: "Created At", type: "date", canAdd: false, canEdit: false, canShow: true },
];

const apiEndpoints = {
  get: API.GET_ACTIVITYLOGS,
};

export default function TanentActivityLogs() {
  const { token } = useContext(AuthContext);
  const [columnsConfig, setColumnsConfig] = useState(columnsConfigRaw);
  const tablePermissions = {
    canAddItem: false,
    canViewItem: true,
    canEditItem: false,
    canDeleteItem:false,
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

  return <DataTable columnsConfig={columnsConfig} apiEndpoints={apiEndpoints} token={token} tablePermissions={tablePermissions} />;
}
