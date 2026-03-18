"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext";
import { useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const SHOW_TIMES = [
  { date: "20 มีนาคม 2026", time: "16:00" },
  { date: "21 มีนาคม 2026", time: "16:00" },
  { date: "22 มีนาคม 2026", time: "15:00" },
];

export default function FormPage() {
  const router = useRouter();
  const { booking, updateBooking } = useBooking();

  // Redirect if no seats selected
  useEffect(() => {
    if (booking.seats.length === 0) {
      router.push("/select");
    }
  }, [booking.seats, router]);

  const handleTimeSelect = (value: string) => {
    const [d, t] = value.split(" | ");
    updateBooking({ date: d, time: t });
  };

  const isFormValid = booking.customerName && booking.customerEmail && booking.customerPhone && booking.date;

  return (
    <div className="w-full max-w-md mx-auto p-6 animate-in slide-in-from-right-8 duration-300 min-h-[100dvh] flex flex-col">
      <div className="flex items-center justify-between mb-8 pt-4">
        <div className="flex items-center text-zinc-900 dark:text-white">
          <button onClick={() => router.push("/select")} className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold ml-2">ข้อมูลผู้จอง</h2>
        </div>
        <ThemeToggle />
      </div>

      <div className="space-y-6 flex-1 text-zinc-900 dark:text-white">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400 ml-1">ชื่อ-นามสกุล</label>
          <Input 
            placeholder="กรอกชื่อ-นามสกุล" 
            value={booking.customerName}
            onChange={(e) => updateBooking({ customerName: e.target.value })}
            className="bg-white dark:bg-zinc-900/50 border-zinc-300 shadow-sm dark:border-zinc-800 h-12 focus:ring-[#10b981]/50 focus:border-[#10b981] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400 ml-1">อีเมล</label>
          <Input 
            type="email"
            placeholder="example@email.com" 
            value={booking.customerEmail}
            onChange={(e) => updateBooking({ customerEmail: e.target.value })}
            className="bg-white dark:bg-zinc-900/50 border-zinc-300 shadow-sm dark:border-zinc-800 h-12 focus:ring-[#10b981]/50 focus:border-[#10b981] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400 ml-1">เบอร์โทรศัพท์</label>
          <Input 
            type="tel"
            placeholder="08X-XXX-XXXX" 
            value={booking.customerPhone}
            onChange={(e) => updateBooking({ customerPhone: e.target.value })}
            className="bg-white dark:bg-zinc-900/50 border-zinc-300 shadow-sm dark:border-zinc-800 h-12 focus:ring-[#10b981]/50 focus:border-[#10b981] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400 ml-1">เลือกรอบวันที่และเวลา</label>
          <Select onValueChange={handleTimeSelect} value={booking.date ? `${booking.date} | ${booking.time}` : undefined}>
            <SelectTrigger className="bg-white dark:bg-zinc-900/50 border-zinc-300 shadow-sm dark:border-zinc-800 h-12 focus:ring-[#10b981]/50 text-zinc-900 dark:text-white">
              <SelectValue placeholder="เลือกวันและเวลา" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white">
              {SHOW_TIMES.map((item, idx) => (
                <SelectItem key={idx} value={`${item.date} | ${item.time}`} className="focus:bg-emerald-500/20 focus:text-zinc-900 dark:focus:text-white cursor-pointer py-3">
                  วันที่ {item.date} เวลา {item.time} น.
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-10 pb-10">
        <Button 
          disabled={!isFormValid}
          onClick={() => router.push("/detail")}
          className="w-full bg-[#10b981] hover:bg-[#059669] text-zinc-900 font-extrabold h-16 rounded-2xl text-lg shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.7)] transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          ดูรายละเอียดการจอง
        </Button>
      </div>
    </div>
  );
}