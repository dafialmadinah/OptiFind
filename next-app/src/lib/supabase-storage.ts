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
  // Basic validation
  if (!file || typeof file.name !== "string") {
    throw new Error("Invalid file supplied");
  }

  // Prevent extremely large uploads (optional safety check)
  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  if (file.size > MAX_SIZE) {
    throw new Error("File terlalu besar. Maks 10MB.");
  }

  // Generate unique filename: timestamp + sanitized original name
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${timestamp}_${sanitizedFileName}`;

  try {
    // Upload to 'foto_barang' bucket
    const { data, error } = await supabase.storage
      .from("foto_barang")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });

    if (error) {
      console.error("Supabase Storage upload error:", error);
      // log extra context for debugging
      console.error("Upload payload:", {
        bucket: "foto_barang",
        path: fileName,
        size: file.size,
        type: file.type,
      });
      throw new Error(`Failed to upload photo: ${error.message}`);
    }

    if (!data || !data.path) {
      console.error("Upload succeeded but no path returned", data);
      throw new Error("Upload selesai tapi path tidak tersedia dari Supabase");
    }

    // Get public URL (getPublicUrl is synchronous)
    const urlRes = supabase.storage.from("foto_barang").getPublicUrl(data.path);
    const publicUrl = urlRes?.data?.publicUrl ?? null;

    if (!publicUrl) {
      console.error("Public URL not returned", urlRes);
      throw new Error("Public URL tidak tersedia");
    }

    return publicUrl;
  } catch (err) {
    // Re-throw with message
    console.error("uploadBarangPhoto failure:", err);
    if (err instanceof Error) throw err;
    throw new Error("Gagal mengunggah foto");
  }
}
