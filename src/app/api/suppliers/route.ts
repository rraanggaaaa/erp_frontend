import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://erp-backend-5ax6.vercel.app/api/v1";

// GET - Get all suppliers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = new URL(`${BACKEND_URL}/suppliers`);

    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    console.log("🔄 [GET] Proxying to:", url.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();
    console.log("📥 [GET] Response:", data);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("❌ [GET] Proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch suppliers",
        error: String(error),
      },
      { status: 500 },
    );
  }
}

// POST - Create new supplier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("🔄 [POST] Proxying to:", `${BACKEND_URL}/suppliers`);
    console.log("📤 [POST] Data:", body);

    const response = await fetch(`${BACKEND_URL}/suppliers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("📥 [POST] Response:", data);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("❌ [POST] Proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create supplier" },
      { status: 500 },
    );
  }
}
