import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { findShopByPhone, saveShop, getShop } from "@/lib/storage";
import { Store, ChevronRight, Loader2, MessageCircle, ArrowLeft, ShieldCheck, Phone, } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export default function Login() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [step, setStep] = useState("phone");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [sending, setSending] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [countdown, setCountdown] = useState(30);
    useEffect(() => {
        if (step !== "otp")
            return;
        if (countdown <= 0)
            return;
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown, step]);
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setPhoneError("");
        const trimmed = phone.trim();
        if (!trimmed || trimmed.replace(/[^\d]/g, "").length < 8) {
            setPhoneError("Enter a valid WhatsApp number.");
            return;
        }
        const shop = findShopByPhone(trimmed);
        if (!shop) {
            setPhoneError("We couldn't find a shop for that number. Try creating one first.");
            return;
        }
        setSending(true);
        await new Promise((r) => setTimeout(r, 900));
        setSending(false);
        setStep("otp");
        setCountdown(30);
        toast({
            title: "Code sent",
            description: "We sent a 6-digit code to your WhatsApp.",
        });
    };
    const handleVerify = async (e) => {
        e.preventDefault();
        setOtpError("");
        if (otp.length !== 6) {
            setOtpError("Enter the full 6-digit code.");
            return;
        }
        if (otp === "000000") {
            setOtpError("That code didn't match. Try again.");
            return;
        }
        const shop = findShopByPhone(phone);
        if (!shop) {
            setOtpError("Shop not found. Please create one first.");
            return;
        }
        setVerifying(true);
        await new Promise((r) => setTimeout(r, 1100));
        saveShop(shop);
        toast({ title: "Welcome back", description: shop.name });
        setLocation("/dashboard");
    };
    const handleResend = () => {
        setCountdown(30);
        setOtp("");
        setOtpError("");
        toast({
            title: "New code sent",
            description: "Check your WhatsApp again.",
        });
    };
    const maskedPhone = phone.replace(/(\+?\d{2,3})(\d+)(\d{2})/, (_, a, b, c) => `${a} ${"•".repeat(Math.max(b.length, 4))} ${c}`) || phone;
    const hasShop = !!getShop();
    return (<div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-primary/5 via-background to-background">
      <header className="px-4 sm:px-6 py-5 flex items-center justify-between max-w-3xl w-full mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:opacity-90 transition-opacity">
          <Store className="w-5 h-5"/>
          DukanLink
        </Link>
        {step === "otp" ? (<button type="button" onClick={() => {
                setStep("phone");
                setOtp("");
                setOtpError("");
            }} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4"/>
            Edit number
          </button>) : (<Link href="/create" className="text-sm font-medium text-primary hover:underline">
            Create shop
          </Link>)}
      </header>

      <main className="flex-1 flex items-start sm:items-center justify-center px-4 sm:px-6 pb-16">
        <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="w-full max-w-md">
          <Card className="border-border/60 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 border-b border-emerald-100/80 p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 shrink-0">
                <MessageCircle className="w-6 h-6"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                  {step === "phone" ? "Sign in to your shop" : "WhatsApp verification"}
                </p>
                <p className="text-sm text-foreground/90 mt-1 leading-snug">
                  {step === "phone"
            ? "We'll send a 6-digit code to your WhatsApp."
            : (<>
                        Code sent to{" "}
                        <span className="font-semibold">{maskedPhone}</span>
                      </>)}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === "phone" ? (<motion.form key="phone" onSubmit={handleSendOtp} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <CardHeader className="text-center pt-6 pb-2 space-y-2">
                    <CardTitle className="text-2xl sm:text-[26px] font-bold tracking-tight">
                      Login
                    </CardTitle>
                    <CardDescription>
                      Use the WhatsApp number you registered with.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-phone">WhatsApp Number</Label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                        <Input id="login-phone" type="tel" inputMode="tel" placeholder="+91 98765 43210" autoFocus value={phone} onChange={(e) => {
                setPhone(e.target.value);
                setPhoneError("");
            }} className={`pl-10 h-12 text-base ${phoneError ? "border-destructive" : ""}`}/>
                      </div>
                      {phoneError ? (<p className="text-sm text-destructive">{phoneError}</p>) : (<p className="text-xs text-muted-foreground">
                          Same number you used when creating the shop.
                        </p>)}
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-3 pt-2">
                    <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl" disabled={sending}>
                      {sending ? (<span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin"/> Sending code...
                        </span>) : (<span className="flex items-center gap-2">
                          Send OTP <ChevronRight className="w-4 h-4"/>
                        </span>)}
                    </Button>
                    {!hasShop && (<p className="text-xs text-muted-foreground text-center">
                        Don't have a shop yet?{" "}
                        <Link href="/create" className="text-primary font-semibold hover:underline">
                          Create one
                        </Link>
                      </p>)}
                  </CardFooter>
                </motion.form>) : (<motion.form key="otp" onSubmit={handleVerify} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <CardHeader className="text-center pt-6 pb-2 space-y-2">
                    <CardTitle className="text-2xl sm:text-[26px] font-bold tracking-tight">
                      Enter OTP
                    </CardTitle>
                    <CardDescription>
                      Enter the code we sent to your WhatsApp.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-4 flex flex-col items-center">
                    <div className="flex flex-col items-center space-y-3 w-full">
                      <InputOTP maxLength={6} value={otp} onChange={(value) => {
                setOtp(value);
                setOtpError("");
            }} autoFocus containerClassName="gap-2 sm:gap-3">
                        <InputOTPGroup className="gap-2 sm:gap-3">
                          <InputOTPSlot index={0} className={otpSlotCls(otpError)}/>
                          <InputOTPSlot index={1} className={otpSlotCls(otpError)}/>
                          <InputOTPSlot index={2} className={otpSlotCls(otpError)}/>
                        </InputOTPGroup>
                        <InputOTPSeparator className="text-muted-foreground/50"/>
                        <InputOTPGroup className="gap-2 sm:gap-3">
                          <InputOTPSlot index={3} className={otpSlotCls(otpError)}/>
                          <InputOTPSlot index={4} className={otpSlotCls(otpError)}/>
                          <InputOTPSlot index={5} className={otpSlotCls(otpError)}/>
                        </InputOTPGroup>
                      </InputOTP>
                      {otpError ? (<p role="alert" className="text-sm text-destructive font-medium">
                          {otpError}
                        </p>) : (<p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600"/>
                          Codes expire after 10 minutes.
                        </p>)}
                    </div>
                    <div className="text-sm text-center w-full">
                      Didn't receive the code?{" "}
                      {countdown > 0 ? (<span className="text-muted-foreground font-medium">
                          Resend in {countdown}s
                        </span>) : (<button type="button" onClick={handleResend} className="text-primary font-semibold hover:underline focus:outline-none">
                          Resend now
                        </button>)}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl" disabled={verifying || otp.length !== 6}>
                      {verifying ? (<span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin"/> Signing in...
                        </span>) : (<span className="flex items-center gap-2">
                          Sign in <ChevronRight className="w-4 h-4"/>
                        </span>)}
                    </Button>
                  </CardFooter>
                </motion.form>)}
            </AnimatePresence>
          </Card>
        </motion.div>
      </main>
    </div>);
}
function otpSlotCls(error) {
    return [
        "w-11 h-12 sm:w-12 sm:h-14 rounded-xl border-input shadow-sm text-lg sm:text-xl font-semibold",
        "first:rounded-xl last:rounded-xl border-l",
        "bg-card focus-within:ring-2 focus-within:ring-primary/40",
        error ? "border-destructive ring-1 ring-destructive/40" : "",
    ]
        .filter(Boolean)
        .join(" ");
}
