import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { Settings2, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";


/* ---------------------------------------------------------------------------------------
 * Small UI bits
 * -------------------------------------------------------------------------------------*/
function Section({ title, children }) {
    return (
      <div className="space-y-3">
        <Label className="mb-1 block font-medium">{title}</Label>
        {children}
      </div>
    );
  }
  
  function AdvancedSettings({ settings, onToggle }) {
    const items = [
      ["productName", "Include Product Name"],
      ["currentOwner", "Include Current Owner"],
      ["manufacturer", "Include Manufacturer"],
      ["productImage", "Include Product Image"],
      ["productStatus", "Include Product Status"],
    ];
    return (
      <div className="grid gap-3 pt-3 border rounded-xl p-4 bg-gray-50">
        {items.map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <Checkbox
              id={key}
              checked={settings[key]}
              onCheckedChange={() => onToggle(key)}
            />
            <Label htmlFor={key}>{label}</Label>
          </div>
        ))}
      </div>
    );
  }
  
  
export function QrForm({
    products,
    batchName,
    setBatchName,
    selected,
    setSelected,
    settings,
    setSettings,
    onGenerate,
    loading,
  }) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [touched, setTouched] = useState(false);
  
    const isValid = batchName.trim().length > 0 && selected.length > 0;
    const showNameError = touched && batchName.trim().length === 0;
  
    return (
      <Card className="shadow-lg rounded-2xl border border-gray-200">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-2xl font-semibold">
            Tenant QR Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <Section title="QR Code Name (Batch)">
            <Input
              type="text"
              placeholder="e.g., TenantXYZ_Q1_2025"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              onBlur={() => setTouched(true)}
              className="text-black"
              aria-invalid={showNameError}
            />
            {showNameError && (
              <p className="text-sm text-red-600 mt-0">
                A qr code name is required.
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Used for all codes in this run. Filenames will be{" "}
              <code>{`{QrName} - {Product}.png`}</code>.
            </p>
          </Section>
  
          <Section title="Select Products">
            <Select
              options={products}
              isMulti
              value={selected}
              onChange={(val) => setSelected(val || [])}
              className="text-black"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "0.75rem",
                  padding: "2px",
                }),
                multiValue: (base) => ({ ...base, borderRadius: "0.5rem" }),
              }}
            />
          </Section>
  
          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowAdvanced((s) => !s)}
            >
              <Settings2 className="w-4 h-4 mr-2" />
              {showAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
            </Button>
            {showAdvanced && (
              <AdvancedSettings
                settings={settings}
                onToggle={(k) => setSettings({ ...settings, [k]: !settings[k] })}
              />
            )}
          </div>
  
          <Button
            onClick={() => {
              setTouched(true);
              if (isValid) onGenerate();
            }}
            disabled={!isValid || loading}
            className="w-full bg-primary hover:bg-secondary hover:text-primary flex items-center justify-center"
          >
            {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
            {loading ? "Generating..." : "Generate QR Codes"}
          </Button>
        </CardContent>
      </Card>
    );
  }