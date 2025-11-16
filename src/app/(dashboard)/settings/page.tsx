import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { PreferencesSettings } from "@/components/settings/PreferencesSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import styles from "./page.module.css";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Obtener perfil del usuario
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Configuración</h1>
        <p>
          Gestiona tu cuenta y preferencias
        </p>
      </div>

      <Tabs defaultValue="profile" className={styles.tabs}>
        <TabsList className={styles.tabsList}>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className={styles.tabsContent}>
          <ProfileSettings user={user} profile={profile} />
        </TabsContent>

        <TabsContent value="preferences" className={styles.tabsContent}>
          <PreferencesSettings profile={profile} />
        </TabsContent>

        <TabsContent value="security" className={styles.tabsContent}>
          <SecuritySettings user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
