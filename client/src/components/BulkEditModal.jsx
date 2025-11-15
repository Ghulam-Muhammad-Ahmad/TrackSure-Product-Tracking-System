import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Select from "react-select"; // ✅ Import Select from react-select

export function BulkEditModal({ open, onClose, columnsConfig, dropdownData, onSubmit, submitting }) {
  const bulkFields = columnsConfig.filter((c) => c.bulkEdit);

  const [formData, setFormData] = useState({});

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Edit</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {bulkFields.map((field) => (
            <div key={field.accessorKey}>
              <label className="block mb-1 font-medium">Change {field.header}</label>

              {field.type === "select" ? (
                <Select
                  options={dropdownData[field.accessorKey]?.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                  }))}
                  onChange={(option) => handleChange(field.accessorKey, option?.value)}
                />
              ) : (
                <Input
                  type={field.type || "text"}
                  onChange={(e) => handleChange(field.accessorKey, e.target.value)}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end space-x-2 pt-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
