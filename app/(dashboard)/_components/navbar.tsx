import { NavbarRoutes } from "@/components/navbar-routes"

import { MobileSidebar } from "./mobile-sidebar"

export const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  )
}
