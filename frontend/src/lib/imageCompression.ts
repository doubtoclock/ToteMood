const MAX_UPLOAD_FILE_BYTES = 25 * 1024 * 1024;
const MAX_COMPRESSED_IMAGE_BYTES = 180 * 1024;
const COMPRESSED_IMAGE_MAX_DIMENSION = 900;

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      URL.revokeObjectURL(imageUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Could not read this image. Please try a different JPG or PNG."));
    };
    image.src = imageUrl;
  });

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not prepare this image. Please try again."));
    reader.readAsDataURL(blob);
  });

const canvasToBlob = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not compress this image. Please try a different image."));
        return;
      }
      resolve(blob);
    }, "image/jpeg", quality);
  });

export async function compressImageForUpload(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload a JPG or PNG image.");
  }
  if (file.size > MAX_UPLOAD_FILE_BYTES) {
    throw new Error("Please upload an image under 25MB.");
  }

  const image = await loadImage(file);
  const canvas = document.createElement("canvas");

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Your browser could not prepare this image. Please try again.");
  }

  const qualities = [0.78, 0.68, 0.58, 0.48, 0.38, 0.28];
  let maxDimension = COMPRESSED_IMAGE_MAX_DIMENSION;
  let bestBlob: Blob | null = null;

  while (maxDimension >= 360) {
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    canvas.width = width;
    canvas.height = height;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    for (const quality of qualities) {
      bestBlob = await canvasToBlob(canvas, quality);
      if (bestBlob.size <= MAX_COMPRESSED_IMAGE_BYTES) {
        return blobToDataUrl(bestBlob);
      }
    }

    maxDimension = Math.floor(maxDimension * 0.75);
  }

  if (!bestBlob) {
    throw new Error("This image could not be prepared. Please try a different image.");
  }

  return blobToDataUrl(bestBlob);
}
