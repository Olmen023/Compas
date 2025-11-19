import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className={styles.landingContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Compás</h1>
        <p className={styles.heroDescription}>
          Tu aplicación web para gestionar calendarios, tareas y colaboración en
          equipo de forma sencilla y eficiente
        </p>

        {/* Auth Buttons */}
        <div className={styles.authButtons}>
          <Link href="/register" className={styles.btnPrimary}>
            Crear Cuenta
          </Link>
          <Link href="/login" className={styles.btnOutline}>
            Iniciar Sesión
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📅</div>
          <p className={styles.featureTitle}>Calendarios</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>✅</div>
          <p className={styles.featureTitle}>Tareas</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>👥</div>
          <p className={styles.featureTitle}>Equipos</p>
        </div>
      </div>
    </main>
  );
}
