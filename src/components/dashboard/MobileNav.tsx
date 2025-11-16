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
import styles from "./MobileNav.module.css";

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
    <div className={styles.mobileNav}>
      <div className={styles.header}>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={styles.menuButton}
            >
              <Menu className={styles.menuIcon} aria-hidden="true" />
              <span className={styles.srOnly}>Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className={styles.sheetContent}>
            <div className={styles.contentWrapper}>
              {/* Header */}
              <SheetHeader className={styles.sheetHeader}>
                <SheetTitle className={styles.headerTitle}>
                  <div className={styles.logoIcon}>
                    <Compass className={styles.logoIconSvg} />
                  </div>
                  <span className={styles.logoText}>Compás</span>
                </SheetTitle>
              </SheetHeader>

              {/* Perfil de usuario */}
              <div className={styles.profileSection}>
                <div className={styles.profileCard}>
                  <Avatar className={styles.profileAvatar}>
                    <AvatarImage
                      src={profile?.avatar_url}
                      alt={profile?.full_name}
                    />
                    <AvatarFallback className={styles.logoIcon}>
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={styles.profileInfo}>
                    <p className={styles.profileName}>
                      {profile?.full_name || "Usuario"}
                    </p>
                    <p className={styles.profileEmail}>
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Navegación */}
              <nav className={styles.nav}>
                <ul role="list" className={styles.navList}>
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`${styles.navLink} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`.trim()}
                        >
                          <item.icon
                            className={`${styles.navIcon} ${isActive ? styles.navIconActive : ''}`.trim()}
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
              <div className={styles.logoutSection}>
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
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo en el centro para móvil */}
        <div className={styles.centerSection}>
          <Link href="/dashboard" className={styles.centerLogo}>
            <div className={styles.centerLogoIcon}>
              <Compass className={styles.centerLogoIconSvg} />
            </div>
            <span className={styles.centerLogoText}>
              Compás
            </span>
          </Link>
        </div>

        {/* Avatar en la derecha */}
        <Avatar className={styles.headerAvatar}>
          <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
          <AvatarFallback className={styles.headerAvatarFallback}>
            {getInitials(profile?.full_name)}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
