import { NextResponse } from "next/server";
import { addBooking, refreshAccessToken } from "../../util/auth";

export async function POST(req) {
    try {
        const access_token = await refreshAccessToken();
        const formData = await req.json();
        const response = await addBooking(access_token, formData);
        console.log(response);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error creating issue:', error);
        return NextResponse.json('Error creating issue');
    }

}