import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://erp-backend-5ax6.vercel.app/api/v1";

// GET - Get supplier by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;
    const url = `${BACKEND_URL}/suppliers/${id}`;

    console.log("🔄 [GET by ID] Proxying to:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();
    console.log("📥 [GET by ID] Response:", data);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("❌ [GET by ID] Proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch supplier",
        error: String(error),
      },
      { status: 500 },
    );
  }
}

// PUT - Update supplier by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;
    const body = await request.json();
    const url = `${BACKEND_URL}/suppliers/${id}`;

    console.log("🔄 [PUT] Proxying to:", url);
    console.log("📤 [PUT] Data:", body);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("📥 [PUT] Response:", data);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("❌ [PUT] Proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update supplier" },
      { status: 500 },
    );
  }
}

// DELETE - Delete supplier by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;
    const url = `${BACKEND_URL}/suppliers/${id}`;

    console.log("🔄 [DELETE] Proxying to:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await response.json();
    console.log("📥 [DELETE] Response:", data);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("❌ [DELETE] Proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete supplier" },
      { status: 500 },
    );
  }
}
