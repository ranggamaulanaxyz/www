import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-dvh animate-pulse items-center justify-center">
      <Loader className="animate-spin" size={24} />
    </div>
  );
}
