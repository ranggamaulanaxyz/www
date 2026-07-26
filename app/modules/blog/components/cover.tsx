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
import ImageEditor, { cropImage } from "./image/editor";
import ImageUploader from "./image/uploader";
import { toast } from "sonner";

interface CoverProps {
  initialSrc?: string | null;
  onChange?: (src: string) => void;
}

export default function Cover({ initialSrc, onChange }: CoverProps) {
  // Cover
  const [src, setSrc] = useState(initialSrc);
  const [previewSrc, setPreviewSrc] = useState(initialSrc);
  const [tmpSrc, setTmpSrc] = useState(initialSrc);
  useEffect(() => {
    setSrc(initialSrc);
    setPreviewSrc(initialSrc);
  }, [initialSrc]);

  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialogChange = (isOpen: boolean) => {
    setOpenDialog(isOpen);
  };

  // Tabs
  const [activeTab, setActiveTab] = useState("upload");
  const handleTabValueChange = (value: string) => {
    setActiveTab(value);
  };

  // Image
  const handleImageSelect = (file: File) => {
    if (tmpSrc) {
      URL.revokeObjectURL(tmpSrc);
    }
    setTmpSrc(URL.createObjectURL(file));
  };

  useEffect(() => {
    setActiveTab("editor");
  }, [tmpSrc]);

  // Image Editor
  const [saving, setSaving] = useState(false);
  const [croppedData, setCroppedData] = useState<{
    area: Area | null;
    areaPixels: Area | null;
    rotation: number;
  }>();

  const handleApply = async () => {
    if (!tmpSrc || !croppedData?.areaPixels) {
      return;
    }
    const image = await cropImage(
      tmpSrc,
      croppedData.areaPixels,
      croppedData.rotation,
    );

    if (!image) {
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", image);

      const res = await fetch("/api/drive/upload", {
        method: "POST",
        body: formData,
      });

      const data: { success?: boolean; public_url?: string } = await res.json();

      if (data?.success && data.public_url) {
        const publicUrl = data.public_url;
        setSrc(publicUrl);
        setPreviewSrc(publicUrl);
        setOpenDialog(false);
        onChange?.(publicUrl);
      }
    } catch (error) {
      console.error("Failed to upload cover image:", error);
      toast.error("Failed to upload cover image");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={openDialog}
      onOpenChange={handleOpenDialogChange}
      modal={true}
    >
      <DialogTrigger asChild>
        <AspectRatio
          id="cover"
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
      <DialogContent className="top-24 translate-y-0 sm:max-w-6xl">
        <Tabs value={activeTab} onValueChange={handleTabValueChange}>
          <TabsList variant="line">
            <TabsTrigger value="upload">UPLOAD</TabsTrigger>
            <TabsTrigger value="editor" disabled={!tmpSrc}>
              EDITOR
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <ImageUploader onSelect={handleImageSelect} />
          </TabsContent>
          <TabsContent value="editor">
            {tmpSrc && <ImageEditor src={tmpSrc} onComplete={setCroppedData} />}
          </TabsContent>
        </Tabs>
        <DialogFooter>
          {src && <Button variant="destructive">Remove</Button>}
          <Button onClick={handleApply} disabled={saving}>
            {saving ? "Saving..." : "Apply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
