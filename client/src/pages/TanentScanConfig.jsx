 import React, { useEffect, useMemo, useState, useContext  } from "react";
import { Loader2, Mail, Phone, MapPin, Factory, User2, Tag} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrScannerConfigForm } from "@/components/QrScannerConfigForm";
import { QrScanConfigPreview } from "@/components/QrScanConfigPreview";
import { API } from "@/config/api";
import { AuthContext } from "@/providers/authProvider";

// -------------------- utils --------------------
function isHex(v){return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v)}
function isUrlOrEmpty(v){return !v||/^https?:\/\//i.test(v)}


export default function TanentScanConfig({ tenantId: initialTenantId = "" }){
  const { token } = useContext(AuthContext);
  const [state, setState] = useState({
    tenantId: initialTenantId,
    brandName: "",
    logoUrl: "",
    redirectUrl: "",
    themeColor: "#0a6cff",
    description: "",
  });
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [errors,setErrors]=useState({});
  const [notice,setNotice]=useState("");

  // upload-related UI state
  const [loadingFile, setLoadingFile] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // load existing config
  useEffect(()=>{
    (async()=>{
      try{
        setLoading(true);
        const res = await fetch(API.QR_SCAN_CONFIG_GET, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-jwt-bearer": token
          }
        });
        const data = await res.json();
        if(data.success && data.scanConfig){
          setState(s=>({
            ...s,
            tenantId: data.scanConfig.tenant_id,
            brandName: data.scanConfig.brandName,
            logoUrl: data.scanConfig.logoUrl,
            redirectUrl: data.scanConfig.redirectUrl,
            themeColor: data.scanConfig.themeColor,
            description: data.scanConfig.description,
          }));
        }
      }catch(e){
        // noop
      }finally{
        setLoading(false);
      }
    })();
  },[]);

  function validateField(key, value){
    if(key==="brandName"){ return value?"":"Brand name is required"; }
    if(key==="logoUrl" || key==="redirectUrl"){ return value && !isUrlOrEmpty(value)?"Must be a valid URL":""; }
    if(key==="themeColor"){ return value && !isHex(value)?"Use HEX like #0055aa":""; }
    return "";
  }

  function validate(){
    const e = {};
    ["brandName","logoUrl","themeColor"].forEach((k)=>{
      const v = state[k] ?? "";
      const msg = validateField(k, v);
      if(msg) e[k] = msg;
    });
    setErrors(e);
    return Object.keys(e).length===0;
  }

  // ------------ Cloudinary upload via fetch + FormData (Vite envs) ------------
  const handleFileChange = async (e, accessorKey) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingFile(true);
    setUploadError("");

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
        setState(prev => ({ ...prev, [accessorKey]: data.secure_url }));
        const errorMsg = validateField(accessorKey, data.secure_url);
        setErrors(prev => ({ ...prev, [accessorKey]: errorMsg }));
      } else {
        throw new Error("Invalid Cloudinary response");
      }
    } catch (error) {
      console.error("Cloudinary upload failed", error);
      setUploadError("Image upload failed. Please try again.");
    } finally {
      setLoadingFile(false);
      // clear file input value so the same file can be re-selected if needed
      e.target.value = "";
    }
  };

   async function onSave(){
    try{
      setSaving(true); setNotice("");
      const method = "POST";
      const body={
        brandName: state.brandName.trim(),
        logoUrl: state.logoUrl.trim(),
        redirectUrl: state.redirectUrl.trim(),
        themeColor: state.themeColor || "#0a6cff",
        description: state.description,
      };
      const res = await fetch(API.QR_SCAN_CONFIG_SAVE,{method,headers:{"Content-Type":"application/json","x-jwt-bearer":token},body:JSON.stringify(body)});
      const result = await res.json();
      if(result.success){
        setNotice(result.message);
      } else {
        setNotice(result.message);
      }
    }catch(e){
      setNotice("Error");
    }finally{
      setSaving(false);
    }
  }

  function onReset(){
    setState({
      tenantId: tenantIdFromSession || "",
      brandName: "",
      logoUrl: "",
      redirectUrl: "",
      themeColor: "#0a6cff",
      description: "",
    });
    setErrors({});
    setNotice("");
  }


  return (
    <div className="max-h-[90vh] bg-muted/40 p-4 md:p-8">
      <div className="mx-auto grid w-full gap-6 md:grid-cols-2">
        <Card className="order-2 md:order-1">
          <CardHeader>
            <CardTitle>QR Scanner Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading? (
              <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/> Loading…</div>
            ) : (
              <QrScannerConfigForm
                state={state}
                setState={setState}
                errors={errors}
                onSave={onSave}
                onReset={onReset}
                saving={saving}
                notice={notice}
                validate={validate}
                handleFileChange={handleFileChange}
                loadingFile={loadingFile}
                uploadError={uploadError}
              />
            )}
          </CardContent>
        </Card>

        <Card className="order-1 md:order-2 overflow-hidden">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <QrScanConfigPreview
              brandName={state.brandName}
              logoUrl={state.logoUrl}
              redirectUrl={state.redirectUrl}
              description={state.description}
              themeColor={state.themeColor}
            />
          </CardContent>
        </Card>
      </div>

    </div>
  );
}