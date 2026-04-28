import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getShop, getProducts, } from "@/lib/storage";
import { Plus, Copy, Check, Eye, Package, ChevronRight, TrendingUp, } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard-layout";
function formatCurrency(value) {
    return `₹${value.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}
export default function DashboardHome() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        const currentShop = getShop();
        if (!currentShop) {
            setLocation("/login");
            return;
        }
        setShop(currentShop);
        setProducts(getProducts());
    }, [setLocation]);
    const shareUrl = shop ? `${window.location.origin}/shop/${shop.slug}` : "";
    const displayUrl = shop ? `dukanlink.co/${shop.slug}` : "";
    const handleCopyLink = () => {
        if (!shareUrl)
            return;
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true);
            toast({
                title: "Link copied",
                description: "Share it with your customers.",
            });
            setTimeout(() => setCopied(false), 1800);
        });
    };
    const totalSales = products.reduce((sum, p) => sum + (p.price || 0) * (((p.id.charCodeAt(0) ?? 50) % 9) + 2), 0);
    const totalOrders = products.reduce((sum, p) => sum + (((p.id.charCodeAt(0) ?? 50) % 9) + 2), 0) || 0;
    const totalProducts = products.length;
    if (!shop)
        return null;
    const recent = products.slice(-4).reverse();
    return (<DashboardLayout shop={shop}>
      {/* Shop link card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Eye className="w-4 h-4 text-primary"/>
                Your Shop Link
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2.5 py-1 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>
                LIVE
              </span>
            </div>
            <div className="flex items-stretch gap-2">
              <a href={`/shop/${shop.slug}`} target="_blank" rel="noreferrer" className="flex-1 min-w-0 flex items-center rounded-lg border bg-muted/40 px-4 text-sm font-medium text-foreground/90 truncate hover:bg-muted transition-colors">
                {displayUrl}
              </a>
              <Button type="button" size="icon" onClick={handleCopyLink} className="bg-emerald-500 hover:bg-emerald-600 text-white h-11 w-11 shrink-0" aria-label="Copy link">
                {copied ? (<Check className="w-5 h-5"/>) : (<Copy className="w-5 h-5"/>)}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <StatCard delay={0.05} label="Total Sales" value={formatCurrency(totalSales)}/>
        <StatCard delay={0.1} label="Orders" value={totalOrders.toString()} extra={<span className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5"/> +12 this week
            </span>}/>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <StatCard delay={0.15} label="Total Products" value={totalProducts.toString()} extra={<Link href="/dashboard/products" className="text-xs font-semibold text-primary inline-flex items-center hover:underline">
              Manage <ChevronRight className="w-3.5 h-3.5"/>
            </Link>}/>
        <StatCard delay={0.2} label="Conversion" value="12%" extra={<span className="text-xs text-muted-foreground">vs last week</span>}/>
      </div>

      {/* Recent products preview */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-xl font-bold tracking-tight">Recent Products</h2>
        <Button onClick={() => setLocation("/products/new")} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-5 shadow-sm">
          <Plus className="w-4 h-4 mr-1.5"/>
          Add
        </Button>
      </div>

      {recent.length === 0 ? (<motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="border-2 border-dashed border-border/70 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-card/50">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <Package className="w-7 h-7 text-primary"/>
          </div>
          <h3 className="text-lg font-bold mb-1">Your shop is ready</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-5">
            Add your first product to start taking orders on WhatsApp.
          </p>
          <Button onClick={() => setLocation("/products/new")} size="lg">
            <Plus className="w-5 h-5 mr-2"/>
            Add your first product
          </Button>
        </motion.div>) : (<div className="space-y-3">
          {recent.map((product, index) => (<motion.div key={product.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.04 }}>
              <Card className="border-border/60 shadow-sm">
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
                  </div>
                </CardContent>
              </Card>
            </motion.div>))}
          {products.length > recent.length && (<Link href="/dashboard/products" className="block text-center text-sm font-semibold text-primary hover:underline pt-1">
              View all products
            </Link>)}
        </div>)}
    </DashboardLayout>);
}
function StatCard({ label, value, extra, delay = 0, }) {
    return (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
      <Card className="border-border/60 shadow-sm h-full">
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight">
            {value}
          </p>
          {extra && <div className="mt-1">{extra}</div>}
        </CardContent>
      </Card>
    </motion.div>);
}
