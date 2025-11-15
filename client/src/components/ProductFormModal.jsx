import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateImageFile } from "@/utils/fileValidation";

export function ProductFormModal({
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
  const [loadingFile, setLoadingFile] = useState(false);
  const [uploadError, setUploadError] = useState(""); // ✅ New state

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
    setLoadingFile(false);
    setUploadError("");
  }, [open, defaultValues, columnsConfig]);

  const validateField = (name, value, isUpdate) => {
    const rules = isUpdate ? validationRulesUpdate : validationRulesAdd;
    const rule = rules?.[name];

    if (!rule) return "";

    if (rule.required && !value) {
      return rule.message || `${name} is required`;
    }
    if (rule.pattern && value && !rule.pattern.test(value)) {
      return rule.message;
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isUpdate = Boolean(defaultValues);

    setFormData((prev) => ({ ...prev, [name]: value }));
    const errorMsg = validateField(name, value, isUpdate);
    setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleFileChange = async (e, accessorKey) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image file (3MB max, images only)
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error);
      return;
    }

    setLoadingFile(true);
    setUploadError(""); // reset error state

    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(import.meta.env.VITE_CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formDataCloud,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, [accessorKey]: data.secure_url }));

        const errorMsg = validateField(accessorKey, data.secure_url, Boolean(defaultValues));
        setFieldErrors((prev) => ({ ...prev, [accessorKey]: errorMsg }));
      } else {
        throw new Error("Invalid Cloudinary response");
      }
    } catch (error) {
      console.error("Cloudinary upload failed", error);
      setUploadError("Image upload failed. Please try again.");
    } finally {
      setLoadingFile(false);
    }
  };

  const handleSelectChange = (selectedOption, accessorKey) => {
    const value = selectedOption ? selectedOption.value : "";
    setFormData((prev) => ({ ...prev, [accessorKey]: value }));

    const errorMsg = validateField(accessorKey, value, Boolean(defaultValues));
    setFieldErrors((prev) => ({ ...prev, [accessorKey]: errorMsg }));
  };

  const validateForm = (isUpdate) => {
    const rules = isUpdate ? validationRulesUpdate : validationRulesAdd;
    const errors = {};

    for (let key in rules) {
      errors[key] = validateField(key, formData[key], isUpdate);
    }

    const hasErrors = Object.values(errors).some((msg) => msg);
    setFieldErrors(errors);

    return !hasErrors;
  };
  
  const handleSubmit = async () => {
    if (loadingFile) return; // prevent submission while uploading
    if (uploadError) return; // prevent submission if upload failed
  
    const isUpdate = Boolean(defaultValues);
    if (!validateForm(isUpdate)) return;
  
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
      // ❌ Don't close modal if error occurs
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

            // ✅ Dropdown
            if (col.type === "select") {
              const options = (dropdownData[col.accessorKey] || []).map((opt) => ({
                value: opt.value,
                label: opt.label,
              }));

              const selected = options.find((opt) => opt.value === value) || null;

              return (
                <div key={col.accessorKey}>
                  <label className="font-medium text-sm block">{col.header}</label>
                  <Select
                    value={selected}
                    onChange={(option) => handleSelectChange(option, col.accessorKey)}
                    options={options}
                    placeholder={`Select ${col.header}`}
                    isClearable
                    isSearchable
                  />
                  {errorMsg && <p className="text-red-600 text-sm mt-1">{errorMsg}</p>}
                </div>
              );
            }

            // ✅ Checkbox group
            if (col.type === "checkbox_group") {
              return (
                <div key={col.accessorKey}>
                  <label className="font-medium text-sm block">{col.header}</label>
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

            // ✅ File input
            if (col.type === "file") {
              return (
                <div key={col.accessorKey}>
                  <label className="font-medium text-sm block">{col.header}</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, col.accessorKey)}
                  />
                  {formData[col.accessorKey] && (
                    <img
                      src={formData[col.accessorKey]}
                      alt="Preview"
                      className="h-20 mt-2 rounded border object-cover"
                    />
                  )}
                  {loadingFile && (
                    <p className="text-blue-500 text-sm mt-1">Uploading image...</p>
                  )}
                  {uploadError && (
                    <p className="text-red-600 text-sm mt-1">{uploadError}</p>
                  )}
                  {errorMsg && <p className="text-red-600 text-sm mt-1">{errorMsg}</p>}
                </div>
              );
            }

            // ✅ Default input field
            return (
              <div key={col.accessorKey}>
                <label className="font-medium text-sm block">{col.header}</label>
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
          <Button
            onClick={handleSubmit}
            disabled={loadingFile || uploadError !== "" || submitting}
          >
            {loadingFile ? "Uploading..." : submitting ? "Submitting..." : defaultValues ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
