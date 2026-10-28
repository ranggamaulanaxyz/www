import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { Product } from "../types/product";
import { Button } from "~/components/ui/button";
import { EllipsisVerticalIcon, EyeIcon } from "lucide-react";
import { Link } from "react-router";

type DeskProductActionDropdownProps = {
  product: Product;
};
export function DeskProductActionDropdown({
  product,
}: DeskProductActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon">
            <EllipsisVerticalIcon />
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem
            render={
              <Link to={`/desk/products/${product.id}`}>
                <EyeIcon /> <span>Buka</span>
              </Link>
            }
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
