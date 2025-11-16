"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  createDocument,
  updateDocument,
  type TeamDocument,
} from "@/lib/services/documentService";

interface DocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  document: TeamDocument | null;
  teamId: string;
  userId: string;
}

export function DocumentDialog({
  isOpen,
  onClose,
  onSave,
  document,
  teamId,
  userId,
}: DocumentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (document) {
        setTitle(document.title);
        setUrl(document.url);
        setDescription(document.description || "");
      } else {
        setTitle("");
        setUrl("");
        setDescription("");
      }
    }
  }, [isOpen, document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("El título es requerido");
      return;
    }

    if (!url.trim()) {
      toast.error("La URL es requerida");
      return;
    }

    // Validar URL
    try {
      new URL(url);
    } catch {
      toast.error("Por favor, ingresa una URL válida");
      return;
    }

    setIsLoading(true);

    try {
      if (document) {
        await updateDocument(document.id, {
          title: title.trim(),
          url: url.trim(),
          description: description.trim() || undefined,
        });
        toast.success("Documento actualizado correctamente");
      } else {
        await createDocument({
          team_id: teamId,
          title: title.trim(),
          url: url.trim(),
          description: description.trim() || undefined,
          created_by: userId,
        });
        toast.success("Documento creado correctamente");
      }

      onSave();
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("Error al guardar el documento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {document ? "Editar Documento" : "Nuevo Documento"}
          </DialogTitle>
          <DialogDescription>
            {document
              ? "Modifica los detalles del documento compartido"
              : "Agrega un nuevo documento compartido al equipo"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Plan de proyecto 2024"
              required
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://docs.google.com/..."
              required
            />
            <p className="text-xs text-muted-foreground">
              Enlace a Google Drive, Notion, Dropbox, etc.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción del documento..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Guardando..."
                : document
                ? "Actualizar"
                : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
