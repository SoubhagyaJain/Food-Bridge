import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";

export const DONATION_PHOTOS_BUCKET = "donation-photos";
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateDonationPhoto(file: File): string | null {
  if (!file.size) return null;
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return "Photo must be JPEG, PNG, or WebP.";
  }
  if (file.size > MAX_PHOTO_SIZE) {
    return "Photo must be 5 MB or smaller.";
  }
  return null;
}

async function uploadPhoto(supabase: Awaited<ReturnType<typeof createServerClient>>, file: File, donorId: string) {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${donorId}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { data, error } = await supabase.storage.from(DONATION_PHOTOS_BUCKET).upload(path, buffer, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(DONATION_PHOTOS_BUCKET).getPublicUrl(data.path);

  return publicUrl;
}

export async function uploadDonationPhotoServer(file: File, donorId: string) {
  const validationError = validateDonationPhoto(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const supabase = await createServerClient();
  return uploadPhoto(supabase, file, donorId);
}

export async function uploadDonationPhoto(file: File, donorId: string) {
  const validationError = validateDonationPhoto(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const supabase = createBrowserClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${donorId}/${crypto.randomUUID()}.${ext}`;

  const { data, error } = await supabase.storage.from(DONATION_PHOTOS_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(DONATION_PHOTOS_BUCKET).getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteDonationPhoto(path: string) {
  const supabase = createBrowserClient();
  const { error } = await supabase.storage.from(DONATION_PHOTOS_BUCKET).remove([path]);
  if (error) throw error;
}