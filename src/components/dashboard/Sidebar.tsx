"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Users,
  Settings,
  LogOut,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SidebarProps {
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

export function Sidebar({ user, profile }: SidebarProps) {
  const pathname = usePathname();

  const getInitials = (name?: string) => {
    if (!name) return user.email?.[0]?.toUpperCase() || "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-[hsl(var(--sidebar))] border-r border-border">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto px-4 pb-4">
        {/* Logo */}
        <div className="flex h-14 shrink-0 items-center">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="p-1.5 bg-primary/20 rounded-md">
              <Compass className="h-4 w-4 text-primary" />
            </div>
            <span className="text-base font-semibold text-foreground">
              Compás
            </span>
          </Link>
        </div>

        {/* Perfil de usuario */}
        <div className="flex items-center space-x-3 px-2 py-2 rounded-md hover:bg-[hsl(var(--sidebar-hover))] transition-all cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
            <AvatarFallback className="bg-primary text-white font-semibold text-xs">
              {getInitials(profile?.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {profile?.full_name || "Usuario"}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        <Separator />

        {/* Navegación */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-1">
            <li>
              <ul role="list" className="space-y-0.5">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
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
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            {/* Logout en la parte inferior */}
            <li className="mt-auto">
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
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
