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
import styles from "./Sidebar.module.css";

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
    <aside className={styles.sidebar}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <Link href="/dashboard" className={styles.logoLink}>
            <div className={styles.logoIcon}>
              <Compass className={styles.logoIconSvg} />
            </div>
            <span className={styles.logoText}>
              Compás
            </span>
          </Link>
        </div>

        {/* Perfil de usuario */}
        <div className={styles.profileCard}>
          <Avatar className={styles.profileAvatar}>
            <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
            <AvatarFallback className={styles.logoIcon}>
              {getInitials(profile?.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>
              {profile?.full_name || "Usuario"}
            </p>
            <p className={styles.profileEmail}>{user.email}</p>
          </div>
        </div>

        <Separator />

        {/* Navegación */}
        <nav className={styles.nav}>
          <ul role="list" className={styles.navList}>
            <li>
              <ul role="list" className={styles.navItems}>
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`${styles.navLink} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`.trim()}
                      >
                        <item.icon
                          className={`${styles.navIcon} ${isActive ? styles.navIconActive : ''}`.trim()}
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
            <li className={styles.logoutContainer}>
              <form action="/auth/signout" method="post">
                <Button
                  type="submit"
                  variant="ghost"
                  className={styles.logoutButton}
                >
                  <LogOut className={styles.logoutIcon} />
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
