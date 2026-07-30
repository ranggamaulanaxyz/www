import { NewspaperIcon } from "lucide-react";
import { Link, useSearchParams } from "react-router";

import { Button, buttonVariants } from "~/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";

export function BlogEmptyView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query");
  const hasQuery = Boolean(query);

  const handleClearQuery = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("query");
    setSearchParams(nextParams);
  };

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <NewspaperIcon />
        </EmptyMedia>
        <EmptyTitle>{hasQuery ? "No Post Found" : "No Post Yet"}</EmptyTitle>
        <EmptyDescription>
          {hasQuery
            ? `No post found matching your query "${query}".`
            : "You haven&apos;t created any post yet. Get started by creating your first post."}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        {hasQuery ? (
          <Button variant="outline" onClick={handleClearQuery}>
            Clear Search
          </Button>
        ) : (
          <Link
            className={buttonVariants({ variant: "default" })}
            to="/desk/blog/new"
          >
            Create New Post
          </Link>
        )}
      </EmptyContent>
    </Empty>
  );
}
