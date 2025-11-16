"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import styles from "./PreferencesSettings.module.css";

interface PreferencesSettingsProps {
  profile: any;
}

export function PreferencesSettings({ profile }: PreferencesSettingsProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [taskReminders, setTaskReminders] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);

  const handleSave = () => {
    // TODO: Implementar guardado de preferencias
    toast.info("Las preferencias se guardarán próximamente");
  };

  return (
    <div className={styles.container}>
      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
          <CardDescription>
            Configura cómo y cuándo quieres recibir notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <div className={styles.settingsRow}>
            <div className={styles.settingLabel}>
              <Label htmlFor="email-notifications">Notificaciones por email</Label>
              <p className={styles.settingDescription}>
                Recibe notificaciones en tu correo electrónico
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className={styles.settingsRow}>
            <div className={styles.settingLabel}>
              <Label htmlFor="push-notifications">Notificaciones push</Label>
              <p className={styles.settingDescription}>
                Recibe notificaciones en tu navegador
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recordatorios */}
      <Card>
        <CardHeader>
          <CardTitle>Recordatorios</CardTitle>
          <CardDescription>
            Gestiona tus recordatorios automáticos
          </CardDescription>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <div className={styles.settingsRow}>
            <div className={styles.settingLabel}>
              <Label htmlFor="task-reminders">Recordatorios de tareas</Label>
              <p className={styles.settingDescription}>
                Te avisaremos cuando una tarea esté próxima a vencer
              </p>
            </div>
            <Switch
              id="task-reminders"
              checked={taskReminders}
              onCheckedChange={setTaskReminders}
            />
          </div>

          <div className={styles.settingsRow}>
            <div className={styles.settingLabel}>
              <Label htmlFor="event-reminders">Recordatorios de eventos</Label>
              <p className={styles.settingDescription}>
                Te avisaremos antes de que comience un evento
              </p>
            </div>
            <Switch
              id="event-reminders"
              checked={eventReminders}
              onCheckedChange={setEventReminders}
            />
          </div>
        </CardContent>
      </Card>

      {/* Botón de guardar */}
      <div className={styles.actionsRow}>
        <Button onClick={handleSave}>
          Guardar preferencias
        </Button>
      </div>
    </div>
  );
}
