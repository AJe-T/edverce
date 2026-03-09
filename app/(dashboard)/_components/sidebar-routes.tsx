"use client";

import {
  Award,
  BarChart,
  Compass,
  Layout,
  List,
  Ticket,
  Users,
  Megaphone,
  Terminal,
  MessageSquare,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
  {
    icon: Terminal,
    label: "Playground",
    href: "/playground",
  },
  {
    icon: Award,
    label: "Certificates",
    href: "/certificates",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
  {
    icon: Ticket,
    label: "Coupons",
    href: "/teacher/coupons",
  },
  {
    icon: Megaphone,
    label: "Marketing",
    href: "/teacher/marketing",
  },
  {
    icon: Users,
    label: "Students",
    href: "/teacher/students",
  },
  {
    icon: MessageSquare,
    label: "Queries",
    href: "/teacher/queries",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
