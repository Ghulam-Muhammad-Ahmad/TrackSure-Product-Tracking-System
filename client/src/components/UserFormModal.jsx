import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UserFormModal({
  open,
  onClose,
  onAddSubmit,
  onUpdateSubmit,
  defaultValues,
  columnsConfig,
  dropdownData,
  validationRulesAdd,
  validationRulesUpdate,
  submitting
}) {
  const [formData, setFormData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    const init = {};
    columnsConfig.forEach((col) => {
      if (col.canAdd || col.canEdit || col.isId) {
        init[col.accessorKey] =
          defaultValues?.[col.accessorKey] || (col.type === "checkbox_group" ? [] : "");
      }
    });
    setFormData(init);
    setFieldErrors({});
  }, [open, defaultValues, columnsConfig]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // ✅ Live Validation on Change
    const rules = defaultValues ? validationRulesUpdate : validationRulesAdd;
    const rule = rules[name];
    if (rule) {
      if (rule.required && !value) {
        setFieldErrors((prev) => ({ ...prev, [name]: rule.message || `${name} is required` }));
      } else if (rule.pattern && value && !rule.pattern.test(value)) {
        setFieldErrors((prev) => ({ ...prev, [name]: rule.message }));
      } else {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const validateForm = (data, isUpdate = false) => {
    const rules = isUpdate ? validationRulesUpdate : validationRulesAdd;
    const errors = {};

    for (let key in rules) {
      const rule = rules[key];
      const value = data[key];

      if (rule.required && !value) {
        errors[key] = rule.message || `${key} is required`;
      } else if (rule.pattern && value && !rule.pattern.test(value)) {
        errors[key] = rule.message;
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0; // ✅ returns true if no errors
  };

  const handleSubmit = async () => {
    const isUpdate = Boolean(defaultValues);
    const isValid = validateForm(formData, isUpdate);
  
    if (!isValid) return;
  
    try {
      if (isUpdate) {
        await onUpdateSubmit(formData); // ✅ Wait for completion
      } else {
        await onAddSubmit(formData); // ✅ Wait for completion
      }
  
      // ✅ Close modal only after successful submission
      onClose();
      setFormData({});
    } catch (error) {
      console.error("Submit failed:", error);
      // ❌ Do NOT close modal if there is an error
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {columnsConfig.map((col) => {
            const addShouldShow = col.canAdd && !col.isId;
            const editShouldShow = col.canEdit;
            const shouldShow = defaultValues ? editShouldShow : addShouldShow;
            if (!shouldShow) return null;

            const value = formData[col.accessorKey] || "";
            const errorMsg = fieldErrors[col.accessorKey];

            // ✅ For Select Field
            if (col.type === "select") {
              const options = dropdownData[col.accessorKey] || [];
              return (
                <div key={col.accessorKey}>
                  <select
                    name={col.accessorKey}
                    value={value}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select {col.header}</option>
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errorMsg && <p className="text-red-600 text-sm mt-1">{errorMsg}</p>}
                </div>
              );
            }

            // ✅ For Checkbox Group
            if (col.type === "checkbox_group") {
              // Helper function to get READ permission value for a given permission
              const getReadPermission = (permValue) => {
                if (permValue.endsWith("_CREATE") || permValue.endsWith("_UPDATE") || permValue.endsWith("_DELETE")) {
                  return permValue.replace(/_CREATE$|_UPDATE$|_DELETE$/, "_READ");
                }
                return null;
              };

              // Helper function to get the base permission name (e.g., "PRODUCT" from "PRODUCT_CREATE")
              const getBasePermission = (permValue) => {
                return permValue.replace(/_CREATE$|_READ$|_UPDATE$|_DELETE$/, "");
              };

              // Handle checkbox change with auto-select READ logic
              const handleCheckboxChange = (opt, isChecked) => {
                let next = [...value];
                
                if (isChecked) {
                  // Add the selected permission
                  if (!next.includes(opt.value)) {
                    next.push(opt.value);
                  }
                  
                  // Auto-select READ if CREATE, UPDATE, or DELETE is selected
                  const readPerm = getReadPermission(opt.value);
                  if (readPerm && !next.includes(readPerm)) {
                    next.push(readPerm);
                  }
                } else {
                  // Remove the deselected permission
                  next = next.filter((v) => v !== opt.value);
                  
                  // If deselecting CREATE, UPDATE, or DELETE, check if we should remove READ
                  const readPerm = getReadPermission(opt.value);
                  if (readPerm) {
                    // Get the base permission name (e.g., "PRODUCT")
                    const basePerm = getBasePermission(opt.value);
                    
                    // Check if any other CREATE, UPDATE, or DELETE for the same base permission is still selected
                    const hasOtherCUD = col.groupData.some((item) => {
                      const itemBasePerm = getBasePermission(item.value);
                      return (
                        itemBasePerm === basePerm &&
                        item.value !== opt.value &&
                        (item.value.endsWith("_CREATE") || item.value.endsWith("_UPDATE") || item.value.endsWith("_DELETE")) &&
                        next.includes(item.value)
                      );
                    });
                    
                    // Only remove READ if no other CREATE/UPDATE/DELETE for this base permission is selected
                    if (!hasOtherCUD) {
                      next = next.filter((v) => v !== readPerm);
                    }
                  }
                }
                
                setFormData((prev) => ({ ...prev, [col.accessorKey]: next }));
              };

              // If renderAsTable flag is set, render as table
              if (col.renderAsTable) {
                // Group permissions by their group property
                const groupedPermissions = {};
                col.groupData.forEach((opt) => {
                  const group = opt.group || "Other";
                  if (!groupedPermissions[group]) {
                    groupedPermissions[group] = [];
                  }
                  groupedPermissions[group].push(opt);
                });

                return (
                  <div key={col.accessorKey} className="space-y-4">
                    <label className="font-medium block mb-2">{col.header}</label>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full border-collapse">
                        <thead className="bg-muted">
                          <tr>
                            <th className="border p-2 text-left font-semibold">Group</th>
                            <th className="border p-2 text-center font-semibold">Create</th>
                            <th className="border p-2 text-center font-semibold">Read</th>
                            <th className="border p-2 text-center font-semibold">Update</th>
                            <th className="border p-2 text-center font-semibold">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(groupedPermissions).map(([groupName, perms]) => {
                            // Sort permissions: CREATE, READ, UPDATE, DELETE
                            const sortedPerms = perms.sort((a, b) => {
                              const order = { CREATE: 0, READ: 1, UPDATE: 2, DELETE: 3 };
                              const aType = a.value.split("_").pop();
                              const bType = b.value.split("_").pop();
                              return (order[aType] || 99) - (order[bType] || 99);
                            });

                            const createPerm = sortedPerms.find((p) => p.value.endsWith("_CREATE"));
                            const readPerm = sortedPerms.find((p) => p.value.endsWith("_READ"));
                            const updatePerm = sortedPerms.find((p) => p.value.endsWith("_UPDATE"));
                            const deletePerm = sortedPerms.find((p) => p.value.endsWith("_DELETE"));

                            return (
                              <tr key={groupName} className="hover:bg-muted/50">
                                <td className="border p-2 font-medium">{groupName}</td>
                                <td className="border p-2 text-center">
                                  {createPerm ? (
                                    <input
                                      type="checkbox"
                                      checked={value.includes(createPerm.value)}
                                      onChange={(e) => handleCheckboxChange(createPerm, e.target.checked)}
                                      className="cursor-pointer"
                                    />
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </td>
                                <td className="border p-2 text-center">
                                  {readPerm ? (
                                    <input
                                      type="checkbox"
                                      checked={value.includes(readPerm.value)}
                                      onChange={(e) => handleCheckboxChange(readPerm, e.target.checked)}
                                      className="cursor-pointer"
                                      disabled={
                                        value.includes(createPerm?.value) ||
                                        value.includes(updatePerm?.value) ||
                                        value.includes(deletePerm?.value)
                                      }
                                      title={
                                        value.includes(createPerm?.value) ||
                                        value.includes(updatePerm?.value) ||
                                        value.includes(deletePerm?.value)
                                          ? "Read is automatically selected when Create, Update, or Delete is selected"
                                          : ""
                                      }
                                    />
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </td>
                                <td className="border p-2 text-center">
                                  {updatePerm ? (
                                    <input
                                      type="checkbox"
                                      checked={value.includes(updatePerm.value)}
                                      onChange={(e) => handleCheckboxChange(updatePerm, e.target.checked)}
                                      className="cursor-pointer"
                                    />
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </td>
                                <td className="border p-2 text-center">
                                  {deletePerm ? (
                                    <input
                                      type="checkbox"
                                      checked={value.includes(deletePerm.value)}
                                      onChange={(e) => handleCheckboxChange(deletePerm, e.target.checked)}
                                      className="cursor-pointer"
                                    />
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {errorMsg && <p className="text-red-600 text-sm mt-1">{errorMsg}</p>}
                  </div>
                );
              }

              // Default rendering (flex wrap) for non-table checkbox groups
              return (
                <div key={col.accessorKey}>
                  <label className="font-medium block mb-1">{col.header}</label>
                  <div className="flex flex-wrap gap-2">
                    {col.groupData.map((opt) => (
                      <label key={opt.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={opt.value}
                          checked={value.includes(opt.value)}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...value, opt.value]
                              : value.filter((v) => v !== opt.value);
                            setFormData((prev) => ({ ...prev, [col.accessorKey]: next }));
                          }}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  {errorMsg && <p className="text-red-600 text-sm mt-1">{errorMsg}</p>}
                </div>
              );
            }

            // ✅ For Normal Input
            return (
              <div key={col.accessorKey}>
                <Input
                  name={col.accessorKey}
                  type={col.type || "text"}
                  placeholder={col.header}
                  value={value}
                  onChange={handleChange}
                  className="w-full"
                />
                {errorMsg && <p className="text-red-600 text-sm mt-1">{errorMsg}</p>}
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
          {submitting
              ? defaultValues
                ? "Updating..."
                : "Submitting..."
              : defaultValues
              ? "Update"
              : "Create"}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
