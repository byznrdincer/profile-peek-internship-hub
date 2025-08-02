import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { Briefcase } from "lucide-react";

interface OTPVerificationProps {
  otpEmail: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setShowOTPVerification: (show: boolean) => void;
  setOtpEmail: (email: string) => void;
}

// Sabit backend URL
const BACKEND_URL = "http://localhost:8000";

const OTPVerification = ({
  otpEmail,
  loading,
  setLoading,
  setShowOTPVerification,
  setOtpEmail,
}: OTPVerificationProps) => {
  const { toast } = useToast();

  const handleOTPVerification = async (otp: string) => {
    if (otp.length !== 6) return;

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: otpEmail,
          otp: otp,
          type: "signup",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Verification failed",
          description: data.error || "Verification failed",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account verified!",
          description:
            "Your account has been successfully verified. You can now log in.",
        });
        setShowOTPVerification(false);
        setOtpEmail("");
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: otpEmail,
          type: "signup",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Resend failed",
          description: data.error || "Resend failed",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Code resent",
          description: "A new verification code has been sent to your email.",
        });
      }
    } catch (error) {
      toast({
        title: "Resend failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              InternStack
            </h1>
          </div>
          <CardTitle>Verify Your Email</CardTitle>
          <p className="text-sm text-muted-foreground">
            We've sent a 6-digit verification code to {otpEmail}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <div className="flex justify-center">
              <InputOTP maxLength={6} onComplete={handleOTPVerification}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={resendOTP}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Resending..." : "Resend Code"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowOTPVerification(false);
                setOtpEmail("");
              }}
              className="w-full"
            >
              Back to Sign Up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerification;
