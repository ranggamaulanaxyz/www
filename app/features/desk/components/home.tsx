import { ArrowRightIcon, CommandIcon, Link2Icon, LinkIcon } from "lucide-react";
import { Link } from "react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "~/components/ui/avatar";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <header className="flex justify-between">
        <Link to="/desk">
          <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded">
            <CommandIcon className="size-4" />
          </div>
        </Link>
      </header>
      <main className="grid grid-cols-3 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Kontak</CardTitle>
            <CardAction>
              <Link to="/desk/partners" title="Daftar Kontak">
                <ArrowRightIcon />
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <AvatarGroup>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>R</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>R</AvatarFallback>
              </Avatar>
              <AvatarGroupCount>+10k</AvatarGroupCount>
            </AvatarGroup>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
