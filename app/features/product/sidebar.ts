import { Package2Icon, StoreIcon, TagsIcon } from "lucide-react";
import type { SidebarGroup } from "~/features/desk/types/route";

export function productSidebarRegistry(): SidebarGroup[] {
  return [
    {
      items: [
        {
          icon: Package2Icon,
          label: "Produk",
          pathname: "/desk/products",
          matchPattern: "/desk/products/*",
        },
        {
          icon: StoreIcon,
          label: "Merek",
          pathname: "/desk/product-brands",
          matchPattern: "/desk/product-brands/*",
        },
        {
          icon: TagsIcon,
          label: "Kategori",
          pathname: "/desk/product-categories",
          matchPattern: "/desk/product-categories/*",
        },
      ],
    },
  ];
}
