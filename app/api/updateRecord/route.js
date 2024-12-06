import { NextResponse } from "next/server";
import { refreshAccessToken, updateRecord } from "../../util/auth";

export async function PATCH(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            throw new Error("ID is required for updating the record");
        }
        const refreshToken = await refreshAccessToken();
        const formData = await req.json();
        const response = await updateRecord(refreshToken, formData, id);
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error updating record:", error);
        return NextResponse.json("Error updating record");
    }
}