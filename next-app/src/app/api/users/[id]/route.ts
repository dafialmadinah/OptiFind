import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type Params = {
    params: { id: string };
};

export async function GET(request: NextRequest, { params }: Params) {
    const userId = params.id;

    if (!userId) {
        return NextResponse.json(
            { message: "User ID is required" },
            { status: 400 }
        );
    }

    if (!supabase) {
        return NextResponse.json(
            { message: "Supabase not configured" },
            { status: 500 }
        );
    }

    try {
        const { data: user, error } = await supabase
            .from("users")
            .select("id, name, username, email, no_telepon")
            .eq("id", userId)
            .maybeSingle();

        if (error) {
            console.error("Error fetching user:", error);
            return NextResponse.json(
                { message: "Failed to fetch user" },
                { status: 500 }
            );
        }

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            noTelepon: user.no_telepon,
        });
    } catch (error) {
        console.error("Exception fetching user:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
