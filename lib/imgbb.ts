const IMGBB_ENDPOINT = "https://api.imgbb.com/1/upload";

interface ImgbbResponse {
  success: boolean;
  data?: {
    url: string;
    display_url: string;
    thumb?: { url: string };
  };
  error?: {
    message: string;
  };
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function uploadIsConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_IMGBB_KEY);
}

/**
 * Uploads a cover to imgbb and returns the hosted image URL.
 * A missing key is surfaced as a friendly error so the form can fall
 * back to pasting an image URL instead.
 */
export async function uploadImage(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;

  if (!key) {
    throw new Error(
      "Cover uploads are not configured. Add NEXT_PUBLIC_IMGBB_KEY to the environment, or paste an image URL instead.",
    );
  }

  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error("Choose a JPG, PNG, WebP, or GIF image.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("That image is larger than 5 MB. Choose a smaller file.");
  }

  const body = new FormData();
  body.append("image", file);

  let response: Response;
  try {
    response = await fetch(`${IMGBB_ENDPOINT}?key=${encodeURIComponent(key)}`, {
      method: "POST",
      body,
    });
  } catch {
    throw new Error("Could not reach the image service. Check your connection and try again.");
  }

  const payload = (await response.json().catch(() => null)) as ImgbbResponse | null;

  if (!response.ok || !payload?.success || !payload.data) {
    throw new Error(
      payload?.error?.message ??
        "The image could not be uploaded. Try a different file.",
    );
  }

  return payload.data.display_url || payload.data.url;
}
