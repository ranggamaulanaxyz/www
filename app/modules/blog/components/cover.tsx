import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper, { type Area } from "react-easy-crop";
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
import { cropImage } from "./image/cropper";

interface CoverProps {
  postId?: string;
  initialValue?: string;
  onUploadSuccess?: (url: string) => void;
}

export default function Cover({ postId, initialValue, onUploadSuccess }: CoverProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [originalImage, setOriginalImage] = useState<
    (File & { preview: string }) | null
  >(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<
    (File & { preview: string }) | null
  >(null);
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    },
    onDrop: (acceptedFiles) => {
      const acceptedFile = acceptedFiles?.[0];
      if (acceptedFile) {
        setOriginalImage(
          Object.assign(acceptedFile, {
            preview: URL.createObjectURL(acceptedFile),
          }),
        );
        setCroppedImage(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCroppedAreaPixels(null);
        setActiveTab("edit");
      }
    },
  });

  useEffect(() => {
    return () => {
      if (originalImage) {
        URL.revokeObjectURL(originalImage.preview);
      }
    };
  }, [originalImage]);

  const onCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleSave = async () => {
    let finalFileToUpload: File | null = null;

    if (originalImage && croppedAreaPixels) {
      const image = await cropImage(
        originalImage.preview,
        croppedAreaPixels,
        rotation,
      );
      if (image) {
        finalFileToUpload = image;
        setCroppedImage((prev) => {
          if (prev && prev.preview !== originalImage.preview) {
            URL.revokeObjectURL(prev.preview);
          }
          return image;
        });
      }
    } else if (originalImage) {
      finalFileToUpload = originalImage;
      setCroppedImage(originalImage);
    }

    if (!finalFileToUpload) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", finalFileToUpload);
      if (postId) {
        formData.append("postId", postId);
      }

      const res = await fetch("/drive/upload", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const contentType = res.headers.get("content-type") || "";
      let data: any = {};

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {
          console.log("Raw response text:", text);
        }
      }

      const actionResult = data.actionData || data;

      if (res.ok && actionResult.success) {
        setUploadedKey(actionResult.key);
        if (actionResult.url && onUploadSuccess) {
          onUploadSuccess(actionResult.url);
        }
        setOpen(false);
      } else {
        console.error("Server upload error data:", actionResult);
        alert(actionResult.error || `Upload failed with status ${res.status}`);
      }
    } catch (err) {
      console.error("Upload error details:", err);
      alert(err instanceof Error ? err.message : "An error occurred while uploading.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const previewSrc = croppedImage?.preview || initialValue;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen && originalImage) {
          setActiveTab("edit");
        }
      }}
    >
      <DialogTrigger asChild>
        <AspectRatio
          ratio={16 / 9}
          className="flex cursor-pointer items-center justify-center overflow-hidden rounded bg-gray-200"
        >
          {previewSrc ? (
            <img
              src={previewSrc}
              alt="Cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <p className="text-sm text-gray-500">Click here to add a cover.</p>
          )}
        </AspectRatio>
      </DialogTrigger>
      <DialogContent className="top-24 -translate-y-0 sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Select an Image</DialogTitle>
          <DialogDescription>
            Choose an image to use as the post cover.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList variant="line">
            <TabsTrigger value="upload">UPLOAD</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="drive">DRIVES</TabsTrigger>
            <TabsTrigger value="edit" disabled={!originalImage}>
              EDITOR
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
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
          </TabsContent>
          <TabsContent value="edit">
            {originalImage ? (
              <AspectRatio ratio={16 / 9} className="relative overflow-hidden">
                <Cropper
                  image={originalImage.preview}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={16 / 9}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onRotationChange={setRotation}
                  onZoomChange={setZoom}
                />
              </AspectRatio>
            ) : (
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
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={handleSave} disabled={!originalImage || isUploading}>
            {isUploading ? "Uploading..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
