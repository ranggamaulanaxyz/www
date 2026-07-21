import type { Area } from "react-easy-crop";

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

  return new Promise<(File & { preview: string }) | null>((resolve) => {
    croppedCanvas.toBlob((blob) => {
      if (!blob) {
        resolve(null);
        return;
      }
      const file = new File([blob], "cropped-image.jpg", {
        type: "image/jpeg",
      });
      const preview = URL.createObjectURL(file);
      resolve(Object.assign(file, { preview }));
    }, "image/jpeg");
  });
}
