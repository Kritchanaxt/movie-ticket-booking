import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // ตรงนี้นำ Web App URL ของ Google Apps Script ที่ได้จากการ Publish มาใส่
    // ตัวอย่างเช่น: const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfyc.../exec";
    const GOOGLE_SHEETS_WEB_APP_URL = process.env.GOOGLE_SHEETS_WEB_APP_URL || "";

    if (!GOOGLE_SHEETS_WEB_APP_URL) {
      // Mockup success response ถ้ายังไม่ได้ใส่ URL
      console.log("Mock saving to Google Sheets:", body);
      return NextResponse.json({ success: true, message: "Mock saved" }, { status: 200 });
    }

    const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      // ส่งข้อมูลไปยัง Google Apps script
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      throw new Error("Failed to save to Google Sheets");
    }

  } catch (error) {
    console.error("Error saving to sheets:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}