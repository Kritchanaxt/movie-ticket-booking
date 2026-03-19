import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const bookingData = await request.json();
    
    // ดึง Web App URL จาก Environment Variables (.env) แทนเพื่อความปลอดภัย
    const GOOGLE_SHEETS_WEB_APP_URL = process.env.GOOGLE_SHEETS_WEB_APP_URL;

    if (!GOOGLE_SHEETS_WEB_APP_URL) {
      throw new Error("Missing GOOGLE_SHEETS_WEB_APP_URL in environment variables");
    }

    // จัดโครงสร้างให้ตรงกับที่ Apps Script รอรับ (ลบราคาออกแล้ว)
    const payload = {
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,
      // บังคับให้เบอร์เป็น string โดยเติมนำหน้าด้วยเครื่องหมาย ' (single quote) เพื่อให้ Google Sheets มองเป็น text เสมอ
      customerPhone: `'${bookingData.customerPhone}`,
      movieTitle: bookingData.movieTitle,
      date: bookingData.date,
      time: bookingData.time,
      seats: bookingData.seats
    };

    const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      throw new Error(`Failed to save to Google Sheets: ${response.status}`);
    }

  } catch (error) {
    console.error("Error saving to sheets:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}