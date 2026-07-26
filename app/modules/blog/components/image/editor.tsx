import { useCallback, useEffect, useState } from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { AspectRatio } from "~/components/ui/aspect-ratio";

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

function createImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

export async function cropImage(
  src: string,
  area: Area,
  rotation: number = 0,
  flip: {
    horizontal: boolean;
    vertical: boolean;
  } = { horizontal: false, vertical: false },
) {
  const image = await createImage(src);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  const rotationRadian = getRadianAngle(rotation);
  const { width, height } = rotateSize(image.width, image.height, rotation);

  canvas.width = width;
  canvas.height = height;

  ctx.translate(width / 2, height / 2);
  ctx.rotate(rotationRadian);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    throw new Error("Failed to get cropped canvas context");
  }

  croppedCanvas.width = area.width;
  croppedCanvas.height = area.height;

  croppedCtx.drawImage(
    canvas,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    area.width,
    area.height,
  );

  return new Promise<File | null>((resolve) => {
    croppedCanvas.toBlob((blob) => {
      if (!blob) return resolve(null);
      const file = new File([blob], "cover.jpg", { type: "image/jpeg" });
      resolve(file);
    }, "image/jpeg");
  });
}

interface ImageEditorProps {
  src: string;
  onComplete: (data: {
    area: Area | null;
    areaPixels: Area | null;
    rotation: number;
  }) => void;
}

export default function ImageEditor({ src, onComplete }: ImageEditorProps) {
  const [ready, setReady] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setReady(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      onComplete({
        area: croppedArea,
        areaPixels: croppedAreaPixels,
        rotation,
      });
    },
    [onComplete, rotation],
  );

  return (
    <AspectRatio ratio={16 / 9} className="relative overflow-hidden">
      {ready && (
        <Cropper
          image={src}
          aspect={16 / 9}
          crop={crop}
          onCropChange={setCrop}
          zoom={zoom}
          onZoomChange={setZoom}
          rotation={rotation}
          onRotationChange={setRotation}
          onCropComplete={handleCropComplete}
        />
      )}
    </AspectRatio>
  );
}
