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
import type { FieldMetadata } from "@conform-to/react";
import { useEffect, useMemo, useState } from "react";
import { FieldCombobox } from "~/components/form/fields/combobox";
import { useSupabase } from "~/contexts/supabase";
import { getProductCategories } from "../services/product-category";

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
type FieldProductCategoryProps = {
  field: FieldMetadata;
  label: string;
  /** Categories that can't be picked (e.g. itself and its descendants). */
  excludeIds?: string[];
};

export function FieldProductCategory({
  field,
  label,
  excludeIds,
}: FieldProductCategoryProps) {
  const supabase = useSupabase();
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );

  useEffect(() => {
    let isLoaded = false;

    getProductCategories(supabase, { from: 1, to: 1000 })
      .then(({ productCategories }) => {
        if (isLoaded) return;
        setOptions(
          productCategories.map(({ id, name }) => ({ label: name, value: id })),
        );
      })
      .catch((error) => {
        if (!isLoaded) console.error(error);
      });

    return () => {
      isLoaded = true;
    };
  }, [supabase]);

  const items = useMemo(() => {
    if (!excludeIds?.length) return options;

    const excluded = new Set(excludeIds);
    return options.filter((item) => !excluded.has(item.value));
  }, [options, excludeIds]);

  return (
    <FieldCombobox
      field={field}
      label={label}
      items={items}
      placeholder="Pilih Kategori Induk"
    />
  );
}
