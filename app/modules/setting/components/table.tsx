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
import { Link, useNavigate, useOutlet } from "react-router";

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
    id: "actions",
    cell: ({ row }) => {
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
              <Link to={`/desk/settings/${setting.id}`}>Edit</Link>
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
      <div className="overflow-hidden rounded border">
        <DeskTableView columns={columns} data={settings} />
      </div>
    </Fragment>
  );
}
