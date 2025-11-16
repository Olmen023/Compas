"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ExternalLink, Trash2, Edit, FileText } from "lucide-react";
import {
  getTeamDocuments,
  createDocument,
  deleteDocument,
  subscribeToDocuments,
  type TeamDocument,
} from "@/lib/services/documentService";
import { toast } from "sonner";
import { DocumentDialog } from "./DocumentDialog";
import styles from "./TeamDocuments.module.css";

interface TeamDocumentsProps {
  teamId: string;
  userId: string;
}

export function TeamDocuments({ teamId, userId }: TeamDocumentsProps) {
  const [documents, setDocuments] = useState<TeamDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TeamDocument | null>(null);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await getTeamDocuments(teamId);
      setDocuments(data);
    } catch (error) {
      console.error("Error loading documents:", error);
      toast.error("Error al cargar los documentos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [teamId]);

  useEffect(() => {
    const unsubscribe = subscribeToDocuments(teamId, loadDocuments);
    return unsubscribe;
  }, [teamId]);

  const handleNewDocument = () => {
    setSelectedDocument(null);
    setIsDialogOpen(true);
  };

  const handleEditDocument = (document: TeamDocument) => {
    setSelectedDocument(document);
    setIsDialogOpen(true);
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este documento?")) {
      return;
    }

    try {
      await deleteDocument(documentId);
      toast.success("Documento eliminado");
      await loadDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Error al eliminar el documento");
    }
  };

  const handleSave = async () => {
    await loadDocuments();
    setIsDialogOpen(false);
    setSelectedDocument(null);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h2>
              Documentos Compartidos ({documents.length})
            </h2>
            <p>
              Enlaces a documentos que el equipo puede acceder
            </p>
          </div>
          <Button onClick={handleNewDocument}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Documento
          </Button>
        </div>

        {/* Documents Grid */}
        {documents.length === 0 ? (
          <Card className={styles.emptyState}>
            <div className={styles.emptyStateContent}>
              <div className={styles.emptyIcon}>
                <FileText />
              </div>
              <div>
                <h3 className={styles.emptyHeading}>
                  No hay documentos
                </h3>
                <p className={styles.emptyText}>
                  Agrega tu primer documento compartido haciendo clic en el botón de arriba
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <div className={styles.documentsGrid}>
            {documents.map((document) => (
              <Card key={document.id} className={styles.documentCard}>
                <div className={styles.documentContent}>
                  <div className={styles.documentHeader}>
                    <h3 className={styles.documentTitle}>
                      {document.title}
                    </h3>
                    <div className={styles.documentActions}>
                      {document.created_by === userId && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDocument(document)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={styles.deleteButton}
                            onClick={() => handleDeleteDocument(document.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {document.description && (
                    <p className={styles.documentDescription}>
                      {document.description}
                    </p>
                  )}

                  <div className={styles.documentFooter}>
                    <div className={styles.creatorInfo}>
                      {document.creator_avatar && (
                        <img
                          src={document.creator_avatar}
                          alt={document.creator_name || ""}
                          className={styles.creatorAvatar}
                        />
                      )}
                      <span className={styles.creatorName}>
                        {document.creator_name || "Unknown"}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(document.url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Document Dialog */}
      <DocumentDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedDocument(null);
        }}
        onSave={handleSave}
        document={selectedDocument}
        teamId={teamId}
        userId={userId}
      />
    </>
  );
}
