"use client";

import { ChevronLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DetailPage() {
  const router = useRouter();
  const { booking } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (booking.seats.length === 0 || !booking.customerName) {
      router.push("/");
    }
  }, [booking, router]);

  const handleConfirm = async () => {
    try {
      if (!booking.customerName || !booking.customerEmail || !booking.customerPhone) {
        toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }

      setIsProcessing(true);
      toast.info("กำลังประมวลผลการจอง...");
      
      const response = await fetch('/api/save-to-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });

      if (!response.ok) throw new Error("API Error");

      toast.success("การจองที่นั่งของคุณเสร็จสมบูรณ์");
      router.push("/success");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center justify-between mb-8 pt-2">
        <div className="flex items-center text-zinc-900 dark:text-white">
          <button onClick={() => router.push("/form")} className="p-2 -ml-2 text-zinc-400 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold ml-2">สรุปการจอง</h2>
        </div>
        <ThemeToggle />
      </div>

      <div className="space-y-8 px-2">
        <div className="bg-white dark:bg-zinc-900/30 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none">
          <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-4 uppercase tracking-wider">ข้อมูลส่วนตัว</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-500 text-sm">ชื่อผู้จอง:</span>
              <span className="text-zinc-900 dark:text-white font-medium">{booking.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-500 text-sm">เบอร์โทร:</span>
              <span className="text-zinc-900 dark:text-white font-medium">{booking.customerPhone}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-5">รอบการแสดง</h3>
          <div className="space-y-5 text-sm">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-1">ชื่อละคร</p>
              <p className="font-bold text-lg text-zinc-900 dark:text-white underline decoration-emerald-500/30 underline-offset-4 decoration-2">{booking.movieTitle}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-1">สถานที่</p>
              <p className="font-bold text-sm text-zinc-900 dark:text-white flex items-center">
                <MapPin className="w-4 h-4 mr-1.5 text-emerald-600 dark:text-emerald-400" /> มหาวิทยาลัยบูรพา ตึก MUPAC
              </p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-1">วันที่</p>
                <p className="font-bold text-zinc-900 dark:text-white">{booking.date}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-1">เวลา</p>
                <p className="font-bold text-zinc-900 dark:text-white">{booking.time} น.</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-zinc-200 dark:bg-zinc-800" />

        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-5">รายละเอียดที่นั่ง</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
               <span className="text-zinc-500 dark:text-zinc-500">ที่นั่ง ({booking.seats.length} ที่นั่ง)</span>
               <span className="font-bold text-zinc-900 dark:text-white">{booking.seats.join(", ")}</span>
            </div>
          </div>
        </div>

        <div className="pt-6 pb-20">
          <Button 
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-zinc-900 font-extrabold h-16 rounded-2xl text-lg shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.7)] transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isProcessing ? "กำลังดำเนินการ..." : "ยืนยันการจอง"}
          </Button>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-500 text-center mt-4">โดยการคลิกปุ่ม ยืนยันการจอง คุณยอมรับเงื่อนไขการให้บริการของ Cinema TH</p>
        </div>
      </div>
    </div>
  );
}