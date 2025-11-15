import { useContext, useEffect, useState } from "react"
import { DataTable } from "@/components/DataTable"
import { API } from "@/config/api"
import { AuthContext } from "@/providers/authProvider"

const columnsConfigRaw = [
  { accessorKey: "username", header: "User Name", type: "text", canAdd: true, canEdit: false, canShow: true },
  { accessorKey: "password", header: "Password", type: "password", canAdd: true, canEdit: false, canShow: false },
  { accessorKey: "first_name", header: "First Name", type: "text", canAdd: true, canEdit: true, canShow: true },
  { accessorKey: "last_name", header: "Last Name", type: "text", canAdd: true, canEdit: true, canShow: true },
  { accessorKey: "email", header: "Email", type: "email", canAdd: true, canEdit: false, canShow: true },
  { accessorKey: "phone_number", header: "Phone Number", type: "text", canAdd: true, canEdit: true, canShow: true },
  { accessorKey: "location", header: "Location", type: "text", canAdd: true, canEdit: true, canShow: true },
  {
    accessorKey: "role_id",
    header: "Role",
    type: "select",
    canAdd: true,
    canEdit: true,
    fetchDuringAdding: true,
    fetchUrl: API.GET_ROLES,
    labelKey: "role_name",
    valueKey: "role_id",
    responseKey: "userRoles" // NEW: key in response JSON to extract array from
  },  
  { accessorKey: "created_at", header: "Created Date", type: "date", canAdd: false, canEdit: false, canShow: true, isTimestamp: true },
  { accessorKey: "user_id", header: "Id", type: "number", canAdd: false, canEdit: false, canShow: false, isId: true },
];

const validationRulesAdd = {
  username: { required: true, pattern: /^[a-zA-Z0-9_]{3,15}$/, message: "Invalid username" },
  password: { required: true, pattern: /^.{6,}$/, message: "Password must be at least 6 characters" },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
  first_name: { required: true },
  last_name: { required: true },
  phone_number: { required: false, pattern: /^[0-9]{10,}$/, message: "Phone number must be at least 10 digits" },
  role_id: { required: true, message: "Role is required" }, // Added validation rule for role_id
};

const validationRulesUpdate = {
  username: { required: true, pattern: /^[a-zA-Z0-9_]{3,15}$/, message: "Invalid username" },
  password: { required: false }, // Not required on update
  email: { required: false }, // Email cannot be changed
  first_name: { required: true },
  last_name: { required: true },
  phone_number: { required: false, pattern: /^[0-9]{10,}$/, message: "Phone number must be at least 10 digits" },
  role_id: { required: true, message: "Role is required" }, // Added validation rule for role_id
};

const apiEndpoints = {
  get: API.GET_TANENTUSERS,
  post: API.ADD_TANENTUSER,
  put: API.UPDATE_TANENTUSER,
  delete: API.DELETE_TANENTUSER,
};

export default function TanentUsers() {
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

  return <DataTable columnsConfig={columnsConfig} apiEndpoints={apiEndpoints} token={token} tablePermissions={tablePermissions} validationRulesAdd= {validationRulesAdd} validationRulesUpdate={validationRulesUpdate} />;
}
