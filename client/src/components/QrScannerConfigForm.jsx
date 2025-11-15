 import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Copy, Loader2, RefreshCw, Save, Mail, Phone, MapPin, Factory, User2, Tag, Trash2, Upload } from "lucide-react";

function ImageField({ id, label, value, onChange, placeholder, accessorKey, handleFileChange, loadingFile, uploadError }){
    return (
      <div className="grid gap-2">
        <Label htmlFor={id}>{label}</Label>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input id={id} placeholder={placeholder} value={value} onChange={(e)=>onChange(e.target.value)} className="flex-1"/>
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e)=>handleFileChange(e, accessorKey)}
                  disabled={loadingFile}
                />
                <Button type="button" variant="secondary" asChild disabled={loadingFile}>
                  <span><Upload className="mr-2 h-4 w-4"/>{loadingFile?"Uploading…":"Upload"}</span>
                </Button>
              </label>
              {value ? (
                <Button type="button" variant="outline" onClick={()=>onChange("")} aria-label="Clear image">
                  <Trash2 className="h-4 w-4"/>
                </Button>
              ) : null}
            </div>
          </div>
          {uploadError ? <p className="text-sm text-destructive">{uploadError}</p> : null}
        </div>
        {value ? (
          <div className="rounded-xl border p-2">
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img src={value} alt={`${label} preview`} className="h-24 w-auto"/>
          </div>
        ) : null}
      </div>
    );
  }
  
export function QrScannerConfigForm({
    state,
    setState,
    errors,
    onSave,
    onReset,
    saving,
    notice,
    previewUrl,
    validate,
    handleFileChange,
    loadingFile,
    uploadError,
  }){
    const { brandName, themeColor, description } = state;
  
    return (
      <div className="space-y-5">
  
        <div className="grid gap-2">
          <Label htmlFor="brandName">Brand Name<span className="text-destructive"> *</span></Label>
          <Input id="brandName" placeholder="Your brand" value={brandName} onChange={(e)=>setState(s=>({...s, brandName: e.target.value}))}/>
          {errors.brandName&&<p className="text-sm text-destructive">{errors.brandName}</p>}
        </div>
  
        <ImageField id="logoUrl" label="Logo" value={state.logoUrl} onChange={(v)=>setState(s=>({...s, logoUrl: v}))} placeholder="Paste image URL or click Upload" accessorKey="logoUrl" handleFileChange={handleFileChange} loadingFile={loadingFile} uploadError={uploadError}/>
    
        <div className="grid gap-2">
          <Label htmlFor="themeColor">Theme Color (HEX)</Label>
          <div className="flex items-center gap-2">
            <Input id="themeColor" placeholder="#0055aa" className="font-mono" value={themeColor} onChange={(e)=>setState(s=>({...s, themeColor: e.target.value}))}/>
            <input type="color" aria-label="Pick color" className="h-10 w-10 rounded-md border" value={themeColor||"#0a6cff"} onChange={(e)=>setState(s=>({...s, themeColor: e.target.value}))}/>
          </div>
          {errors.themeColor&&<p className="text-sm text-destructive">{errors.themeColor}</p>}
        </div>
  
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Optional text shown on scan page" rows={4} value={description} onChange={(e)=>setState(s=>({...s, description: e.target.value}))}/>
        </div>
  
        <Separator/>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={()=>{ if (validate()) onSave(); }} disabled={saving}>
            {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Saving…</>) : (<><Save className="mr-2 h-4 w-4"/>Save settings</>)}
          </Button>
        </div>
        {notice && <div className={`text-sm ${notice==="Error"?"text-destructive":"text-muted-foreground"}`}>{notice}</div>}
      </div>
    );
  }