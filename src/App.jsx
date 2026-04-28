import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import CreateShop from "@/pages/create-shop";
import VerifyOTP from "@/pages/verify";
import Login from "@/pages/login";
import DashboardHome from "@/pages/dashboard";
import DashboardProducts from "@/pages/dashboard-products";
import DashboardSettings from "@/pages/dashboard-settings";
import AddProduct from "@/pages/add-product";
import Shop from "@/pages/shop";
import NotFound from "@/pages/not-found";
const queryClient = new QueryClient();
function Router() {
    return (<Switch>
      <Route path="/" component={Home}/>
      <Route path="/create" component={CreateShop}/>
      <Route path="/verify" component={VerifyOTP}/>
      <Route path="/login" component={Login}/>
      <Route path="/dashboard" component={DashboardHome}/>
      <Route path="/dashboard/products" component={DashboardProducts}/>
      <Route path="/dashboard/settings" component={DashboardSettings}/>
      <Route path="/products/new" component={AddProduct}/>
      <Route path="/shop/:slug" component={Shop}/>
      <Route component={NotFound}/>
    </Switch>);
}
function App() {
    return (<QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>);
}
export default App;
