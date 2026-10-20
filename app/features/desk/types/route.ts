import type { UIMatch } from "react-router";

export type Breadcrumb = {
  label: string;
  to?: string;
  current?: boolean;
};

export type Handle<Data> = {
  title?: string;
  breadcrumb?:
    Breadcrumb | ((match: UIMatch<Data, Handle<Data>>) => Breadcrumb);
  showInSidebar?: boolean;
};

export type Match<Data> = UIMatch<Data, Handle<Data>>;
