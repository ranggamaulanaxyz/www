import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function BlogList() {
  return (
    <main>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent className="top-24 -translate-y-0 sm:max-w-7xl">
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Example dialog description</DialogDescription>
          </DialogHeader>
          <Tabs>
            <TabsList variant="line">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="drive">Drives</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <AspectRatio ratio={16 / 9} className="bg-muted rounded" />
            </TabsContent>
          </Tabs>
          <DialogFooter>THis is footer</DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
