"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { clientApi, getErrorMessage, uploadApi } from "@/lib/api";
import { useAuth } from "@/lib/auth/use-auth";

function DocumentUpload({
  label,
  description,
  currentUrl,
  field,
}: {
  label: string;
  description: string;
  currentUrl?: string;
  field: "cinPhotoUrl" | "drivingLicensePhotoUrl";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: (url: string) => clientApi.updateProfile({ [field]: url }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Document enregistré");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const res = await uploadApi.document(file);
      await updateProfile.mutateAsync(res.data.url);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4" />
          {label}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentUrl ? (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Voir le document actuel
          </a>
        ) : (
          <p className="text-sm text-muted-foreground">Aucun document</p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <Button
          variant="outline"
          disabled={uploading || updateProfile.isPending}
          onClick={() => inputRef.current?.click()}
        >
          {(uploading || updateProfile.isPending) && (
            <Loader2 className="animate-spin" />
          )}
          <Upload className="h-4 w-4" />
          Téléverser
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AccountDocumentsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mes documents</h1>
        <p className="text-muted-foreground">
          CIN et permis de conduire pour accélérer vos réservations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DocumentUpload
          label="Carte d'identité (CIN)"
          description="Recto/verso ou PDF"
          currentUrl={user?.cinPhotoUrl}
          field="cinPhotoUrl"
        />
        <DocumentUpload
          label="Permis de conduire"
          description="Photo ou scan du permis"
          currentUrl={user?.drivingLicensePhotoUrl}
          field="drivingLicensePhotoUrl"
        />
      </div>
    </div>
  );
}
