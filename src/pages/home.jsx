import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, MessageCircle, Zap, Smartphone, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
// We'll use the generated images
import heroPhoneUrl from "@/assets/hero-phone.png";
import featureSetupUrl from "@/assets/feature-setup.png";
import featureWhatsappUrl from "@/assets/feature-whatsapp.png";
import featureMobileUrl from "@/assets/feature-mobile.png";
export default function Home() {
    return (<div className="min-h-screen bg-background flex flex-col font-sans overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl">
            <Store className="w-6 h-6"/>
            <span>DukanLink</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Login
            </Link>
            <Link href="/create">
              <Button size="sm" className="font-medium rounded-full px-6 shadow-md hover:shadow-lg transition-shadow">
                Create Shop
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-24 md:pt-32 md:pb-32 px-4 sm:px-6 relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10"/>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#25D366]/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 -z-10"/>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-2">
              <MessageCircle className="w-4 h-4"/> No coding required
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight">
              Add your shop online in under <span className="text-primary relative whitespace-nowrap">
                <span className="relative z-10">2 minutes</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-10 transform -rotate-1"></span>
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              No coding, no hassle — create a beautiful mobile storefront and get orders sent straight to your WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/create">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1">
                  Create Shop Now <ArrowRight className="ml-2 w-5 h-5"/>
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1 mt-2 sm:mt-0 px-4">
                <CheckCircle2 className="w-4 h-4 text-green-500"/> Free to use
              </p>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative mx-auto w-full max-w-md md:max-w-none">
            <div className="relative w-full aspect-[3/4] max-h-[600px] flex items-center justify-center">
              {/* This will be the generated image */}
              <img src={heroPhoneUrl} alt="DukanLink on a mobile phone" className="object-contain w-full h-full drop-shadow-2xl z-10 scale-110"/>
              
              {/* Decorative background elements behind phone */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-2xl z-0 scale-75 transform translate-y-10"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Trusted By */}
      <section className="py-10 border-y bg-white/50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-6">Trusted by 10,000+ local businesses</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale font-bold text-xl">
            <span>The Daily Bake</span>
            <span>Style Boutique</span>
            <span>Organic Roots</span>
            <span>Corner Grocery</span>
            <span>Tech Fix</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need, nothing you don't.</h2>
            <p className="text-lg text-muted-foreground">We stripped away the complex dashboards to build the easiest e-commerce tool on the internet.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg bg-gray-50/50 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="h-48 w-full p-4 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <img src={featureSetupUrl} alt="Easy Setup" className="h-full object-contain mix-blend-multiply"/>
              </div>
              <CardContent className="p-6">
                <Zap className="w-10 h-10 text-primary mb-4"/>
                <h3 className="text-xl font-bold mb-2">Easy Setup</h3>
                <p className="text-muted-foreground leading-relaxed">Add your business name, upload photos, set prices. You'll be ready to sell in less time than it takes to make a cup of chai.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gray-50/50 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="h-48 w-full p-4 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
                <img src={featureWhatsappUrl} alt="WhatsApp Orders" className="h-full object-contain mix-blend-multiply"/>
              </div>
              <CardContent className="p-6">
                <MessageCircle className="w-10 h-10 text-[#25D366] mb-4"/>
                <h3 className="text-xl font-bold mb-2">Orders via WhatsApp</h3>
                <p className="text-muted-foreground leading-relaxed">No confusing checkout flows. Customers browse your products and click to send a pre-filled order message straight to your WhatsApp.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gray-50/50 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="h-48 w-full p-4 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                <img src={featureMobileUrl} alt="Mobile Friendly" className="h-full object-contain mix-blend-multiply"/>
              </div>
              <CardContent className="p-6">
                <Smartphone className="w-10 h-10 text-primary mb-4"/>
                <h3 className="text-xl font-bold mb-2">Mobile Friendly</h3>
                <p className="text-muted-foreground leading-relaxed">Your shop looks beautiful on every device. Give your customers a professional scrolling experience that builds trust.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 sm:px-6 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-primary-foreground/80 text-lg">Three simple steps to your first online order.</p>
          </div>
          
          <div className="space-y-12">
            {[
            { num: "01", title: "Create your shop", desc: "Enter your business name and the WhatsApp number where you want to receive orders." },
            { num: "02", title: "Add your products", desc: "Upload a picture, give it a name, and set a price. Repeat for your whole catalogue." },
            { num: "03", title: "Share your link", desc: "Put your dukanlink.com/shop link in your Instagram bio, Facebook page, or WhatsApp status." }
        ].map((step, i) => (<div key={i} className="flex gap-6 items-start">
                <div className="shrink-0 w-16 h-16 rounded-2xl bg-white text-primary flex items-center justify-center text-2xl font-bold shadow-lg">
                  {step.num}
                </div>
                <div className="pt-2">
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-primary-foreground/80 text-lg max-w-md">{step.desc}</p>
                </div>
              </div>))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to upgrade your business?</h2>
          <p className="text-xl text-muted-foreground mb-10">Stop managing orders through chaotic chat histories. Give your customers a real storefront today.</p>
          <Link href="/create">
            <Button size="lg" className="h-16 px-10 text-xl font-bold rounded-full shadow-xl hover:scale-105 transition-transform">
              Create Your Free Shop Now
            </Button>
          </Link>
          <p className="mt-6 text-sm text-muted-foreground">Takes 2 minutes. No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <Store className="w-6 h-6"/>
            <span>DukanLink</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} DukanLink. Empowering local businesses.
          </p>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>);
}
