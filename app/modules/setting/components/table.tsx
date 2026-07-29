import { type ColumnDef, type Row } from "@tanstack/react-table";
import type { SettingSchema } from "../schemas";
import { EllipsisVerticalIcon } from "lucide-react";
import DeskTableView from "~/components/desk/views/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { Link, useNavigate, useOutlet, useSearchParams } from "react-router";
import { Badge } from "~/components/ui/badge";

export const columns: ColumnDef<SettingSchema>[] = [
  {
    accessorKey: "key",
    header: "Key",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "isPublic",
    header: "Public",
    cell: ({ row }) =>
      row.original.isPublic ? (
        <Badge variant="outline">Yes</Badge>
      ) : (
        <Badge variant="destructive">No</Badge>
      ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [searchParams] = useSearchParams();
      const setting = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <EllipsisVerticalIcon />
              <span className="sr-only">Open Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                to={`/desk/settings/${setting.id}?${searchParams.toString()}`}
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface SettingTableViewProps {
  settings: SettingSchema[];
}

export default function SettingTableView({ settings }: SettingTableViewProps) {
  return (
    <Fragment>
      <div className="overflow-hidden rounded-md border">
        <DeskTableView columns={columns} data={settings} />
      </div>
    </Fragment>
  );
}
