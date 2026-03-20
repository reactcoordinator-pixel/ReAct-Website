"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import { Card, CardBody, Input, Button, Divider, Chip } from "@heroui/react";
import RootLayout from "@/components/RootLayout";
import { User, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/pages/api/FirebaseConfig"; // Adjust path if needed

const SignIn: React.FC = () => {
  const initForm = {
    username: "",
    password: "",
  };

  const [formData, setFormData] = useState(initForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSignIn = async () => {
    if (!formData.username || !formData.password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First: Allow initial hard-coded login (remove this block later when you have real admins)
      if (
        formData.username === "reactmalaysia" &&
        formData.password === "11221122"
      ) {
        localStorage.setItem("isAuthenticated", "true");
        router.push("/admin/management");
        return;
      }

      // Then: Check against Firebase admins collection
      const querySnapshot = await getDocs(collection(db, "admins"));
      const admins = querySnapshot.docs.map((doc) => doc.data());

      const match = admins.find(
        (admin: any) =>
          admin.username === formData.username &&
          admin.password === formData.password,
      );

      if (match) {
        localStorage.setItem("isAuthenticated", "true");
        console.log("Authentication successful");
        router.push("/admin/management");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSignIn();
    }
  };

  return (
    <RootLayout>
      <div className="min-h-screen flex mb-10 items-center justify-center p-4 bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="w-full max-w-6xl">
          <Card className="w-full shadow-2xl border-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
            <CardBody className="p-0 overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Left Panel - Branding */}
                <div className="lg:w-1/2 bg-gradient-to-br from-[#f8cf2c] to-amber-500 p-12 lg:p-16 flex flex-col justify-center items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

                  <div className="relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                      Welcome Back!
                    </h1>

                    <p className="text-white/90 text-lg mb-8 max-w-md mx-auto">
                      Manage your posts and content with ease. Your dashboard
                      awaits.
                    </p>

                    <div className="flex gap-3 justify-center flex-wrap">
                      <Chip
                        startContent={<Sparkles className="w-4 h-4" />}
                        className="bg-white/20 text-white border-white/30"
                        variant="bordered"
                      >
                        Easy Management
                      </Chip>
                      <Chip
                        startContent={<Sparkles className="w-4 h-4" />}
                        className="bg-white/20 text-white border-white/30"
                        variant="bordered"
                      >
                        Secure Access
                      </Chip>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Sign In Form */}
                <div className="lg:w-1/2 p-8 lg:p-16">
                  <div className="max-w-md mx-auto">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        Sign In
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Enter your username and password to access your account
                      </p>
                    </div>

                    {error && (
                      <Card className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                        <CardBody className="py-3">
                          <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                            {error}
                          </p>
                        </CardBody>
                      </Card>
                    )}

                    <div className="space-y-6" onKeyPress={handleKeyPress}>
                      <Input
                        type="text"
                        label="Username"
                        placeholder="Enter your username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        startContent={
                          <User className="w-4 h-4 text-gray-400" />
                        }
                        variant="bordered"
                        size="lg"
                        isRequired
                        classNames={{
                          input: "text-base",
                          inputWrapper:
                            "border-gray-300 dark:border-gray-600 hover:border-[#f8cf2c] dark:hover:border-[#f8cf2c] group-data-[focused=true]:border-[#f8cf2c]",
                        }}
                      />

                      <Input
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        placeholder="Enter your password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        startContent={
                          <Lock className="w-4 h-4 text-gray-400" />
                        }
                        endContent={
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="focus:outline-none"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        }
                        variant="bordered"
                        size="lg"
                        isRequired
                        classNames={{
                          input: "text-base",
                          inputWrapper:
                            "border-gray-300 dark:border-gray-600 hover:border-[#f8cf2c] dark:hover:border-[#f8cf2c] group-data-[focused=true]:border-[#f8cf2c]",
                        }}
                      />

                      <Button
                        onClick={handleSignIn}
                        className="w-full bg-[#f8cf2c] hover:bg-[#e6c028] text-white font-semibold text-base h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                        size="lg"
                        isLoading={loading}
                        disabled={loading}
                      >
                        {loading ? "Signing In..." : "Sign In"}
                      </Button>
                    </div>

                    <Divider className="my-8" />

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                      Protected by enterprise-grade security
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </RootLayout>
  );
};

export default SignIn;
