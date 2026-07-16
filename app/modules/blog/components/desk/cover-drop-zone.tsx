import { Card, CardContent } from "~/components/ui/card";
import { useDropzone } from "react-dropzone";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { useEffect, useState } from "react";
import { Trash2Icon } from "lucide-react";

interface PreviewFile extends File {
  preview: string;
}

export default function CoverUploader() {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpeg": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
    },
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <Card>
      <CardContent>
        <AspectRatio
          ratio={16 / 9}
          {...getRootProps({
            className:
              "bg-muted rounded flex items-center justify-center text-center overflow-hidden relative cursor-pointer hover:bg-muted/80 transition-colors group",
          })}
        >
          <input {...getInputProps()} />
          {files.length > 0 ? (
            <div className="absolute inset-0 h-full w-full">
              <img
                src={files[0].preview}
                alt={files[0].name}
                className="h-full w-full object-cover"
                onLoad={() => URL.revokeObjectURL(files[0].preview)}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFiles([]);
                  }}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground p-3 rounded-full shadow-lg transition-transform scale-90 group-hover:scale-100 duration-200"
                >
                  <Trash2Icon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground max-w-50">
              Drag &amp; drop the image here, or click to select the image
            </p>
          )}
        </AspectRatio>
      </CardContent>
    </Card>
  );
}
