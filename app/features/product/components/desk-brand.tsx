import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { ProductBrand } from "../types/product-brand";
import { Button } from "~/components/ui/button";
import { EllipsisVerticalIcon, EyeIcon } from "lucide-react";
import { Link } from "react-router";

type DeskProductBrandActionDropdownProps = {
  productBrand: ProductBrand;
};
export function DeskProductBrandActionDropdown({
  productBrand,
}: DeskProductBrandActionDropdownProps) {
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
              <Link to={`/desk/product-brands/${productBrand.id}`}>
                <EyeIcon /> <span>Buka</span>
              </Link>
            }
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
