import { FolderIcon, HardDriveIcon } from "lucide-react";
import { Link } from "react-router";

import { Button, buttonVariants } from "~/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";

export function DriveEmptyVIew() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HardDriveIcon />
        </EmptyMedia>
        <EmptyTitle>No Drives Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any drives yet. Get started by creating your
          first drive.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Link
          className={buttonVariants({ variant: "default" })}
          to="/desk/drive/new"
        >
          Create Drive
        </Link>
      </EmptyContent>
    </Empty>
  );
}
