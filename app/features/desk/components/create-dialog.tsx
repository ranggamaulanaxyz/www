import { getFormProps, type FormMetadata } from "@conform-to/react";
import { PlusIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export function DeskCreateDialog({
  title,
  form,
  children,
}: {
  title?: string;
  form: FormMetadata;
  children: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            <PlusIcon />
            Tambah
          </Button>
        }
      />
      <DialogContent
        render={
          <Form {...getFormProps(form)}>
            <DialogHeader>
              <DialogTitle>{title || "Tambah"}</DialogTitle>
            </DialogHeader>
            {children}
            <DialogFooter>
              <DialogClose
                render={<Button variant="outline">Batalkan</Button>}
              />
              <Button type="submit">Tambah</Button>
            </DialogFooter>
          </Form>
        }
      />
    </Dialog>
  );
}
