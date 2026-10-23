import { FaceSlightlyFrowningIcon } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import type { ReactNode } from "react";

export default function UnexpectedErrorContent(props: {
  children?: ReactNode;
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FaceSlightlyFrowningIcon />
        </EmptyMedia>
        <EmptyTitle>Terjadi Kesalahan</EmptyTitle>
        <EmptyDescription>Maaf, permintaan Anda tidak dapat diproses karena terjadi kesalahan pada sistem. Silakan coba kembali beberapa saat lagi.</EmptyDescription>
      </EmptyHeader>
      {props?.children && <EmptyContent>{props.children}</EmptyContent>}
    </Empty>
  );
}
