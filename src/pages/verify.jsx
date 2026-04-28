import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { Store, ChevronRight, Loader2, MessageCircle, ArrowLeft, ShieldCheck, } from "lucide-react";
import { motion } from "framer-motion";
import { getShop } from "@/lib/storage";
export default function VerifyOTP() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [error, setError] = useState("");
    const [shop, setShop] = useState(null);
    useEffect(() => {
        const current = getShop();
        if (!current) {
            setLocation("/create");
            return;
        }
        setShop(current);
    }, [setLocation]);
    useEffect(() => {
        if (countdown <= 0)
            return;
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);
    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        if (otp.length !== 6) {
            setError("Please enter the full 6-digit code.");
            return;
        }
        if (otp === "000000") {
            setError("That code didn't match. Please try again.");
            return;
        }
        setIsVerifying(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1200));
            toast({
                title: "Shop verified",
                description: "Welcome to your DukanLink dashboard.",
            });
            setLocation("/dashboard");
        }
        catch {
            toast({
                title: "Verification failed",
                description: "Please try again.",
                variant: "destructive",
            });
            setIsVerifying(false);
        }
    };
    const handleResend = () => {
        setCountdown(30);
        setOtp("");
        setError("");
        toast({
            title: "New code sent",
            description: "Check your WhatsApp for the latest 6-digit code.",
        });
    };
    const maskedPhone = shop?.phone
        ? shop.phone.replace(/(\+?\d{2,3})(\d+)(\d{2})/, (_, a, b, c) => `${a} ${"•".repeat(Math.max(b.length, 4))} ${c}`)
        : "your WhatsApp number";
    return (<div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-primary/5 via-background to-background">
      <header className="px-4 sm:px-6 py-5 flex items-center justify-between max-w-3xl w-full mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:opacity-90 transition-opacity">
          <Store className="w-5 h-5"/>
          DukanLink
        </Link>
        <Link href="/create" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4"/>
          Edit number
        </Link>
      </header>

      <main className="flex-1 flex items-start sm:items-center justify-center px-4 sm:px-6 pb-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
          <Card className="border-border/60 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 border-b border-emerald-100/80 p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 shrink-0">
                <MessageCircle className="w-6 h-6"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                  WhatsApp verification
                </p>
                <p className="text-sm text-foreground/90 mt-1 leading-snug">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold">{maskedPhone}</span>
                </p>
              </div>
            </div>

            <CardHeader className="text-center pt-6 pb-2 space-y-2">
              <CardTitle className="text-2xl sm:text-[26px] font-bold tracking-tight">
                Verify OTP
              </CardTitle>
              <CardDescription>
                Enter the code below to activate your shop.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleVerify}>
              <CardContent className="space-y-6 pt-4 flex flex-col items-center">
                <div className="flex flex-col items-center space-y-3 w-full">
                  <InputOTP maxLength={6} value={otp} onChange={(value) => {
            setOtp(value);
            setError("");
        }} autoFocus containerClassName="gap-2 sm:gap-3">
                    <InputOTPGroup className="gap-2 sm:gap-3">
                      <InputOTPSlot index={0} className={otpSlot(error)}/>
                      <InputOTPSlot index={1} className={otpSlot(error)}/>
                      <InputOTPSlot index={2} className={otpSlot(error)}/>
                    </InputOTPGroup>
                    <InputOTPSeparator className="text-muted-foreground/50"/>
                    <InputOTPGroup className="gap-2 sm:gap-3">
                      <InputOTPSlot index={3} className={otpSlot(error)}/>
                      <InputOTPSlot index={4} className={otpSlot(error)}/>
                      <InputOTPSlot index={5} className={otpSlot(error)}/>
                    </InputOTPGroup>
                  </InputOTP>

                  {error ? (<p role="alert" className="text-sm text-destructive font-medium">
                      {error}
                    </p>) : (<p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600"/>
                      Codes expire after 10 minutes.
                    </p>)}
                </div>

                <div className="text-sm text-center w-full">
                  Didn't receive the code?{" "}
                  {countdown > 0 ? (<span className="text-muted-foreground font-medium">
                      Resend in {countdown}s
                    </span>) : (<button type="button" onClick={handleResend} className="text-primary font-semibold hover:underline focus:outline-none focus-visible:underline">
                      Resend now
                    </button>)}
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3 pt-2">
                <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl" disabled={isVerifying || otp.length !== 6}>
                  {isVerifying ? (<span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin"/> Verifying...
                    </span>) : (<span className="flex items-center gap-2">
                      Verify & Continue <ChevronRight className="w-4 h-4"/>
                    </span>)}
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">
                  By continuing you agree to DukanLink's Terms and Privacy.
                </p>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </main>
    </div>);
}
function otpSlot(error) {
    return [
        "w-11 h-12 sm:w-12 sm:h-14 rounded-xl border-input shadow-sm text-lg sm:text-xl font-semibold",
        "first:rounded-xl last:rounded-xl border-l",
        "bg-card focus-within:ring-2 focus-within:ring-primary/40",
        error ? "border-destructive ring-1 ring-destructive/40" : "",
    ]
        .filter(Boolean)
        .join(" ");
}
