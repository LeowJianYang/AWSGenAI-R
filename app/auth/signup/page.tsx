"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    nickname: ""
  });
  
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<"signup" | "confirm">("signup");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.name) {
      setError("Please fill in all required fields");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError("");

    try {
    //   const { userId } = await signUp({
    //     username: formData.username,
    //     password: formData.password,
    //     options: {
    //       userAttributes: {
    //         email: formData.email,
    //         name: formData.name,
    //         nickname: formData.nickname || formData.name,
    //       },
    //     },
    //   });
      
    //   console.log("User ID:", userId);

    axios.post('/api/storage', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        nickname: formData.nickname || formData.name,
    });
      setSuccess("Registration successful! Please check your email for the confirmation code.");
      setStep("confirm");
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirmSignUp(e: React.FormEvent) {
    e.preventDefault();
    
    if (!confirmationCode) {
      setError("Please enter the confirmation code");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
    //   await confirmSignUp({
    //     username: formData.username,
    //     confirmationCode,
    //   });
      
      setSuccess("Email confirmed successfully! You can now sign in.");
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } catch (err: any) {
      console.error("Confirmation failed:", err);
      setError(err.message || "Confirmation failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Aegis Response</h1>
          <p className="text-slate-300">Create your account</p>
        </div>

        {/* Sign Up Card */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">
              {step === "signup" ? "Sign Up" : "Confirm Email"}
            </CardTitle>
            <p className="text-center text-slate-400 text-sm">
              {step === "signup" 
                ? "Create your account to access the system"
                : "Enter the confirmation code sent to your email"
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {step === "signup" ? (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-200">
                    Username <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200">
                    Email <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-200">
                    Full Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-slate-200">
                    Nickname <span className="text-slate-400">(optional)</span>
                  </Label>
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="Enter your nickname"
                    value={formData.nickname}
                    onChange={(e) => handleInputChange("nickname", e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-200">
                    Password <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400 pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-200">
                    Confirm Password <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400 pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="bg-red-900/50 border-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-200">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-900/50 border-green-700">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-200">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleConfirmSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="confirmationCode" className="text-slate-200">
                    Confirmation Code
                  </Label>
                  <Input
                    id="confirmationCode"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <Alert variant="destructive" className="bg-red-900/50 border-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-200">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-900/50 border-green-700">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-200">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    "Confirm Email"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  onClick={() => setStep("signup")}
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign Up
                </Button>
              </form>
            )}

            {/* Link to Login */}
            <div className="pt-4 border-t border-slate-700 text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            © 2025 Aegis Response. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
