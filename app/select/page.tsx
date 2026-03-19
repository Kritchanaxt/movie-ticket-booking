"use client";

import Image from "next/image";
import { ChevronLeft, User, Armchair, Check, Loader2, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useState } from "react";

const ZONE_A_ROWS = [7];
const ZONE_C_ROWS = [7, 8, 6];
const ZONE_B_ROWS = [7];
const ZONE_D_ROWS = [8, 10, 5];

export default function SelectPage() {
  const router = useRouter();
  const { booking, updateBooking } = useBooking();
  const [unavailableSeats, setUnavailableSeats] = useState<string[]>([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(true);

  // ดึงข้อมูลที่นั่งที่ถูกจองไปแล้วจาก Google Sheets มาอัปเดตแบบ Realtime (ตอนโหลดหน้า)
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        // ดึงข้อมูลจาก API แบบไม่ให้ Browser จำค่า (Bypass Browser Cache)
        // เพื่อให้เว็บถามหา API ทุกครั้งที่เข้ามาหน้านี้
        const res = await fetch(`/api/seats?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          // นำที่นั่งที่จองใน Sheets มาใส่ใน state
          setUnavailableSeats(data.bookedSeats || []);
        }
      } catch (error) {
        console.error("Failed to fetch seats:", error);
      } finally {
        setIsLoadingSeats(false);
      }
    };

    fetchBookedSeats();
  }, []);

  const handleSeatClick = (seatId: string) => {
    if (unavailableSeats.includes(seatId)) return;
    
    const isSelected = booking.seats.includes(seatId);
    let newSeats;
    
    if (isSelected) {
      newSeats = booking.seats.filter((s) => s !== seatId);
    } else {
      newSeats = [...booking.seats, seatId].sort();
    }
    
    updateBooking({ seats: newSeats });
  };

  const renderSeat = (seatId: string) => {
    const isSelected = booking.seats.includes(seatId);
    const isUnavailable = unavailableSeats.includes(seatId);

    return (
      <button
        key={seatId}
        disabled={isUnavailable}
        onClick={() => handleSeatClick(seatId)}
        className={`
          w-[18px] h-[18px] sm:w-[28px] sm:h-[28px] md:w-[32px] md:h-[32px] lg:w-[42px] lg:h-[42px] rounded-[3px] sm:rounded-lg text-[5px] sm:text-[7px] md:text-[8px] lg:text-[10px] font-bold transition-all duration-200 border flex flex-col items-center justify-center shrink-0
          ${isUnavailable
            ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border-zinc-200 dark:bg-zinc-900 dark:text-zinc-600 dark:border-zinc-800"
            : isSelected
            ? "bg-[#10b981] text-white border-[#059669] shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-125 relative z-10"
            : "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
          }
        `}
      >
        <div className="flex flex-col items-center justify-center">
          <Armchair className={`w-[10px] h-[10px] sm:w-[14px] sm:h-[14px] md:w-[16px] md:h-[16px] lg:w-[20px] lg:h-[20px] shrink-0 ${isUnavailable ? "opacity-30" : ""}`} />
          <span className="mt-[0.5px] leading-none tracking-tighter">{seatId}</span>
        </div>
      </button>
    );
  };

  const totalSeats = ZONE_A_ROWS.reduce((a, b) => a + b, 0) + 
                     ZONE_B_ROWS.reduce((a, b) => a + b, 0) + 
                     ZONE_C_ROWS.reduce((a, b) => a + b, 0) + 
                     ZONE_D_ROWS.reduce((a, b) => a + b, 0);
                     
  const bookedSeatsCount = unavailableSeats.length;
  const availableSeatsCount = totalSeats - bookedSeatsCount;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 pt-6 sm:pt-4 animate-in slide-in-from-right-8 duration-300 flex flex-col items-center pb-32">
      <div className="w-full flex items-center justify-between mb-8 sm:mb-8 pt-4 px-2">
        <div className="flex items-center text-zinc-900 dark:text-white">
          <button onClick={() => router.push("/")} className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            <h2 className="text-xl font-bold ml-2">เลือกที่นั่ง</h2>
            {isLoadingSeats && <Loader2 className="w-4 h-4 ml-3 animate-spin text-zinc-400" />}
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className="w-full flex-col items-center flex mb-16 sm:mb-20">
        <div className="w-[85%] sm:w-3/4 max-w-lg h-8 border-t-4 border-[#10b981]/50 rounded-t-[100%] shadow-[0_-10px_20px_rgba(16,185,129,0.1)]"></div>
        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-medium mt-1">เวที</p>
      </div>

      <div className="w-full flex justify-center px-0.5 sm:px-2 text-zinc-900 dark:text-white pb-6">
        <div className="flex flex-row gap-1.5 sm:gap-4 md:gap-8 w-full max-w-[1200px] justify-center items-start">
          
          {/* Left Side */}
          <div className="flex flex-col gap-2 sm:gap-6 w-fit">
            {/* โซนC */}
            <div className="flex flex-col gap-1 sm:gap-2 w-full bg-zinc-50 dark:bg-white/[0.02] p-1.5 sm:p-4 lg:p-6 pt-4 sm:pt-8 rounded-[8px] sm:rounded-xl border border-black/5 dark:border-white/5 relative items-center">
              <h3 className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 text-[8px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-full">โซน C</h3>
              <div className="flex flex-col gap-1 sm:gap-2 w-full mt-1 sm:mt-2">
                {ZONE_C_ROWS.map((count, rIdx) => {
                  const startSeat = rIdx === 0 ? 1 : rIdx === 1 ? 8 : 16;
                  const rowSeats = Array.from({ length: count }, (_, i) => startSeat + i);
                  return (
                    <div key={`C-${rIdx}`} className="flex justify-center gap-[2px] sm:gap-1 md:gap-1.5 w-full">
                      {rowSeats.map((seatNum) => renderSeat(`C${seatNum}`))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* โซนA */}
            <div className="flex flex-col gap-1 sm:gap-2 w-full bg-zinc-50 dark:bg-white/[0.02] p-1.5 sm:p-4 lg:p-6 pt-4 sm:pt-8 rounded-[8px] sm:rounded-xl border border-black/5 dark:border-white/5 relative items-center">
              <h3 className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 text-[8px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-full">โซน A</h3>
              <div className="flex flex-col gap-1 sm:gap-2 w-full mt-1 sm:mt-2">
                {ZONE_A_ROWS.map((count, rIdx) => {
                  const startSeat = 1;
                  const rowSeats = Array.from({ length: count }, (_, i) => startSeat + i);
                  return (
                    <div key={`A-${rIdx}`} className="flex justify-center gap-[2px] sm:gap-1 md:gap-1.5 w-full">
                      {rowSeats.map((seatNum) => renderSeat(`A${seatNum}`))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col gap-2 sm:gap-6 w-fit">
            {/* โซนD */}
            <div className="flex flex-col gap-1 sm:gap-2 w-full bg-zinc-50 dark:bg-white/[0.02] p-1.5 sm:p-4 lg:p-6 pt-4 sm:pt-8 rounded-[8px] sm:rounded-xl border border-black/5 dark:border-white/5 relative items-center">
              <h3 className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 text-[8px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-full">โซน D</h3>
              <div className="flex flex-col gap-1 sm:gap-2 w-full mt-1 sm:mt-2">
                {ZONE_D_ROWS.map((count, rIdx) => {
                  const startSeat = rIdx === 0 ? 1 : rIdx === 1 ? 9 : 19;
                  const rowSeats = Array.from({ length: count }, (_, i) => startSeat + i);
                  return (
                    <div key={`D-${rIdx}`} className="flex justify-center gap-[2px] sm:gap-1 md:gap-1.5 w-full">
                      {rowSeats.map((seatNum) => renderSeat(`D${seatNum}`))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* โซนB */}
            <div className="flex flex-col gap-1 sm:gap-2 w-full bg-zinc-50 dark:bg-white/[0.02] p-1.5 sm:p-4 lg:p-6 pt-4 sm:pt-8 rounded-[8px] sm:rounded-xl border border-black/5 dark:border-white/5 relative items-center">
              <h3 className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 text-[8px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-full">โซน B</h3>
              <div className="flex flex-col gap-1 sm:gap-2 w-full mt-1 sm:mt-2">
                {ZONE_B_ROWS.map((count, rIdx) => {
                  const startSeat = 1;
                  const rowSeats = Array.from({ length: count }, (_, i) => startSeat + i);
                  return (
                    <div key={`B-${rIdx}`} className="flex justify-center gap-[2px] sm:gap-1 md:gap-1.5 w-full">
                      {rowSeats.map((seatNum) => renderSeat(`B${seatNum}`))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 mt-2 text-xs font-semibold text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-[3px] bg-blue-50 border border-blue-200 flex items-center justify-center">
            <Armchair className="w-2.5 h-2.5 text-blue-600" />
          </div> ว่าง ({availableSeatsCount}/{totalSeats})
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-[3px] bg-[#10b981] border border-[#059669] flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-white" />
          </div> เลือกแล้ว ({booking.seats.length})
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-[3px] bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 flex items-center justify-center">
            <User className="w-2.5 h-2.5 text-zinc-400" />
          </div> เต็มแล้ว ({bookedSeatsCount})
        </div>
      </div>

      <div className="mt-16 w-full max-w-4xl flex flex-col items-center">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative w-full aspect-[4/3] max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 cursor-pointer group">
              <Image 
                src="/seating-plan2.png" 
                alt="นี่คือภาพที่นั่งในโรงละคร" 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 dark:bg-black/90 p-4 rounded-full shadow-lg backdrop-blur-sm transform transition-transform group-hover:scale-110">
                  <ZoomIn className="w-8 h-8 text-zinc-900 dark:text-white" />
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] p-2 sm:p-4 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl">
            <DialogTitle className="sr-only">ซูมภาพที่นั่ง</DialogTitle>
            <div className="relative w-full h-[70vh] sm:h-[80vh]">
              <Image 
                src="/seating-plan2.png" 
                alt="นี่คือภาพที่นั่งในโรงละครแบบขยาย" 
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            </div>
          </DialogContent>
        </Dialog>
        <div className="mt-4 px-6 py-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-center">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">นี่คือภาพจำลองมุมมองของที่นั่งในโรงละครจากด้านบน (คลิกที่ภาพเพื่อซูม)</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 p-6 z-50 transition-colors">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-12 text-zinc-900 dark:text-white">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-bold">ที่นั่ง</p>
              <p className="text-2xl font-bold leading-none">
                {booking.seats.length > 0 ? booking.seats.join(", ") : "-"}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
            <Button 
              variant="outline"
              onClick={() => router.push("/")}
              className="border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 px-10 h-12 rounded-lg text-lg font-medium"
            >
              ย้อนกลับ
            </Button>
            <Button 
              onClick={() => router.push("/form")}
              disabled={booking.seats.length === 0}
              className="bg-[#10b981] hover:bg-[#059669] text-zinc-900 font-extrabold px-8 h-14 rounded-xl text-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.7)] border-none disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100"
            >
              ดำเนินการต่อ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}