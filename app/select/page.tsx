"use client";

import { ChevronLeft, User, Armchair, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext";
import { ThemeToggle } from "@/components/theme-toggle";

const ROWS = ["A", "B", "C", "D", "E"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const UNAVAILABLE_SEATS = ["A5", "B5", "B6", "C8", "C9", "C10"];

export default function SelectPage() {
  const router = useRouter();
  const { booking, updateBooking } = useBooking();

  const handleSeatClick = (seatId: string) => {
    if (UNAVAILABLE_SEATS.includes(seatId)) return;
    
    const isSelected = booking.seats.includes(seatId);
    let newSeats;
    
    if (isSelected) {
      newSeats = booking.seats.filter((s) => s !== seatId);
    } else {
      newSeats = [...booking.seats, seatId].sort();
    }
    
    updateBooking({ seats: newSeats });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-in slide-in-from-right-8 duration-300 flex flex-col items-center pb-32">
      <div className="w-full flex items-center justify-between mb-8 pt-4 px-2">
        <div className="flex items-center text-zinc-900 dark:text-white">
          <button onClick={() => router.push("/")} className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold ml-2">เลือกที่นั่ง</h2>
        </div>
        <ThemeToggle />
      </div>

      <div className="w-full flex flex-col items-center mb-35">
        <div className="w-[85%] sm:w-3/4 h-8 border-t-4 border-[#10b981]/50 rounded-t-[100%] shadow-[0_-10px_20px_rgba(16,185,129,0.1)]"></div>
        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-medium mt-1">เวที</p>
      </div>

      <div className="flex flex-col gap-2 sm:gap-3 w-full overflow-x-auto pb-6 px-1 no-scrollbar text-zinc-900 dark:text-white">
        {ROWS.map((row) => (
          <div key={row} className="flex justify-center gap-1.5 sm:gap-2 min-w-max mx-auto items-center">
            <div className="w-5 flex items-center justify-center font-bold text-[10px] text-zinc-600 mr-2">{row}</div>
            
            {/* Left Block: Seats 1-5 */}
            <div className="flex gap-1.5 sm:gap-2">
              {COLS.slice(0, 5).map((col) => {
                const seatId = `${row}${col}`;
                const isSelected = booking.seats.includes(seatId);
                const isUnavailable = UNAVAILABLE_SEATS.includes(seatId);

                return (
                  <button
                    key={seatId}
                    disabled={isUnavailable}
                    onClick={() => handleSeatClick(seatId)}
                    className={`
                      w-9 h-9 sm:w-11 sm:h-11 rounded-lg text-[9px] sm:text-xs font-bold transition-all duration-200 border flex flex-col items-center justify-center
                      ${isUnavailable
                        ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border-zinc-200 dark:bg-zinc-900 dark:text-zinc-600 dark:border-zinc-800"
                        : isSelected
                        ? "bg-[#10b981] text-white border-[#059669] shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-110"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                      }
                    `}
                  >
                    {isUnavailable ? (
                      <User className="w-5 h-5 sm:w-6 sm:h-6 opacity-40" />
                    ) : isSelected ? (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <>
                        <Armchair className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-[7px] sm:text-[8px] mt-0.5">{seatId}</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Aisle (Gap) */}
            <div className="w-6 sm:w-12"></div>

            {/* Right Block: Seats 6-10 */}
            <div className="flex gap-1.5 sm:gap-2">
              {COLS.slice(5, 10).map((col) => {
                const seatId = `${row}${col}`;
                const isSelected = booking.seats.includes(seatId);
                const isUnavailable = UNAVAILABLE_SEATS.includes(seatId);

                return (
                  <button
                    key={seatId}
                    disabled={isUnavailable}
                    onClick={() => handleSeatClick(seatId)}
                    className={`
                      w-9 h-9 sm:w-11 sm:h-11 rounded-lg text-[9px] sm:text-xs font-bold transition-all duration-200 border flex flex-col items-center justify-center
                      ${isUnavailable
                        ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border-zinc-200 dark:bg-zinc-900 dark:text-zinc-600 dark:border-zinc-800"
                        : isSelected
                        ? "bg-[#10b981] text-white border-[#059669] shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-110"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                      }
                    `}
                  >
                    {isUnavailable ? (
                      <User className="w-5 h-5 sm:w-6 sm:h-6 opacity-40" />
                    ) : isSelected ? (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <>
                        <Armchair className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-[7px] sm:text-[8px] mt-0.5">{seatId}</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="w-5 flex items-center justify-center font-bold text-[10px] text-zinc-600 ml-2">{row}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-6 mt-6 mb-12 text-xs font-semibold text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-[3px] bg-blue-50 border border-blue-200 flex items-center justify-center">
            <Armchair className="w-2.5 h-2.5 text-blue-600" />
          </div> ว่าง
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-[3px] bg-[#10b981] border border-[#059669] flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-white" />
          </div> เลือกแล้ว
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-[3px] bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 flex items-center justify-center">
            <User className="w-2.5 h-2.5 text-zinc-400" />
          </div> เต็มแล้ว
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