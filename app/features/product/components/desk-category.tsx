import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { ProductCategory } from "../types/product-category";
import { Button } from "~/components/ui/button";
import { EllipsisVerticalIcon, EyeIcon } from "lucide-react";
import { Link } from "react-router";

type DeskProductCategoryActionDropdownProps = {
  productCategory: ProductCategory;
};
export function DeskProductCategoryActionDropdown({
  productCategory,
}: DeskProductCategoryActionDropdownProps) {
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
              <Link to={`/desk/product-categories/${productCategory.id}`}>
                <EyeIcon /> <span>Buka</span>
              </Link>
            }
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
