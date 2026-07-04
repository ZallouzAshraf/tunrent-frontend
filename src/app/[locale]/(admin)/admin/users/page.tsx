"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, Search, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPagination,
  AdminPanel,
  AdminTableSkeleton,
  AdminToolbar,
  AdminUserAvatar,
} from "@/components/admin/admin-ui";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { RoleGlobal } from "@/types";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", search, page],
    queryFn: async () =>
      (
        await adminApi.getUsers({
          search: search.trim() || undefined,
          page,
          limit: 20,
        })
      ).data,
  });

  const users = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Utilisateurs"
        description="Consultez les comptes clients et administrateurs de la plateforme."
        badge={
          meta?.total != null ? (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {meta.total} compte{meta.total > 1 ? "s" : ""}
            </span>
          ) : undefined
        }
      />

      <AdminToolbar>
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-10 border-black/[0.08] bg-white pl-9"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </AdminToolbar>

      <AdminPanel padding="none">
        {isLoading ? (
          <AdminTableSkeleton />
        ) : users.length === 0 ? (
          <AdminEmptyState
            title="Aucun utilisateur"
            description="Aucun compte ne correspond à votre recherche."
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="border-black/[0.06] bg-slate-50/80 hover:bg-slate-50/80">
                  <TableHead className="font-semibold">Utilisateur</TableHead>
                  <TableHead className="hidden font-semibold md:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold">Rôle</TableHead>
                  <TableHead className="hidden font-semibold sm:table-cell">
                    Vérification
                  </TableHead>
                  <TableHead className="hidden font-semibold lg:table-cell">
                    Inscription
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-black/[0.05]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <AdminUserAvatar
                          firstName={user.firstName}
                          lastName={user.lastName}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground md:hidden">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.roleGlobal === RoleGlobal.SUPER_ADMIN ? (
                        <Badge className="gap-1 bg-[#1e3a5f] hover:bg-[#1e3a5f]">
                          <ShieldCheck className="h-3 w-3" />
                          Super admin
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Client</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant={user.isEmailVerified ? "success" : "destructive"}
                        className="font-medium"
                      >
                        {user.isEmailVerified ? "Vérifié" : "Non vérifié"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {formatDate(user.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {meta && (
              <AdminPagination
                page={meta.page}
                totalPages={meta.totalPages}
                hasPreviousPage={meta.hasPreviousPage}
                hasNextPage={meta.hasNextPage}
                total={meta.total}
                onPrevious={() => setPage((p) => p - 1)}
                onNext={() => setPage((p) => p + 1)}
              />
            )}
          </>
        )}
      </AdminPanel>
    </div>
  );
}
