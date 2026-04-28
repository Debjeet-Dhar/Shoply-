import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addProduct, fileToDataUrl, getShop } from "@/lib/storage";
import { ArrowLeft, Upload, Loader2, X, ImageIcon, } from "lucide-react";
import { motion } from "framer-motion";
export default function AddProduct() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const fileRef = useRef(null);
    const [submitting, setSubmitting] = useState(false);
    const [imageDataUrl, setImageDataUrl] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (!getShop())
            setLocation("/");
    }, [setLocation]);
    const handleFile = async (file) => {
        if (!file.type.startsWith("image/")) {
            toast({
                title: "Invalid file",
                description: "Please choose an image (PNG, JPG).",
                variant: "destructive",
            });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Image too large",
                description: "Please pick an image under 5MB.",
                variant: "destructive",
            });
            return;
        }
        try {
            const url = await fileToDataUrl(file);
            setImageDataUrl(url);
        }
        catch {
            toast({
                title: "Could not read image",
                description: "Please try a different file.",
                variant: "destructive",
            });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const next = {};
        if (!name.trim())
            next.name = "Product name is required";
        const numericPrice = Number(price);
        if (!price || Number.isNaN(numericPrice) || numericPrice <= 0)
            next.price = "Enter a valid price";
        setErrors(next);
        if (Object.keys(next).length > 0)
            return;
        setSubmitting(true);
        try {
            addProduct({
                id: Date.now().toString(36) +
                    Math.random().toString(36).substring(2, 6),
                name: name.trim(),
                price: numericPrice,
                description: description.trim(),
                imageDataUrl: imageDataUrl ?? undefined,
                createdAt: new Date().toISOString(),
            });
            await new Promise((r) => setTimeout(r, 600));
            toast({
                title: "Product added",
                description: `${name.trim()} is now live in your shop.`,
            });
            setLocation("/dashboard/products");
        }
        catch {
            toast({
                title: "Could not add product",
                description: "Please try again.",
                variant: "destructive",
            });
            setSubmitting(false);
        }
    };
    return (<div className="min-h-screen w-full bg-muted/30 flex flex-col">
      <header className="bg-card border-b sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard/products")} className="mr-2 -ml-2 text-muted-foreground hover:text-foreground" aria-label="Back">
            <ArrowLeft className="w-5 h-5"/>
          </Button>
          <h1 className="font-bold text-xl">Add Product</h1>
        </div>
      </header>

      <main className="flex-1 flex justify-center p-4 sm:p-6 pb-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-full max-w-xl">
          <Card className="border-border/60 shadow-sm">
            <form onSubmit={handleSubmit}>
              <CardContent className="p-5 sm:p-6 space-y-6">
                {/* Image upload */}
                <div className="space-y-2">
                  <Label>Product Photo</Label>
                  <div role="button" tabIndex={0} onClick={() => fileRef.current?.click()} onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileRef.current?.click();
            }
        }} onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
        }} onDragLeave={() => setDragOver(false)} onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file)
                handleFile(file);
        }} className={`relative w-full aspect-square sm:aspect-2/1 rounded-2xl border-2 border-dashed bg-muted/40 overflow-hidden cursor-pointer transition-colors flex items-center justify-center ${dragOver
            ? "border-emerald-500 bg-emerald-50/60"
            : "border-border hover:bg-muted"}`}>
                    {imageDataUrl ? (<>
                        <img src={imageDataUrl} alt="Product preview" className="w-full h-full object-cover"/>
                        <button type="button" onClick={(e) => {
                e.stopPropagation();
                setImageDataUrl(null);
                if (fileRef.current)
                    fileRef.current.value = "";
            }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/95 border shadow-sm flex items-center justify-center hover:bg-card" aria-label="Remove image">
                          <X className="w-4 h-4"/>
                        </button>
                      </>) : (<div className="flex flex-col items-center text-center px-6">
                        <div className="w-14 h-14 rounded-full bg-card shadow-sm border flex items-center justify-center mb-3">
                          <Upload className="w-6 h-6 text-emerald-500"/>
                        </div>
                        <p className="font-semibold text-foreground">
                          Tap to upload
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          High quality photos sell better!
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          PNG or JPG, up to 5MB
                        </p>
                      </div>)}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file)
                handleFile(file);
            e.currentTarget.value = "";
        }}/>
                  </div>
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5"/>
                    Optional, but recommended.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" placeholder="e.g. Sourdough Loaf" value={name} onChange={(e) => {
            setName(e.target.value);
            if (errors.name)
                setErrors({ ...errors, name: undefined });
        }} className={errors.name ? "border-destructive" : ""}/>
                  {errors.name && (<p className="text-xs text-destructive">{errors.name}</p>)}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      ₹
                    </span>
                    <Input id="price" type="number" inputMode="decimal" step="0.01" min="0" placeholder="0.00" value={price} onChange={(e) => {
            setPrice(e.target.value);
            if (errors.price)
                setErrors({ ...errors, price: undefined });
        }} className={`pl-8 ${errors.price ? "border-destructive" : ""}`}/>
                  </div>
                  {errors.price && (<p className="text-xs text-destructive">{errors.price}</p>)}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description{" "}
                    <span className="text-muted-foreground font-normal">
                      (Optional)
                    </span>
                  </Label>
                  <Textarea id="description" rows={4} placeholder="Tell customers what makes this special..." value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>
              </CardContent>
              <CardFooter className="px-5 sm:px-6 py-4 bg-muted/30 border-t flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setLocation("/dashboard/products")} disabled={submitting} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white">
                  {submitting ? (<span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin"/> Saving...
                    </span>) : ("Add Product")}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </main>
    </div>);
}
