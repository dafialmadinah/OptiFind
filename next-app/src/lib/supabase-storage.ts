import { supabase } from "./supabase";

/**
 * Upload a photo to Supabase Storage 'foto_barang' bucket
 * @param file - File object to upload
 * @returns Public URL of the uploaded file
 * @throws Error if upload fails
 */
export async function uploadBarangPhoto(file: File): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized");
  }

  // Generate unique filename: timestamp + sanitized original name
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${timestamp}_${sanitizedFileName}`;

  // Upload to 'foto_barang' bucket
  const { data, error } = await supabase.storage
    .from("foto_barang")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Supabase Storage upload error:", error);
    throw new Error(`Failed to upload photo: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("foto_barang").getPublicUrl(data.path);

  return publicUrl;
}
