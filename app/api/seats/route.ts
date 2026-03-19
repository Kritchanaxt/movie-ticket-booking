import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 2; // Cache on Server for 2 seconds 

export async function GET() {
  try {
    const GOOGLE_SHEETS_WEB_APP_URL = process.env.GOOGLE_SHEETS_WEB_APP_URL;

    if (!GOOGLE_SHEETS_WEB_APP_URL) {
      return NextResponse.json({ bookedSeats: [] });
    }

    const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
      method: "GET",
      // Google Apps Script มักจะ redirect (302) ไปหน้าถัดไปเพื่อจัดการ JSON
      redirect: "follow",
      next: { revalidate: 2 } // ค่า cache ของ Next.js ที่ดึงข้อมูลจาก Sheet (2 วินาที)
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ 
        bookedSeats: data.bookedSeats || [] 
      }, { status: 200 });
    } else {
      throw new Error(`Failed to fetch from Google Sheets: ${response.status}`);
    }

  } catch (error) {
    console.error("Error fetching seats from sheets:", error);
    return NextResponse.json({ bookedSeats: [] }, { status: 500 });
  }
}
