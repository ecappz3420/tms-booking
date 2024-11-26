import { getRecords, refreshAccessToken } from "../../util/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams} = new URL(request.url);
    const reportName = searchParams.get('reportName');
    const criteria = searchParams.get('criteria');
    try {
        const acccess_token = await refreshAccessToken();
        const records = await getRecords(acccess_token ,reportName, criteria);
        return NextResponse.json({records});
    } catch (error) {
        console.log(error);
        return NextResponse.error();
    }
}
