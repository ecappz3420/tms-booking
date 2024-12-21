
import { NextResponse } from "next/server";
import { fetchCurrencyRates } from "../../util/auth";
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const baseCurrency = url.searchParams.get("baseCurrency");
    const response = await fetchCurrencyRates(baseCurrency);
    return NextResponse.json({ conversion_rates :response });
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
