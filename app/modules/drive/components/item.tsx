import { EditIcon, HardDriveIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import type { DriveSchema } from "../schemas";

interface DriveGridViewProps {
  items: DriveSchema[];
}

export default function DriveGridView({ items }: DriveGridViewProps) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
      {items.map((item) => (
        <Item variant="outline" key={item.id} asChild>
          <Link to={`/desk/drive/${item.id}/items`}>
            <ItemMedia>
              <HardDriveIcon className="size-10" />
            </ItemMedia>
            <ItemContent className="min-w-0">
              <ItemTitle className="block w-full truncate">
                {item.name}
              </ItemTitle>
              <ItemDescription className="block w-full truncate">
                {item.description}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                size="icon-sm"
                variant="outline"
                className="rounded-full"
                aria-label="Edit"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/desk/drive/${item.id}`);
                }}
              >
                <EditIcon />
              </Button>
            </ItemActions>
          </Link>
        </Item>
      ))}
    </div>
  );
}
