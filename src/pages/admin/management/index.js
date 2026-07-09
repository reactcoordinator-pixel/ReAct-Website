"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, CardBody, Button, Spinner } from "@heroui/react";
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
  Newspaper,
  Share2,
  Menu as MenuIcon,
  Shield,
  LogOut,
  Inbox,
  Layers,
} from "lucide-react";

const GROUPS = [
  {
    label: "Content Pages",
    items: [
      { title: "Home Page", description: "Hero, intro, mission & vision", icon: Home, href: "/admin/management/home" },
      { title: "About Page", description: "Story, history, team images", icon: Info, href: "/admin/management/about" },
      { title: "Contact Page", description: "Contact info & form settings", icon: Phone, href: "/admin/management/contact" },
      { title: "Privacy Policy", description: "Legal & privacy content", icon: Shield, href: "/admin/management/privacy" },
    ],
  },
  {
    label: "Posts & Projects",
    items: [
      { title: "News & Blogs", description: "Manage blog posts", icon: FileText, href: "/admin/management/blogs" },
      { title: "New Blog", description: "Write & publish a post", icon: PlusCircle, href: "/admin/management/post/newBlog" },
      { title: "Projects", description: "Manage projects", icon: FolderOpen, href: "/admin/management/services" },
      { title: "New Project", description: "Add a project", icon: Sparkles, href: "/admin/management/post/newProject" },
    ],
  },
  {
    label: "Site & People",
    items: [
      { title: "Navigation", description: "Header & footer menus", icon: MenuIcon, href: "/admin/management/navigation" },
      { title: "Social Links", description: "Social media & email", icon: Share2, href: "/admin/management/social" },
      { title: "Newsletter", description: "Subscribers & broadcasts", icon: Newspaper, href: "/admin/management/newsletter" },
      { title: "Admins", description: "Manage admin accounts", icon: Users, href: "/admin/management/users" },
    ],
  },
];

const STAT_META = [
  { key: "blogs", label: "Blogs", icon: FileText, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
  { key: "projects", label: "Projects", icon: Layers, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
  { key: "subscribers", label: "Subscribers", icon: Mail, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" },
  { key: "messages", label: "Messages", icon: Inbox, color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30" },
  { key: "admins", label: "Admins", icon: Users, color: "text-violet-600 bg-violet-100 dark:bg-violet-900/30" },
];

export default function Dashboard() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") !== "true") {
      router.replace("/admin");
      return;
    }
    setAuthed(true);
    try {
      setAdmin(JSON.parse(localStorage.getItem("admin") || "null"));
    } catch {}
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, [router]);

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("admin");
    router.replace("/admin");
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f8cf2c] to-amber-500 flex items-center justify-center shadow">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-gray-800 dark:text-white">ReAct Admin</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Content Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black hidden sm:block">
              View site ↗
            </Link>
            <Button
              size="sm"
              variant="flat"
              color="danger"
              startContent={<LogOut className="w-4 h-4" />}
              onPress={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back{admin?.name ? `, ${admin.name}` : ""} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Everything on your website is editable from here.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {STAT_META.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.key} className="border-none shadow-sm bg-white/80 dark:bg-gray-800/80">
                <CardBody className="flex-row items-center gap-3 p-4">
                  <div className={`p-2.5 rounded-xl ${s.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                      {stats ? stats[s.key] ?? 0 : "—"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Grouped actions */}
        {GROUPS.map((group) => (
          <section key={group.label} className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              {group.label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {group.items.map((card) => {
                const Icon = card.icon;
                return (
                  <Link href={card.href} key={card.title}>
                    <Card
                      isPressable
                      className="w-full h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 group"
                    >
                      <CardBody className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2.5 rounded-xl bg-[#f8cf2c]/20 text-[#a67c00] dark:text-[#f8cf2c] group-hover:bg-[#f8cf2c] group-hover:text-black transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#f8cf2c] group-hover:translate-x-1 transition-all" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{card.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{card.description}</p>
                      </CardBody>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
