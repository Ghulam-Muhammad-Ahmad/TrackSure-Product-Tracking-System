import { useContext, useEffect, useState } from "react"
import { ProductTableData } from "@/components/ProductTableData"
import { API } from "@/config/api"
import { AuthContext } from "@/providers/authProvider"

const columnsConfigRaw = [
  {
    accessorKey: "image_url",
    header: "Product Image",
    type: "file",
    canAdd: true,
    canEdit: true,
    canShow: true,
    bulkEdit: false, // Added bulkEdit property
  },
  {
    accessorKey: "product_id",
    header: "Product Id",
    type: "number",
    canAdd: false,
    canEdit: false,
    canShow: false,
    isId: true,
    bulkEdit: false, // Added bulkEdit property
  },
  {
    accessorKey: "product_name",
    header: "Product Name",
    type: "text",
    canAdd: true,
    canEdit: true,
    canShow: true,
    bulkEdit: false, // Added bulkEdit property
  },
  
  {
    accessorKey: "category_id",
    displayField: "category_name", // comes from response: "category_name"
    header: "Category",
    type: "select",
    canAdd: true,
    canEdit: true,
    canShow: true,
    fetchDuringAdding: true,
    fetchUrl: API.GET_TANENTCATEGORIES,
    labelKey: "category_name",
    valueKey: "category_id",
    bulkEdit: true, // Added bulkEdit property
  },
  {
    accessorKey: "manufacturer_id",
    displayField: "manufacturer_name", // comes from response: "manufacturer_name"
    header: "Manufacturer",
    type: "select",
    canAdd: true,
    canShow: true,
    canEdit: true,
    fetchDuringAdding: true,
    fetchUrl: API.GET_TANENTUSERS,
    labelKey: "username",
    valueKey: "user_id",
    bulkEdit: true, // Added bulkEdit property
  },
  {
    accessorKey: "current_owner_id",
    displayField: "current_owner_name", // comes from response: "current_owner_name"
    header: "Current Owner",
    type: "select",
    canAdd: true,
    canEdit: true,
    canShow: true,
    fetchDuringAdding: true,
    fetchUrl: API.GET_TANENTUSERS,
    labelKey: "username",
    valueKey: "user_id",
    bulkEdit: true, // Added bulkEdit property
  },
  {
    accessorKey: "product_status_id",
    displayField: "product_status", // comes from response: "product_status"
    header: "Status",
    type: "select",
    canAdd: true,
    canShow: true,
    canEdit: true,
    fetchDuringAdding: true,
    fetchUrl: API.GET_STATUSES,
    labelKey: "status",
    valueKey: "id",
    bulkEdit: true, // Added bulkEdit property
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    type: "timestamp",
    canAdd: false,
    canEdit: false,
    canShow: true,
    isTimestamp: true,
    bulkEdit: false, // Added bulkEdit property
  },
  // {
  //   accessorKey: "updated_at",
  //   header: "Updated At",
  //   type: "timestamp",
  //   canAdd: false,
  //   canEdit: false,
  //   canShow: true,
  //   isTimestamp: true,
  //   bulkEdit: false, // Added bulkEdit property
  // }
];


const validationRulesAdd = {
  product_name: { required: true, message: "Product name is required" },
  category_id: { required: true, message: "Category is required" },
  manufacturer_id: { required: true, message: "Manufacturer is required" },
  current_owner_id: { required: true, message: "Current owner is required" },
  product_status_id: { required: true, message: "Product status is required" },
};

const validationRulesUpdate = {
  product_name: { required: true, message: "Product name is required" },
  category_id: { required: true, message: "Category is required" },
  manufacturer_id: { required: true, message: "Manufacturer is required" },
  current_owner_id: { required: true, message: "Current owner is required" },
  product_status_id: { required: true, message: "Product status is required" },
};

const apiEndpoints = {
  get: API.GET_PRODUCTS,
  post: API.CREATE_PRODUCT,
  put: API.UPDATE_PRODUCT,
  delete: API.DELETE_PRODUCT,
  bulkUpdate: API.BULK_PRODUCT_EDIT
};

export default function TanentProducts() {
  const { token, profile } = useContext(AuthContext);
  const [columnsConfig, setColumnsConfig] = useState(columnsConfigRaw);
  const permissions = profile.roles_users_role_idToroles.permissions;
  const tablePermissions = {
    canAddItem: permissions.includes("PRODUCT_CREATE"),
    canViewItem: permissions.includes("PRODUCT_READ"),
    canEditItem: permissions.includes("PRODUCT_UPDATE"),
    canDeleteItem: permissions.includes("PRODUCT_DELETE"),
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

  return <ProductTableData columnsConfig={columnsConfig} profile={profile} apiEndpoints={apiEndpoints} token={token} tablePermissions={tablePermissions} validationRulesAdd={validationRulesAdd} validationRulesUpdate={validationRulesUpdate} />;
}
