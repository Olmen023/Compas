"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Shield, Key } from "lucide-react";
import styles from "./SecuritySettings.module.css";

interface SecuritySettingsProps {
  user: any;
}

export function SecuritySettings({ user }: SecuritySettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Contraseña actualizada correctamente");

      // Limpiar formulario
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Error al cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Cambiar contraseña */}
      <Card>
        <CardHeader>
          <CardTitle className={styles.cardTitle}>
            <Key className={styles.cardTitleIcon} />
            Cambiar Contraseña
          </CardTitle>
          <CardDescription>
            Actualiza tu contraseña para mantener tu cuenta segura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className={styles.form}>
            <div className={styles.formField}>
              <Label htmlFor="current-password">Contraseña actual</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Ingresa tu contraseña actual"
                disabled
              />
              <p className={styles.fieldHint}>
                (Verificación deshabilitada temporalmente)
              </p>
            </div>

            <div className={styles.formField}>
              <Label htmlFor="new-password">Nueva contraseña</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                required
                minLength={6}
              />
              <p className={styles.fieldHint}>
                Mínimo 6 caracteres
              </p>
            </div>

            <div className={styles.formField}>
              <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                required
                minLength={6}
              />
            </div>

            <div className={styles.formActions}>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className={styles.loadingIcon} />}
                Cambiar contraseña
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Información de seguridad */}
      <Card>
        <CardHeader>
          <CardTitle className={styles.cardTitle}>
            <Shield className={styles.cardTitleIcon} />
            Información de Cuenta
          </CardTitle>
          <CardDescription>
            Detalles sobre tu cuenta y seguridad
          </CardDescription>
        </CardHeader>
        <CardContent className={styles.infoSection}>
          <div className={styles.infoRow}>
            <div>
              <p className={styles.infoLabel}>Email</p>
              <p className={styles.infoValue}>{user.email}</p>
            </div>
            <span className={styles.badge}>
              Verificado
            </span>
          </div>

          <div className={styles.infoRow}>
            <div>
              <p className={styles.infoLabel}>Cuenta creada</p>
              <p className={styles.infoValue}>
                {new Date(user.created_at).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className={styles.infoRow}>
            <div>
              <p className={styles.infoLabel}>Última actualización</p>
              <p className={styles.infoValue}>
                {new Date(user.updated_at).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zona de peligro */}
      <Card className={styles.dangerZone}>
        <CardHeader>
          <CardTitle className={styles.dangerTitle}>Zona de Peligro</CardTitle>
          <CardDescription>
            Acciones irreversibles con tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={styles.dangerContent}>
            <div>
              <p className={styles.dangerLabel}>Eliminar cuenta</p>
              <p className={styles.dangerDescription}>
                Elimina permanentemente tu cuenta y todos tus datos
              </p>
            </div>
            <Button variant="destructive" disabled>
              Eliminar
            </Button>
          </div>
          <p className={styles.dangerHint}>
            (Funcionalidad próximamente)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
