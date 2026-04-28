import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { getShopBySlug, getProducts, } from "@/lib/storage";
import { getWhatsAppOrderLink } from "@/lib/whatsapp";
import { Store, MessageCircle, Star, ShieldCheck, PackageSearch, Search, Zap, } from "lucide-react";
import { motion } from "framer-motion";
function formatCurrency(value) {
    return `₹${value.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}
function badgeForProduct(p, index, total) {
    // Most-recent product → "New"; oldest non-empty → "Bestseller"; rest → none
    if (index === 0 && total > 1)
        return "Bestseller";
    if (index === total - 1 && total > 1)
        return "New";
    return null;
}
export default function Shop({ params }) {
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    useEffect(() => {
        const foundShop = getShopBySlug(params.slug);
        if (foundShop) {
            setShop(foundShop);
            setProducts(getProducts());
            document.title = `${foundShop.name} | DukanLink`;
        }
        setLoading(false);
    }, [params.slug]);
    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"/>
      </div>);
    }
    if (!shop) {
        return (<div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
        <Store className="w-16 h-16 text-muted-foreground mb-4 opacity-50"/>
        <h1 className="text-2xl font-bold mb-2">Shop not found</h1>
        <p className="text-muted-foreground mb-8">
          The shop you are looking for doesn't exist or has been removed.
        </p>
        <Link href="/">
          <Button>Create your own shop</Button>
        </Link>
      </div>);
    }
    const rating = shop.rating ?? 4.9;
    const filtered = query.trim()
        ? products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
        : products;
    // Default cover gradient if user hasn't uploaded one
    const coverStyle = shop.coverDataUrl
        ? { backgroundImage: `url(${shop.coverDataUrl})` }
        : {};
    return (<div className="min-h-screen bg-muted/30 pb-16">
      <div className="max-w-2xl mx-auto bg-card min-h-screen sm:my-6 sm:rounded-3xl sm:shadow-xl overflow-hidden sm:border">
        {/* Cover image */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[16/7] bg-cover bg-center bg-gradient-to-br from-amber-100 via-orange-200 to-rose-200" style={coverStyle}>
          {!shop.coverDataUrl && (<div className="absolute inset-0 flex items-center justify-center">
              <Store className="w-20 h-20 text-white/40"/>
            </div>)}
        </div>

        {/* Avatar overlapping cover */}
        <div className="relative -mt-12 sm:-mt-14 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[5px] border-card bg-card shadow-md overflow-hidden flex items-center justify-center">
              {shop.logoDataUrl ? (<img src={shop.logoDataUrl} alt={shop.name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <Store className="w-10 h-10 text-primary"/>
                </div>)}
            </div>
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card" aria-label="Online"/>
          </div>
        </div>

        {/* Shop info */}
        <div className="px-4 sm:px-6 pt-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {shop.name}
          </h1>
          {shop.description && (<p className="text-muted-foreground mt-1 max-w-md mx-auto">
              {shop.description}
            </p>)}
          <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 text-sm font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500"/>
              {rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground/50 text-xs">•</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-sm font-semibold">
              <ShieldCheck className="w-3.5 h-3.5"/>
              Verified Shop
            </span>
          </div>
        </div>

        <div className="px-4 sm:px-6 mt-6">
          <div className="border-t pt-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-xl font-bold tracking-tight">All Items</h2>
              {products.length > 4 && (<div className="relative max-w-[180px] flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="w-full h-9 pl-9 pr-3 rounded-full border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                </div>)}
            </div>

            {products.length === 0 ? (<div className="rounded-2xl p-10 text-center border border-dashed">
                <PackageSearch className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40"/>
                <h3 className="font-bold text-lg mb-1">Coming soon</h3>
                <p className="text-sm text-muted-foreground">
                  This shop hasn't added any products yet. Check back later.
                </p>
              </div>) : filtered.length === 0 ? (<p className="text-sm text-muted-foreground text-center py-6">
                No items match "{query}".
              </p>) : (<div className="grid grid-cols-2 gap-3 sm:gap-4">
                {filtered.map((product, index) => {
                const badge = badgeForProduct(product, index, filtered.length);
                return (<motion.div key={product.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04, duration: 0.3 }} className="rounded-2xl border bg-card p-2.5 sm:p-3 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
                        {product.imageDataUrl ? (<img src={product.imageDataUrl} alt={product.name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center">
                            <Store className="w-10 h-10 text-muted-foreground/30"/>
                          </div>)}
                        {badge && (<span className={`absolute top-2 left-2 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md shadow-sm ${badge === "Bestseller"
                            ? "bg-card text-foreground border"
                            : "bg-card text-foreground border"}`}>
                            {badge}
                          </span>)}
                      </div>

                      <div className="px-1 pt-3 pb-2 flex-1 flex flex-col">
                        <h3 className="font-bold leading-tight text-sm sm:text-base line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="font-bold text-foreground mt-1 text-base sm:text-lg">
                          {formatCurrency(product.price)}
                        </p>
                      </div>

                      <a href={getWhatsAppOrderLink(shop.phone, product.name, product.price, shop.name)} target="_blank" rel="noopener noreferrer" className="block mt-1">
                        <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl h-10 sm:h-11">
                          <MessageCircle className="w-4 h-4 mr-1.5"/>
                          Order
                        </Button>
                      </a>
                    </motion.div>);
            })}
              </div>)}
          </div>
        </div>

        <footer className="mt-10 mb-2 text-center px-4">
          <p className="text-xs text-muted-foreground inline-flex items-center justify-center gap-1">
            Powered by
            <Link href="/" className="font-bold text-primary inline-flex items-center hover:underline">
              <Zap className="w-3 h-3 ml-1"/>
              DukanLink
            </Link>
          </p>
        </footer>
      </div>
    </div>);
}
