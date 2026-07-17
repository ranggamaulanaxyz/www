import { Card, CardContent } from "~/components/ui/card";
import { useDropzone } from "react-dropzone";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { useEffect, useState, useCallback } from "react";
import { Trash2 as Trash2Icon, RotateCw, RotateCcw, X } from "lucide-react";
import Cropper, { type Area } from "react-easy-crop";
import { Button } from "~/components/ui/button";

interface PreviewFile extends File {
  preview: string;
}

interface TempImage {
  file: File;
  url: string;
}

// Canvas helpers for image cropping & rotation
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = (rotation * Math.PI) / 180;
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = (rotation * Math.PI) / 180;

  // Calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // Set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Translate canvas context to a point where the image center is at (0,0)
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Draw rotated image
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    return null;
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // As a blob
  return new Promise((resolve) => {
    croppedCanvas.toBlob((file) => {
      resolve(file);
    }, "image/jpeg");
  });
}

export default function CoverUploader() {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  
  // Cropper states
  const [isCropping, setIsCropping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tempImage, setTempImage] = useState<TempImage | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpeg": [],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(file);
        setTempImage({ file, url });
        setIsCropping(true);
        // Reset cropper controls
        setZoom(1);
        setRotation(0);
        setCrop({ x: 0, y: 0 });
        setCroppedAreaPixels(null);
      }
    },
  });

  const handleCancel = useCallback(() => {
    if (tempImage) {
      URL.revokeObjectURL(tempImage.url);
    }
    setTempImage(null);
    setIsCropping(false);
  }, [tempImage]);

  const handleSave = useCallback(async () => {
    if (!tempImage || !croppedAreaPixels) return;

    try {
      setIsSaving(true);
      const croppedBlob = await getCroppedImg(
        tempImage.url,
        croppedAreaPixels,
        rotation
      );

      if (croppedBlob) {
        const croppedFile = new File([croppedBlob], tempImage.file.name, {
          type: "image/jpeg",
        });
        const previewUrl = URL.createObjectURL(croppedBlob);
        const finalFile = Object.assign(croppedFile, { preview: previewUrl });

        // Revoke old previews
        files.forEach((file) => URL.revokeObjectURL(file.preview));
        setFiles([finalFile]);
      }
    } catch (e) {
      console.error("Failed to crop image:", e);
    } finally {
      setIsSaving(false);
      handleCancel();
    }
  }, [tempImage, croppedAreaPixels, rotation, files, handleCancel]);

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks on unmount
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
      if (tempImage) {
        URL.revokeObjectURL(tempImage.url);
      }
    };
  }, [files, tempImage]);

  // Keyboard controls listener
  useEffect(() => {
    if (!isCropping) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setZoom((z) => Math.min(z + 0.1, 3));
      } else if (e.key === "-") {
        e.preventDefault();
        setZoom((z) => Math.max(z - 0.1, 1));
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        setRotation((r) => (r + 90) % 360);
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCropping, handleCancel]);

  return (
    <>
      <AspectRatio
        ratio={16 / 9}
        {...getRootProps({
          className:
            "bg-muted border rounded flex items-center justify-center text-center overflow-hidden relative cursor-pointer hover:bg-muted/80 transition-colors group",
        })}
      >
        <input {...getInputProps()} />
        {files.length > 0 ? (
          <div className="absolute inset-0 h-full w-full">
            <img
              src={files[0].preview}
              alt={files[0].name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  // Revoke preview object URL when file is removed
                  files.forEach((file) => URL.revokeObjectURL(file.preview));
                  setFiles([]);
                }}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground scale-90 rounded-full p-3 shadow-lg transition-transform duration-200 group-hover:scale-100"
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

      {/* Cropper Modal Overlay */}
      {isCropping && tempImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-background border rounded-lg shadow-xl max-w-2xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-lg">Crop Cover Image</h3>
              <button
                type="button"
                onClick={handleCancel}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cropper Container */}
            <div className="relative w-full aspect-video bg-neutral-950 min-h-[300px] md:min-h-[400px]">
              <Cropper
                image={tempImage.url}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
              />
            </div>

            {/* Controls / Info */}
            <div className="p-6 bg-muted/20 border-t flex flex-col gap-4">
              {/* Info & Gestures */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-semibold bg-muted px-1.5 py-0.5 rounded">Drag</span> Move
                  <span className="font-semibold bg-muted px-1.5 py-0.5 rounded ml-2">Scroll / Pinch</span> Zoom
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 border rounded bg-background shadow-xs font-mono">r</kbd> Rotate 90°
                  <kbd className="px-1.5 py-0.5 border rounded bg-background shadow-xs font-mono ml-2">+</kbd> / <kbd className="px-1.5 py-0.5 border rounded bg-background shadow-xs font-mono">-</kbd> Zoom
                </div>
              </div>

              {/* Buttons Control Panel */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                    title="Rotate Counter-Clockwise"
                  >
                    <RotateCcw className="h-4 w-4 mr-1.5" />
                    Rotate CCW
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    title="Rotate Clockwise"
                  >
                    <RotateCw className="h-4 w-4 mr-1.5" />
                    Rotate CW
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Apply Crop"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
