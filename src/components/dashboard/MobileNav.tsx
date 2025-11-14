"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  Compass,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  user: any;
  profile: any;
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Calendario",
    href: "/calendar",
    icon: Calendar,
  },
  {
    name: "Tareas",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Equipos",
    href: "/teams",
    icon: Users,
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: Settings,
  },
];

export function MobileNav({ user, profile }: MobileNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return user.email?.[0]?.toUpperCase() || "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="sticky top-0 z-40 lg:hidden">
      <div className="flex h-14 items-center gap-x-4 border-b border-border bg-[hsl(var(--sidebar))] px-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-2 hover:bg-[hsl(var(--sidebar-hover))] transition-all rounded-md"
            >
              <Menu className="h-5 w-5 text-foreground" aria-hidden="true" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-[hsl(var(--sidebar))]">
            <div className="flex h-full flex-col">
              {/* Header */}
              <SheetHeader className="border-b border-border px-4 py-3">
                <SheetTitle className="flex items-center space-x-2">
                  <div className="p-1.5 bg-primary/20 rounded-md">
                    <Compass className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-base font-semibold text-foreground">Compás</span>
                </SheetTitle>
              </SheetHeader>

              {/* Perfil de usuario */}
              <div className="px-4 py-3">
                <div className="flex items-center space-x-3 px-2 py-2 hover:bg-[hsl(var(--sidebar-hover))] rounded-md transition-all">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={profile?.avatar_url}
                      alt={profile?.full_name}
                    />
                    <AvatarFallback className="bg-primary text-white font-semibold text-xs">
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {profile?.full_name || "Usuario"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Navegación */}
              <nav className="flex-1 px-4 py-3">
                <ul role="list" className="space-y-0.5">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "group flex gap-x-2 rounded-md px-2 py-1.5 text-sm font-medium transition-all",
                            isActive
                              ? "bg-[hsl(var(--sidebar-active))] text-foreground"
                              : "text-muted-foreground hover:bg-[hsl(var(--sidebar-hover))] hover:text-foreground"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-4 w-4 shrink-0",
                              isActive ? "text-foreground" : "text-muted-foreground"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Logout */}
              <div className="border-t border-border p-4">
                <form action="/auth/signout" method="post">
                  <Button
                    type="submit"
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-[hsl(var(--sidebar-hover))] transition-all rounded-md font-medium h-8 px-2"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </form>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo en el centro para móvil */}
        <div className="flex flex-1 justify-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="p-1.5 bg-primary/20 rounded-md">
              <Compass className="h-4 w-4 text-primary" />
            </div>
            <span className="text-base font-semibold text-foreground">
              Compás
            </span>
          </Link>
        </div>

        {/* Avatar en la derecha */}
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
          <AvatarFallback className="bg-primary text-white text-xs font-semibold">
            {getInitials(profile?.full_name)}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
