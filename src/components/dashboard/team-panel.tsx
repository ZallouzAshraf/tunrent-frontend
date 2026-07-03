"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Crown,
  Loader2,
  Mail,
  Search,
  Shield,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardApi, getErrorMessage } from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import type { AgencyUser } from "@/types";
import { AgencyUserRole } from "@/types";

const ROLE_LABELS: Record<AgencyUserRole, string> = {
  [AgencyUserRole.OWNER]: "Propriétaire",
  [AgencyUserRole.MANAGER]: "Manager",
  [AgencyUserRole.AGENT]: "Agent",
};

const ROLE_DESCRIPTIONS: Record<AgencyUserRole, string> = {
  [AgencyUserRole.OWNER]: "Accès complet, facturation et paramètres agence",
  [AgencyUserRole.MANAGER]: "Gestion flotte, réservations et statistiques",
  [AgencyUserRole.AGENT]: "Réservations et opérations quotidiennes",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "warning" }
> = {
  active: { label: "Actif", variant: "default" },
  invited: { label: "Invité", variant: "warning" },
  suspended: { label: "Suspendu", variant: "outline" },
};

function TeamStat({
  label,
  value,
  accent,
  icon: Icon,
}: {
  label: string;
  value: number;
  accent?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-card px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <Icon className="size-3.5 text-muted-foreground/70" />
      </div>
      <p className={cn("mt-1 text-2xl font-bold tabular-nums", accent)}>
        {value}
      </p>
    </div>
  );
}

function MemberAvatar({ member }: { member: AgencyUser }) {
  const first = member.user?.firstName?.[0] ?? "?";
  const last = member.user?.lastName?.[0] ?? "";
  const isOwner = member.role === AgencyUserRole.OWNER;

  return (
    <div
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
        isOwner
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-primary/10 text-primary",
      )}
    >
      {first}
      {last}
    </div>
  );
}

function TeamMemberCard({
  member,
  onRoleChange,
  onSuspend,
  isRoleUpdating,
  isSuspending,
}: {
  member: AgencyUser;
  onRoleChange: (id: string, role: string) => void;
  onSuspend: (id: string) => void;
  isRoleUpdating: boolean;
  isSuspending: boolean;
}) {
  const isOwner = member.role === AgencyUserRole.OWNER;
  const status = STATUS_CONFIG[member.status] ?? {
    label: member.status,
    variant: "outline" as const,
  };
  const fullName = [member.user?.firstName, member.user?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-sm ring-1 ring-black/[0.02] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <MemberAvatar member={member} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold tracking-tight">
              {fullName || "Membre"}
            </h3>
            {isOwner && (
              <Crown className="size-3.5 shrink-0 text-[var(--tunrent-gold)]" />
            )}
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
            <Mail className="size-3.5 shrink-0" />
            {member.user?.email ?? "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Membre depuis {formatDate(member.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <Badge variant={status.variant}>{status.label}</Badge>

        {isOwner ? (
          <Badge variant="secondary">{ROLE_LABELS[member.role]}</Badge>
        ) : (
          <Select
            value={member.role}
            disabled={isRoleUpdating}
            onValueChange={(v) => onRoleChange(member.id, v)}
          >
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[AgencyUserRole.MANAGER, AgencyUserRole.AGENT].map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_LABELS[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {!isOwner && member.status !== "suspended" && (
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-destructive hover:bg-destructive/5 hover:text-destructive"
            disabled={isSuspending}
            onClick={() => onSuspend(member.id)}
          >
            {isSuspending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <UserX className="size-3.5" />
            )}
            Suspendre
          </Button>
        )}
      </div>
    </article>
  );
}

export function TeamPanel() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AgencyUserRole>(AgencyUserRole.AGENT);

  const { data: team, isLoading } = useQuery({
    queryKey: ["dashboard", "team"],
    queryFn: async () => (await dashboardApi.getTeam()).data,
  });

  const members = team ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => {
      const name = `${m.user?.firstName ?? ""} ${m.user?.lastName ?? ""}`.toLowerCase();
      const mail = m.user?.email?.toLowerCase() ?? "";
      return name.includes(q) || mail.includes(q);
    });
  }, [members, search]);

  const stats = useMemo(
    () => ({
      total: members.length,
      active: members.filter((m) => m.status === "active").length,
      invited: members.filter((m) => m.status === "invited").length,
      managers: members.filter(
        (m) =>
          m.role === AgencyUserRole.MANAGER ||
          m.role === AgencyUserRole.OWNER,
      ).length,
    }),
    [members],
  );

  const inviteMutation = useMutation({
    mutationFn: () => dashboardApi.inviteMember(email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "team"] });
      toast.success("Invitation envoyée");
      setInviteOpen(false);
      setEmail("");
      setRole(AgencyUserRole.AGENT);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, newRole }: { id: string; newRole: string }) =>
      dashboardApi.updateMemberRole(id, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "team"] });
      toast.success("Rôle mis à jour");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const suspendMutation = useMutation({
    mutationFn: (id: string) => dashboardApi.suspendMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "team"] });
      toast.success("Membre suspendu");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Équipe</h1>
            <p className="text-sm text-muted-foreground">
              Membres, rôles et accès à votre espace agence
            </p>
          </div>
        </div>
        <Button className="shrink-0" onClick={() => setInviteOpen(true)}>
          <UserPlus className="size-4" />
          Inviter un membre
        </Button>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <TeamStat label="Total" value={stats.total} icon={Users} />
        <TeamStat
          label="Actifs"
          value={stats.active}
          accent="text-emerald-700"
          icon={UserCheck}
        />
        <TeamStat
          label="Invitations"
          value={stats.invited}
          accent="text-amber-700"
          icon={Mail}
        />
        <TeamStat
          label="Managers+"
          value={stats.managers}
          accent="text-primary"
          icon={Shield}
        />
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou email…"
            className="h-10 bg-muted/30 ps-9"
          />
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs text-muted-foreground">
          {isLoading
            ? "Chargement…"
            : `${filtered.length} membre${filtered.length > 1 ? "s" : ""}`}
        </p>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users className="size-7" />
              </div>
              <h2 className="mt-4 text-base font-semibold">
                {search ? "Aucun résultat" : "Aucun membre"}
              </h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {search
                  ? "Essayez un autre nom ou email."
                  : "Invitez votre premier collaborateur pour déléguer la gestion."}
              </p>
              {!search && (
                <Button className="mt-5" onClick={() => setInviteOpen(true)}>
                  <UserPlus className="size-4" />
                  Inviter un membre
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                onRoleChange={(id, newRole) =>
                  roleMutation.mutate({ id, newRole })
                }
                onSuspend={(id) => suspendMutation.mutate(id)}
                isRoleUpdating={roleMutation.isPending}
                isSuspending={suspendMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Inviter un membre</DialogTitle>
            <DialogDescription>
              Un email d&apos;invitation sera envoyé. Le membre rejoindra votre
              agence après acceptation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Adresse email</Label>
              <Input
                type="email"
                placeholder="collaborateur@email.tn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label>Rôle</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as AgencyUserRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[AgencyUserRole.MANAGER, AgencyUserRole.AGENT].map((r) => (
                    <SelectItem key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {ROLE_DESCRIPTIONS[role]}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Annuler
            </Button>
            <Button
              disabled={!email || inviteMutation.isPending}
              onClick={() => inviteMutation.mutate()}
            >
              {inviteMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Envoyer l&apos;invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
