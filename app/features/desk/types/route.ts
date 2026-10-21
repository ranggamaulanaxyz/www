import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { PathPattern, UIMatch } from "react-router";

export type Breadcrumb = {
  label: string;
  to?: string;
  current?: boolean;
};

export type SidebarItem = {
  icon?: LucideIcon;
  label: string;
  pathname?: string;
  searchParams?: string;
  hashtag?: string;
  matchPattern?: string | PathPattern<string>;
  children?: SidebarItem[];
};

export type SidebarGroup = {
  items: SidebarItem[];
};

export type Handle<Data> = {
  title?: string;
  breadcrumb?:
    Breadcrumb | ((match: UIMatch<Data, Handle<Data>>) => Breadcrumb);
  sidebarRegistry?: (match: UIMatch<Data, Handle<Data>>) => SidebarGroup[];
};

export type Match<Data> = UIMatch<Data, Handle<Data>>;
