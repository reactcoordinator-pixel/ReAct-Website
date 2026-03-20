"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Chip,
  Divider,
} from "@heroui/react";
import {
  FileText,
  PlusCircle,
  FolderOpen,
  Mail,
  Home,
  Info,
  Phone,
  Sparkles,
  ArrowRight,
  Users,
} from "lucide-react";
import RootLayout from "@/components/RootLayout";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      console.log("isAuthenticated:", isAuthenticated);
      if (!isAuthenticated || isAuthenticated !== "true") {
        router.replace("/admin");
      } else {
        router.replace("/admin/management");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const dashboardCards = [
    {
      title: "Home Page",
      description: "Customize homepage content",
      icon: Home,
      href: "/admin/management/home",
      gradient: "from-indigo-500 to-blue-500",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "About Page",
      description: "Update about page text and images",
      icon: Info,
      href: "/admin/management/about",
      gradient: "from-teal-500 to-cyan-500",
      iconBg: "bg-teal-100 dark:bg-teal-900/30",
      iconColor: "text-teal-600 dark:text-teal-400",
    },
    {
      title: "Contact Page",
      description: "Manage contact information and forms",
      icon: Phone,
      href: "/admin/management/contact",
      gradient: "from-rose-500 to-pink-500",
      iconBg: "bg-rose-100 dark:bg-rose-900/30",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
    {
      title: "News & Blogs",
      description: "Manage and organize your blog posts",
      icon: FileText,
      href: "/admin/management/blogs",
      gradient: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Publish Blogs",
      description: "Create and publish new blog content",
      icon: PlusCircle,
      href: "/admin/management/post/newBlog",
      gradient: "from-green-500 to-emerald-500",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Projects",
      description: "Manage your portfolio projects",
      icon: FolderOpen,
      href: "/admin/management/services",
      gradient: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Publish Project",
      description: "Add new projects to showcase",
      icon: Sparkles,
      href: "/admin/management/post/newProject",
      gradient: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    // {
    //   title: "FAQs",
    //   description: "Update frequently asked questions",
    //   icon: Info,
    //   href: "/admin/management/faqs",
    //   gradient: "from-sky-500 to-blue-500",
    //   iconBg: "bg-sky-100 dark:bg-sky-900/30",
    //   iconColor: "text-sky-600 dark:text-sky-400",
    // },
    {
      title: "Social Links",
      description: "Update social media links",
      icon: Mail,
      href: "/admin/management/social",
      gradient: "from-pink-500 to-fuchsia-500",
      iconBg: "bg-pink-100 dark:bg-pink-900/30",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
    {
      title: "Update Navigation",
      description: "Manage website navigation menu",
      icon: ArrowRight,
      href: "/admin/management/navigation",
      gradient: "from-yellow-500 to-amber-500",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      title: "Privacy Policy",
      description: "Update privacy policy content",
      icon: FileText,
      href: "/admin/management/privacy",
      gradient: "from-slate-500 to-gray-700",
      iconBg: "bg-slate-100 dark:bg-slate-900/30",
      iconColor: "text-slate-600 dark:text-slate-400",
    },
    {
      title: "Newsletter",
      description: "Send emails to your subscribers",
      icon: Mail,
      href: "/admin/management/newsletter",
      gradient: "from-gray-600 to-gray-800",
      iconBg: "bg-gray-100 dark:bg-gray-900/30",
      iconColor: "text-gray-600 dark:text-gray-400",
    },
    {
      title: "Manage Admins", // ← New card
      description:
        "Add and manage admin profiles (name, username, email, password, job role)",
      icon: Users,
      href: "/admin/management/users",
      accentColor: "#f8cf2c", // Solid brand color instead of gradient
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <RootLayout>
      {loading ? (
        <div className="min-h-screen flex flex-col justify-center items-center">
          <Spinner size="lg" color="warning" className="mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading Dashboard...
          </p>
        </div>
      ) : (
        <div className="min-h-screen mx-2 py-8 px-4">
          <div className="">
            {/* Header Section */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f8cf2c] to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                    CMS Dashboard
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your website content with ease
                  </p>
                </div>
              </div>
            </div>

            {/* Dashboard Cards Grid */}
            <div className="flex flex-wrap justify-center gap-2">
              {dashboardCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <Link href={card.href} key={index}>
                    <Card
                      isPressable
                      className="h-full w-96 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none group"
                    >
                      <CardHeader className="pb-0 pt-6 px-6 flex-col items-start">
                        <div
                          className={`p-3 rounded-xl ${card.iconBg} mb-4 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className={`w-6 h-6 ${card.iconColor}`} />
                        </div>
                      </CardHeader>
                      <CardBody className="px-6 pb-6 pt-2">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-between">
                          {card.title}
                          <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {card.description}
                        </p>

                        {/* Gradient bottom accent */}
                        <div
                          className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${card.gradient} rounded-full mt-4 transition-all duration-500`}
                        ></div>
                      </CardBody>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Quick Stats Section */}
          </div>
        </div>
      )}
    </RootLayout>
  );
}
