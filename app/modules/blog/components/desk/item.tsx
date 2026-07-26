import { useEffect, useState } from "react";
import { EllipsisVerticalIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import type { PostSchema } from "../../schemas";
import { Link, useFetcher } from "react-router";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface BlogItemViewProps {
  posts: PostSchema[];
}

function BlogItem({ post }: { post: PostSchema }) {
  const fetcher = useFetcher();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (fetcher.state === "idle") {
      setIsDeleting(false);
    }
  }, [fetcher.state]);

  useEffect(() => {
    if (fetcher.data) {
      const { success, message } = fetcher.data;
      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    }
  }, [fetcher.data]);

  const handlePublish = async () => {
    if (!post.id) return;
  };

  const handleDelete = () => {
    if (!post.id) return;
    setIsDeleting(true);
    fetcher.submit(
      {
        id: post.id,
      },
      {
        method: "DELETE",
      },
    );
  };

  return (
    <Item variant="outline">
      <ItemMedia variant="image">
        <img
          src={post.coverImageUrl || "https://avatar.vercel.sh/test.jpg"}
          width={32}
          height={32}
          alt={post.title || "Post thumbnail"}
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{post.title}</ItemTitle>
        <ItemDescription>{post.excerpt}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <EllipsisVerticalIcon />{" "}
              <span className="sr-only">Open Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to={`/desk/blog/${post.id}`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePublish}>
                Publish
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setIsDeleteDialogOpen(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Post</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this post? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete!"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ItemActions>
    </Item>
  );
}

export default function BlogItemView({ posts }: BlogItemViewProps) {
  return (
    <ItemGroup className="gap-2">
      {posts.map((post) => (
        <BlogItem key={post.id} post={post} />
      ))}
    </ItemGroup>
  );
}
