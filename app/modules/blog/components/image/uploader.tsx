import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { AspectRatio } from "~/components/ui/aspect-ratio";

interface ImageUploader {
  onSelect: (file: File) => void;
}

export default function ImageUploader({ onSelect }: ImageUploader) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] },
    onDrop: (acceptedFiles) => {
      const acceptedFile = acceptedFiles.at(0);
      if (!acceptedFile) {
        toast.error("No file selected");
        return;
      }
      onSelect(acceptedFile);
    },
  });
  return (
    <AspectRatio
      ratio={16 / 9}
      className="relative flex items-center justify-center rounded bg-gray-200"
      {...getRootProps()}
    >
      <p className="text-gray-500">
        Drag & Drop your image here, or click to select.
      </p>
      <input {...getInputProps()} />
    </AspectRatio>
  );
}
