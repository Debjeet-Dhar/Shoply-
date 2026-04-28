import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getShop, saveShop, clearShop, fileToDataUrl, } from "@/lib/storage";
import { Loader2, Upload, LogOut, Trash2, Phone, ImageIcon, Store, ShieldCheck, } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard-layout";
export default function DashboardSettings() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [shop, setShop] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [phone, setPhone] = useState("");
    const [logoDataUrl, setLogoDataUrl] = useState();
    const [coverDataUrl, setCoverDataUrl] = useState();
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [showLogout, setShowLogout] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const logoRef = useRef(null);
    const coverRef = useRef(null);
    useEffect(() => {
        const current = getShop();
        if (!current) {
            setLocation("/login");
            return;
        }
        setShop(current);
        setName(current.name);
        setDescription(current.description ?? "");
        setPhone(current.phone);
        setLogoDataUrl(current.logoDataUrl);
        setCoverDataUrl(current.coverDataUrl);
    }, [setLocation]);
    const handleImage = async (file, setter) => {
        if (!file.type.startsWith("image/")) {
            toast({
                title: "Invalid file",
                description: "Please choose an image.",
                variant: "destructive",
            });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Image too large",
                description: "Keep it under 5MB.",
                variant: "destructive",
            });
            return;
        }
        try {
            const url = await fileToDataUrl(file);
            setter(url);
        }
        catch {
            toast({ title: "Could not read image", variant: "destructive" });
        }
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (!shop)
            return;
        const nextErrors = {};
        if (!name.trim())
            nextErrors.name = "Shop name is required";
        if (!phone.trim() || phone.replace(/[^\d]/g, "").length < 8)
            nextErrors.phone = "Enter a valid WhatsApp number";
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0)
            return;
        setSaving(true);
        await new Promise((r) => setTimeout(r, 500));
        const updated = {
            ...shop,
            name: name.trim(),
            description: description.trim(),
            phone: phone.trim(),
            logoDataUrl,
            coverDataUrl,
        };
        saveShop(updated);
        setShop(updated);
        setSaving(false);
        toast({ title: "Settings saved" });
    };
    const handleLogout = () => {
        clearShop();
        toast({ title: "Logged out" });
        setLocation("/");
    };
    if (!shop)
        return null;
    return (<DashboardLayout shop={shop} title="Settings">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Cover image */}
              <div className="space-y-2">
                <Label>Shop cover</Label>
                <button type="button" onClick={() => coverRef.current?.click()} className="w-full aspect-[16/7] rounded-2xl border-2 border-dashed border-border bg-muted/40 overflow-hidden flex items-center justify-center hover:bg-muted transition-colors relative">
                  {coverDataUrl ? (<img src={coverDataUrl} alt="Shop cover" className="w-full h-full object-cover"/>) : (<div className="flex flex-col items-center text-muted-foreground p-4 text-center">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-60"/>
                      <span className="text-sm font-medium">
                        Upload a cover image
                      </span>
                      <span className="text-xs">
                        Shown at the top of your public shop
                      </span>
                    </div>)}
                  <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f)
                handleImage(f, setCoverDataUrl);
            e.currentTarget.value = "";
        }}/>
                </button>
              </div>

              {/* Logo + name */}
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => logoRef.current?.click()} className="w-20 h-20 rounded-full border-2 border-dashed border-primary/30 bg-primary/5 overflow-hidden flex items-center justify-center shrink-0 hover:bg-primary/10 transition-colors" aria-label="Change logo">
                  {logoDataUrl ? (<img src={logoDataUrl} alt="Shop logo" className="w-full h-full object-cover"/>) : (<Upload className="w-6 h-6 text-primary/70"/>)}
                </button>
                <div className="text-sm">
                  <p className="font-medium">Shop logo</p>
                  <p className="text-xs text-muted-foreground">
                    Tap to upload a new one.
                  </p>
                  <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f)
                handleImage(f, setLogoDataUrl);
            e.currentTarget.value = "";
        }}/>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-name">Shop name</Label>
                <div className="relative">
                  <Store className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                  <Input id="settings-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Awesome Bakery" className={`pl-10 ${errors.name ? "border-destructive" : ""}`}/>
                </div>
                {errors.name && (<p className="text-xs text-destructive">{errors.name}</p>)}
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-desc">Description</Label>
                <Textarea id="settings-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Fresh artisanal baked goods daily."/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-phone">WhatsApp number</Label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                  <Input id="settings-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}/>
                </div>
                {errors.phone ? (<p className="text-xs text-destructive">{errors.phone}</p>) : (<p className="text-xs text-muted-foreground">
                    This is also used to log in to your account.
                  </p>)}
              </div>

              <Button type="submit" disabled={saving} className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
                {saving ? (<span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin"/> Saving...
                  </span>) : ("Save changes")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <ShieldCheck className="w-4 h-4"/>
            <span className="font-medium">Account secured</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your shop is verified via WhatsApp. Sign in any time using your
            registered number.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => setShowLogout(true)} className="h-12 justify-center">
          <LogOut className="w-4 h-4 mr-2"/>
          Log out
        </Button>
        <Button variant="outline" onClick={() => setShowDelete(true)} className="h-12 justify-center text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive">
          <Trash2 className="w-4 h-4 mr-2"/>
          Delete shop
        </Button>
      </div>

      <AlertDialog open={showLogout} onOpenChange={setShowLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll need to verify your WhatsApp number to sign back in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this shop?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove your shop and all products from this
              device. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>);
}
