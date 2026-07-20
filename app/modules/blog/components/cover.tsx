import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
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

export default function Cover() {
  const [edit, setEdit] = useState(false);
  const [file, setFile] = useState<(File & { preview: string }) | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    },
    onDrop: (acceptedFiles) => {
      const acceptedFile = acceptedFiles?.[0];
      setFile(
        Object.assign(acceptedFile, {
          preview: URL.createObjectURL(acceptedFile),
        }),
      );
    },
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks on unmount
    return () => {
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <AspectRatio
          ratio={16 / 9}
          className="flex items-center justify-center rounded bg-gray-200"
        >
          <p className="text-sm text-gray-500">Click here to add a cover.</p>
        </AspectRatio>
      </DialogTrigger>
      <DialogContent className="top-24 -translate-y-0 sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Select an Image</DialogTitle>
          <DialogDescription>
            Choose an image to use as the cover of your post.
          </DialogDescription>
        </DialogHeader>
        {!edit && (
          <Tabs>
            <TabsList variant="line">
              <TabsTrigger value="upload">UPLOAD</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="drive">DRiVES</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <AspectRatio
                ratio={16 / 9}
                className="relative flex items-center justify-center rounded bg-gray-200"
                {...getRootProps()}
              >
                {file && (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="max-h-full max-w-full object-cover"
                  />
                )}
                {!file && (
                  <p className="text-gray-500">
                    Drag & Drop your image here, or click to select.
                  </p>
                )}
                <input {...getInputProps()} />
              </AspectRatio>
            </TabsContent>
          </Tabs>
        )}
        {edit && file && (
          <AspectRatio ratio={16 / 9} className="relative">
            <Cropper
              image={file.preview}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onZoomChange={setZoom}
            />
          </AspectRatio>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setEdit(true)}>
            Edit this Image
          </Button>
          <Button>Use this Image</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
