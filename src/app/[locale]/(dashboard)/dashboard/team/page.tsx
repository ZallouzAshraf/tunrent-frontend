"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dashboardApi, getErrorMessage } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { AgencyUserRole } from "@/types";

export default function DashboardTeamPage() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AgencyUserRole>(AgencyUserRole.AGENT);
  const [open, setOpen] = useState(false);

  const { data: team, isLoading } = useQuery({
    queryKey: ["dashboard", "team"],
    queryFn: async () => (await dashboardApi.getTeam()).data,
  });

  const inviteMutation = useMutation({
    mutationFn: () => dashboardApi.inviteMember(email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "team"] });
      toast.success("Invitation envoyée");
      setOpen(false);
      setEmail("");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, newRole }: { id: string; newRole: string }) =>
      dashboardApi.updateMemberRole(id, newRole),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["dashboard", "team"] }),
  });

  const suspendMutation = useMutation({
    mutationFn: (id: string) => dashboardApi.suspendMember(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["dashboard", "team"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Équipe</h1>
          <p className="text-muted-foreground">
            Gérez les membres de votre agence
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4" />
              Inviter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inviter un membre</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    {Object.values(AgencyUserRole).map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={!email || inviteMutation.isPending}
                onClick={() => inviteMutation.mutate()}
              >
                {inviteMutation.isPending && (
                  <Loader2 className="animate-spin" />
                )}
                Envoyer l&apos;invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{team?.length ?? 0} membre(s)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Depuis</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {team?.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      {member.user?.firstName} {member.user?.lastName}
                    </TableCell>
                    <TableCell>{member.user?.email}</TableCell>
                    <TableCell>
                      <Select
                        value={member.role}
                        onValueChange={(v) =>
                          roleMutation.mutate({ id: member.id, newRole: v })
                        }
                      >
                        <SelectTrigger className="h-8 w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(AgencyUserRole).map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="capitalize">{member.status}</TableCell>
                    <TableCell>{formatDate(member.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => suspendMutation.mutate(member.id)}
                      >
                        Suspendre
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
