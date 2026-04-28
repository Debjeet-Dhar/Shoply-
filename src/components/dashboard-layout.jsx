import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Store, Settings as SettingsIcon, Home, Package } from "lucide-react";
export default function DashboardLayout({ shop, children, title = "My Shop Dashboard", hideHeader = false, }) {
    const [location] = useLocation();
    const isActive = (path) => {
        if (path === "/dashboard")
            return location === "/dashboard";
        return location.startsWith(path);
    };
    return (<div className="min-h-screen w-full bg-muted/30 flex flex-col pb-24">
      {!hideHeader && (<header className="bg-card border-b sticky top-0 z-30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {shop.logoDataUrl ? (<div className="w-12 h-12 rounded-full overflow-hidden border bg-card shrink-0">
                  <img src={shop.logoDataUrl} alt={shop.name} className="w-full h-full object-cover"/>
                </div>) : (<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border shrink-0">
                  <Store className="w-5 h-5 text-primary"/>
                </div>)}
              <div className="min-w-0">
                <h1 className="font-bold text-lg leading-tight truncate">
                  {title}
                </h1>
                <p className="text-sm text-muted-foreground truncate">
                  {shop.name}
                </p>
              </div>
            </div>
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="icon" aria-label="Settings" className="shrink-0 text-muted-foreground hover:text-foreground">
                <SettingsIcon className="w-5 h-5"/>
              </Button>
            </Link>
          </div>
        </header>)}

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {children}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-card border-t z-30">
        <div className="max-w-3xl mx-auto grid grid-cols-3">
          <NavTab href="/dashboard" icon={<Home className="w-5 h-5"/>} label="Home" active={isActive("/dashboard") && location === "/dashboard"}/>
          <NavTab href="/dashboard/products" icon={<Package className="w-5 h-5"/>} label="Products" active={location.startsWith("/dashboard/products")}/>
          <NavTab href="/dashboard/settings" icon={<SettingsIcon className="w-5 h-5"/>} label="Settings" active={location.startsWith("/dashboard/settings")}/>
        </div>
      </nav>
    </div>);
}
function NavTab({ href, icon, label, active, }) {
    return (<Link href={href} className={`flex flex-col items-center justify-center gap-1 py-3 transition-colors ${active
            ? "text-primary font-semibold"
            : "text-muted-foreground hover:text-foreground"}`}>
      {icon}
      <span className="text-xs">{label}</span>
    </Link>);
}
