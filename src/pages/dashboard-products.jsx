import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { getShop, getProducts, updateProduct, deleteProduct, fileToDataUrl, } from "@/lib/storage";
import { Plus, Pencil, Trash2, Package, MoreVertical, Upload, Loader2, Search, } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard-layout";
function formatCurrency(value) {
    return `₹${value.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}
export default function DashboardProducts() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [query, setQuery] = useState("");
    useEffect(() => {
        const currentShop = getShop();
        if (!currentShop) {
            setLocation("/login");
            return;
        }
        setShop(currentShop);
        setProducts(getProducts());
    }, [setLocation]);
    const refresh = () => setProducts(getProducts());
    if (!shop)
        return null;
    const filtered = query.trim()
        ? products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
        : products;
    return (<DashboardLayout shop={shop} title="Products">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold tracking-tight">All Products</h2>
        <Button onClick={() => setLocation("/products/new")} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-5 shadow-sm">
          <Plus className="w-4 h-4 mr-1.5"/>
          Add
        </Button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="pl-10"/>
      </div>

      {products.length === 0 ? (<motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="border-2 border-dashed border-border/70 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-card/50">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <Package className="w-7 h-7 text-primary"/>
          </div>
          <h3 className="text-lg font-bold mb-1">No products yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-5">
            Add your first product to start taking orders.
          </p>
          <Button onClick={() => setLocation("/products/new")} size="lg">
            <Plus className="w-5 h-5 mr-2"/>
            Add product
          </Button>
        </motion.div>) : filtered.length === 0 ? (<p className="text-sm text-muted-foreground text-center py-6">
          No products match "{query}".
        </p>) : (<div className="space-y-3">
          <AnimatePresence initial={false}>
            {filtered.map((product, index) => (<motion.div key={product.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25, delay: index * 0.03 }}>
                <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0 border">
                        {product.imageDataUrl ? (<img src={product.imageDataUrl} alt={product.name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-muted-foreground/40"/>
                          </div>)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold leading-tight truncate">
                          {product.name}
                        </h3>
                        <p className="text-emerald-600 font-bold mt-0.5">
                          {formatCurrency(product.price)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {((product.id.charCodeAt(0) ?? 50) % 90) + 10} sold
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button type="button" size="sm" variant="outline" onClick={() => setEditing(product)} className="h-9 px-3 hidden sm:inline-flex">
                          <Pencil className="w-3.5 h-3.5 mr-1.5"/>
                          Edit
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setDeleting(product)} className="h-9 px-3 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive hidden sm:inline-flex">
                          <Trash2 className="w-3.5 h-3.5 mr-1.5"/>
                          Delete
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-9 w-9 sm:hidden text-muted-foreground" aria-label="Open product menu">
                              <MoreVertical className="w-5 h-5"/>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => setEditing(product)}>
                              <Pencil className="w-4 h-4 mr-2"/> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeleting(product)} className="text-destructive focus:text-destructive">
                              <Trash2 className="w-4 h-4 mr-2"/> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>))}
          </AnimatePresence>
        </div>)}

      <EditProductDialog product={editing} onClose={() => setEditing(null)} onSaved={() => {
            refresh();
            setEditing(null);
            toast({ title: "Product updated" });
        }}/>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting?.name
            ? `"${deleting.name}" will be removed from your shop. This cannot be undone.`
            : "This product will be removed from your shop."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
            if (!deleting)
                return;
            deleteProduct(deleting.id);
            refresh();
            setDeleting(null);
            toast({ title: "Product deleted" });
        }} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>);
}
function EditProductDialog({ product, onClose, onSaved, }) {
    const { toast } = useToast();
    const fileInputRef = useRef(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageDataUrl, setImageDataUrl] = useState();
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(String(product.price));
            setDescription(product.description ?? "");
            setImageDataUrl(product.imageDataUrl);
            setErrors({});
        }
    }, [product]);
    const handleImage = async (file) => {
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
            setImageDataUrl(url);
        }
        catch {
            toast({ title: "Could not read image", variant: "destructive" });
        }
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (!product)
            return;
        const nextErrors = {};
        if (!name.trim())
            nextErrors.name = "Product name is required";
        const numericPrice = Number(price);
        if (!price || Number.isNaN(numericPrice) || numericPrice <= 0)
            nextErrors.price = "Enter a valid price";
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0)
            return;
        setSaving(true);
        await new Promise((r) => setTimeout(r, 400));
        updateProduct(product.id, {
            name: name.trim(),
            price: numericPrice,
            description: description.trim(),
            imageDataUrl,
        });
        setSaving(false);
        onSaved();
    };
    return (<Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>
            Update the details and save your changes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-xl border bg-muted/40 overflow-hidden flex items-center justify-center shrink-0 hover:bg-muted transition-colors" aria-label="Change product image">
              {imageDataUrl ? (<img src={imageDataUrl} alt="Product" className="w-full h-full object-cover"/>) : (<Upload className="w-5 h-5 text-muted-foreground"/>)}
            </button>
            <div className="text-sm">
              <p className="font-medium">Product photo</p>
              <p className="text-xs text-muted-foreground">
                Tap the thumbnail to replace.
              </p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file)
                handleImage(file);
            e.currentTarget.value = "";
        }}/>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-name">Product name</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sourdough Loaf" aria-invalid={!!errors.name}/>
            {errors.name && (<p className="text-xs text-destructive">{errors.name}</p>)}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-price">Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                ₹
              </span>
              <Input id="edit-price" type="number" inputMode="decimal" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="pl-7" aria-invalid={!!errors.price}/>
            </div>
            {errors.price && (<p className="text-xs text-destructive">{errors.price}</p>)}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">
              Description{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell customers what makes this special..." rows={3}/>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              {saving ? (<span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin"/> Saving...
                </span>) : ("Save changes")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);
}
