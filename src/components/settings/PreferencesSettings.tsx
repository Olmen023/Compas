"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

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
    <div className="space-y-6">
      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
          <CardDescription>
            Configura cómo y cuándo quieres recibir notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Notificaciones por email</Label>
              <p className="text-sm text-gray-500">
                Recibe notificaciones en tu correo electrónico
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Notificaciones push</Label>
              <p className="text-sm text-gray-500">
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
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="task-reminders">Recordatorios de tareas</Label>
              <p className="text-sm text-gray-500">
                Te avisaremos cuando una tarea esté próxima a vencer
              </p>
            </div>
            <Switch
              id="task-reminders"
              checked={taskReminders}
              onCheckedChange={setTaskReminders}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="event-reminders">Recordatorios de eventos</Label>
              <p className="text-sm text-gray-500">
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
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Guardar preferencias
        </Button>
      </div>
    </div>
  );
}
