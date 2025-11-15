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
      <DialogContent>
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
