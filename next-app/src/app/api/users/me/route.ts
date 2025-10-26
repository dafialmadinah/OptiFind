import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUser, getUserData } from "@/lib/supabase-server";

// GET /api/users/me - Get current user profile
export async function GET(request: NextRequest) {
  const user = await getSupabaseUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const userData = await getUserData(user.id);

    if (!userData) {
      return NextResponse.json(
        { message: "User data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: userData });
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

// PATCH /api/users/me - Update current user profile
export async function PATCH(request: NextRequest) {
  const user = await getSupabaseUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();
    const { supabase } = await import("@/lib/supabase");

    if (!supabase) {
      return NextResponse.json(
        { message: "Supabase belum dikonfigurasi di server." },
        { status: 500 }
      );
    }

    // Only allow updating certain fields
    const allowedFields = ['name', 'username', 'no_telepon'];
    const updates: any = {};

    for (const field of allowedFields) {
      if (json[field] !== undefined) {
        updates[field] = json[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 422 }
      );
    }

    // Add updated_at
    updates.updated_at = new Date().toISOString();

    // Update user
    const { data: updated, error: updateError } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select("id, name, username, email, no_telepon, role, created_at, updated_at")
      .single();

    if (updateError || !updated) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { message: "Gagal mengupdate profil." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
