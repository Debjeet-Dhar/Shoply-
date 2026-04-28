import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateSlug, saveShop, fileToDataUrl } from "@/lib/storage";
import { Store, Upload, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
export default function CreateShop() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        phone: "+91",
    });
    const [errors, setErrors] = useState({
        name: "",
        description: "",
        phone: "",
    });
    const handleLogoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };
    const validate = () => {
        let valid = true;
        const newErrors = { name: "", description: "", phone: "" };
        if (!formData.name.trim()) {
            newErrors.name = "Shop name is required";
            valid = false;
        }
        if (!formData.description.trim()) {
            newErrors.description = "Shop description is required";
            valid = false;
        }
        if (!formData.phone.trim() || formData.phone.length < 5) {
            newErrors.phone = "Valid phone number is required";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        setIsSubmitting(true);
        try {
            let logoDataUrl = undefined;
            if (logoFile) {
                logoDataUrl = await fileToDataUrl(logoFile);
            }
            const slug = generateSlug(formData.name);
            saveShop({
                slug,
                name: formData.name,
                description: formData.description,
                phone: formData.phone,
                logoDataUrl,
                createdAt: new Date().toISOString(),
            });
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLocation("/verify");
        }
        catch (error) {
            toast({
                title: "Something went wrong",
                description: "Could not create your shop. Please try again.",
                variant: "destructive",
            });
            setIsSubmitting(false);
        }
    };
    return (<div className="min-h-screen w-full flex flex-col bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/10 to-transparent -z-10"/>
      
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold text-xl hover:opacity-90 transition-opacity">
          <Store className="w-6 h-6"/>
          DukanLink
        </Link>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Set up your shop</CardTitle>
              <CardDescription>Tell us a bit about your business. You can change this later.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center bg-primary/5 overflow-hidden cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => document.getElementById("logo-upload")?.click()}>
                      {logoPreview ? (<img src={logoPreview} alt="Shop logo preview" className="w-full h-full object-cover"/>) : (<Upload className="w-8 h-8 text-primary/60"/>)}
                    </div>
                    <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange}/>
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    Upload shop logo<br />(optional)
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Shop Name</Label>
                  <Input id="name" placeholder="e.g. My Awesome Bakery" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={errors.name ? "border-destructive" : ""}/>
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea id="description" placeholder="What are you selling?" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={errors.description ? "border-destructive" : ""}/>
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp Number</Label>
                  <Input id="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={errors.phone ? "border-destructive" : ""}/>
                  <p className="text-xs text-muted-foreground">Orders will be sent to this number.</p>
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>
                
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isSubmitting}>
                  {isSubmitting ? (<span className="flex items-center gap-2">Creating...</span>) : (<span className="flex items-center gap-2">Continue to Verify <ChevronRight className="w-4 h-4"/></span>)}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </main>
    </div>);
}
