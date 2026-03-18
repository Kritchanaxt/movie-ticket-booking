"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { CheckCircle2, ChevronLeft, Download, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import html2canvas from "html2canvas-pro";
import { toast } from "sonner";

// --- Types ---
type Step = "intro" | "select" | "detail" | "success" | "ticket";

interface BookingState {
  movieId: string;
  movieTitle: string;
  date: string;
  time: string;
  seats: string[];
  pricePerSeat: number;
  serviceCharge: number;
}

const ROWS = ["A", "B", "C", "D", "E", "F", "G"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const UNAVAILABLE_SEATS = ["C4", "C5", "D4", "D5", "E8", "E9"];

export default function BookingFlow() {
  const [currentStep, setCurrentStep] = useState<Step>("intro");
  
  const [booking, setBooking] = useState<BookingState>({
    movieId: "m001",
    movieTitle: "SPIDERMAN NO WAY HOME",
    date: "Mon, 23 Oct 2023",
    time: "14:40",
    seats: [],
    pricePerSeat: 180,
    serviceCharge: 20,
  });

  const ticketRef = useRef<HTMLDivElement>(null);

  // --- Handlers ---
  const handleSeatClick = (seatId: string) => {
    if (UNAVAILABLE_SEATS.includes(seatId)) return;
    
    setBooking((prev) => {
      const isSelected = prev.seats.includes(seatId);
      if (isSelected) {
        return { ...prev, seats: prev.seats.filter((s) => s !== seatId) };
      } else {
        return { ...prev, seats: [...prev.seats, seatId].sort() };
      }
    });
  };

  const calculateTotal = () => {
    const seatTotal = booking.seats.length * booking.pricePerSeat;
    return seatTotal > 0 ? seatTotal + booking.serviceCharge : 0;
  };

  const handleCheckout = async () => {
    try {
      toast.info("กำลังดำเนินการชำระเงิน และบันทึกข้อมูล...");
      
      const response = await fetch('/api/save-to-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });

      if (!response.ok) throw new Error("API Error");

      toast.success("บันทึกข้อมูลและชำระเงินเรียบร้อย");
      setCurrentStep("success");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const downloadTicket = async () => {
    if (!ticketRef.current) return;
    try {
      toast("กำลังสร้างรูปภาพ...");
      
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: "#000000",
        scale: 3, 
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          // Deep clean all elements in the cloned document to remove any 'lab' or 'oklch' colors
          const ticket = clonedDoc.querySelector('[data-ticket-container]') as HTMLElement;
          if (ticket) {
            const all = ticket.getElementsByTagName('*');
            for (let i = 0; i < all.length; i++) {
              const el = all[i] as HTMLElement;
              // Remove classes that might trigger the 'lab' color lookup in modern Tailwind/Shadcn
              el.removeAttribute('class'); 
              // The inline styles we added in the template will take over
            }
          }
        }
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `Ticket_${booking.seats.join("-")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("บันทึกรูปตั๋วเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("Download Error:", error);
      toast.error("ระบบไม่รองรับการสร้างภาพบนเบราว์เซอร์นี้");
    }
  };

  // --- Screens ---
  return (
    <div className="min-h-[100dvh] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-950/40 via-[#050505] to-[#000000] text-white selection:bg-emerald-500/30 pb-24 font-sans">
      
      {/* 1. INTRO PAGE */}
      {currentStep === "intro" && (
        <div className="flex flex-col min-h-[100dvh]">
          <div className="flex-1 w-full max-w-md mx-auto p-6 flex flex-col justify-center gap-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2 pt-10">
              <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">จองตั๋วภาพยนตร์</h1>
              <p className="text-emerald-400 text-sm font-medium tracking-wide">จองตั๋วหนังง่ายๆ ผ่านมือถือ</p>
            </div>
            
            <div className="relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <PlayCircle className="w-16 h-16 text-[#10b981]/90 group-hover:scale-110 group-hover:text-emerald-400 transition-all drop-shadow-lg" />
              </div>
              <Image 
                src="https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=2000&auto=format&fit=crop" 
                alt="Spiderman Background" 
                fill 
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
              />
              <div className="absolute bottom-4 left-5 z-20">
                <p className="font-bold text-lg text-white">ตัวอย่างภาพยนตร์</p>
                <p className="text-xs text-zinc-300 font-medium">สไปเดอร์แมน โน เวย์ โฮม</p>
              </div>
            </div>

            <div className="mt-8 mb-auto">
              <Button 
                onClick={() => setCurrentStep("select")}
                className="w-full bg-[#10b981] hover:bg-[#059669] text-black font-bold h-14 text-lg rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all"
              >
                ดำเนินการจองที่นั่ง
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SELECTION PAGE */}
      {currentStep === "select" && (
        <div className="w-full max-w-2xl mx-auto p-4 animate-in slide-in-from-right-8 duration-300 flex flex-col items-center">
          <div className="w-full flex items-center mb-8 pt-4 px-2">
            <button onClick={() => setCurrentStep("intro")} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold ml-2">เลือกที่นั่ง</h2>
          </div>

          <div className="w-full flex flex-col items-center mb-10">
            <div className="w-[85%] sm:w-3/4 h-8 border-t-4 border-[#10b981]/50 rounded-t-[100%] shadow-[0_-10px_20px_rgba(16,185,129,0.1)]"></div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-medium mt-1">หน้าจอ</p>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3 w-full overflow-x-auto pb-6 px-1 no-scrollbar">
            {ROWS.map((row) => (
              <div key={row} className="flex justify-center gap-1.5 sm:gap-2 min-w-max mx-auto">
                <div className="w-5 flex items-center justify-center font-bold text-[10px] text-zinc-600 mr-1">{row}</div>
                {COLS.map((col) => {
                  const seatId = `${row}${col}`;
                  const isSelected = booking.seats.includes(seatId);
                  const isUnavailable = UNAVAILABLE_SEATS.includes(seatId);

                  return (
                    <button
                      key={seatId}
                      disabled={isUnavailable}
                      onClick={() => handleSeatClick(seatId)}
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10 rounded-t-[8px] rounded-b-sm text-[9px] sm:text-[11px] font-bold transition-all duration-200 flex items-center justify-center
                        ${isUnavailable 
                          ? 'bg-zinc-800/80 text-zinc-600 cursor-not-allowed border border-zinc-800' 
                          : isSelected 
                            ? 'bg-[#10b981] text-black shadow-[0_0_12px_rgba(16,185,129,0.6)] scale-110' 
                            : 'bg-white text-black hover:bg-zinc-200'
                        }
                      `}
                    >
                      {seatId}
                    </button>
                  );
                })}
                <div className="w-5 flex items-center justify-center font-bold text-[10px] text-zinc-600 ml-1">{row}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-6 mt-6 mb-12 text-xs font-semibold text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-[3px] bg-white"></div> ว่าง
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-[3px] bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> เลือกแล้ว
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-[3px] bg-zinc-800 border border-zinc-700"></div> ขายแล้ว
            </div>
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-black border-t border-zinc-800 p-6 z-50">
            <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-12">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-bold">Total</p>
                  <p className="text-2xl font-bold text-white leading-none">RM {calculateTotal().toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-bold">Seat</p>
                  <p className="text-2xl font-bold text-white leading-none">
                    {booking.seats.length > 0 ? booking.seats.join(", ") : "-"}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-center">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep("intro")}
                  className="border-zinc-700 bg-transparent text-white hover:bg-zinc-900 px-10 h-12 rounded-lg text-lg font-medium"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentStep("detail")}
                  disabled={booking.seats.length === 0}
                  className="bg-[#5eead4] hover:bg-[#2dd4bf] text-[#134e4a] font-bold px-8 h-12 rounded-lg text-lg transition-all shadow-[0_0_15px_rgba(45,212,191,0.2)] border-none"
                >
                  Proceed Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BOOKING DETAIL PAGE */}
      {currentStep === "detail" && (
        <div className="w-full max-w-md mx-auto p-6 animate-in slide-in-from-right-8 duration-300">
          <div className="flex items-center mb-8 pt-2">
            <button onClick={() => setCurrentStep("select")} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold ml-2">รายละเอียดการจอง</h2>
          </div>

          <div className="space-y-8 px-2">
            <div>
              <h3 className="text-base font-bold text-white mb-5">รอบฉาย</h3>
              <div className="space-y-5 text-sm">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">ภาพยนตร์</p>
                  <p className="font-bold text-lg tracking-wide">สไปเดอร์แมน โน เวย์ โฮม</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">วันที่</p>
                  <p className="font-medium text-base">จันทร์, 23 ต.ค. 2023</p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">ที่นั่ง ({booking.seats.length})</p>
                    <p className="font-medium text-base">{booking.seats.join(", ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500 mb-1">เวลา</p>
                    <p className="font-medium text-base">{booking.time}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-zinc-800/80" />

            <div>
              <h3 className="text-sm font-bold text-zinc-400 mb-4">รายละเอียดการชำระเงิน</h3>
              <div className="space-y-4 text-sm mt-2">
                <div className="flex justify-between">
                  <p className="text-zinc-300 uppercase text-xs tracking-wider">ที่นั่งปกติ</p>
                  <p className="font-medium">฿{booking.pricePerSeat.toFixed(2)} <span className="text-zinc-500 text-xs ml-1">x{booking.seats.length}</span></p>
                </div>
                <div className="flex justify-between">
                  <p className="text-zinc-300 uppercase text-xs tracking-wider">ค่าธรรมเนียม (6%)</p>
                  <p className="font-medium">฿{booking.serviceCharge.toFixed(2)}</p>
                </div>
                <Separator className="bg-zinc-800/80 my-2" />
                <div className="flex justify-between items-center pt-2">
                  <p className="text-sm font-medium text-white">ยอดชำระสุทธิ</p>
                  <p className="text-xl font-bold text-white">฿{calculateTotal().toFixed(2)}</p>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 pt-6 font-medium">*ตั๋วที่ซื้อแล้วไม่สามารถยกเลิกหรือขอคืนเงินได้</p>
          </div>

          <div className="fixed bottom-0 left-0 w-full p-4 pb-6 bg-[#050505]/95 backdrop-blur-xl border-t border-zinc-900">
            <div className="max-w-md mx-auto px-2">
               <Button 
                onClick={handleCheckout}
                className="w-full bg-[#10b981] hover:bg-[#059669] text-black font-bold h-14 text-lg rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
              >
                ยืนยันการชำระเงิน
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUCCESS PAGE */}
      {currentStep === "success" && (
        <div className="flex flex-col min-h-[100dvh] items-center justify-center p-6 animate-in zoom-in-95 duration-500">
          <div className="w-full max-w-md mx-auto text-center space-y-6 flex flex-col items-center">
            
            <h2 className="text-2xl font-bold mb-4">ชำระเงินสำเร็จ</h2>

            <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-[#10b981] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                <CheckCircle2 className="w-14 h-14 text-black" strokeWidth={4} />
              </div>
            </div>

            <div className="w-full space-y-4 pt-6 px-4">
              <Button 
                onClick={() => setCurrentStep("ticket")}
                className="w-full bg-[#10b981] hover:bg-[#059669] text-black font-bold h-14 text-lg rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                ดูตั๋วภาพยนตร์
              </Button>
              <Button 
                variant="outline"
                onClick={() => setCurrentStep("intro")}
                className="w-full border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white h-14 text-base font-semibold rounded-xl"
              >
                กลับสู่หน้าแรก
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 5. TICKET DETAIL PAGE */}
      {currentStep === "ticket" && (
        <div className="flex flex-col min-h-[100dvh] items-center p-6 pt-16 animate-in slide-in-from-bottom-8 duration-500">
          <div className="w-full max-w-[380px] mx-auto flex flex-col">
            
            <div className="w-full mb-10 px-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">ตั๋วภาพยนตร์ของคุณ</h2>
            </div>

            {/* E-Ticket Card to Download: Optimized for html2canvas by using pure Inline Styles */}
            <div 
              ref={ticketRef} 
              data-ticket-container
              style={{ 
                width: '100%',
                borderRadius: '32px',
                backgroundColor: '#0c0c0c',
                padding: '32px',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1px solid #18181b',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                color: '#ffffff',
                fontFamily: 'sans-serif'
              }}
            >
              {/* Decorative side cutouts */}
              <div style={{ position: 'absolute', top: '82px', left: '-20px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#000000', border: '1px solid #18181b', zIndex: 10 }}></div>
              <div style={{ position: 'absolute', top: '82px', right: '-20px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#000000', border: '1px solid #18181b', zIndex: 10 }}></div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#71717a', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase' }}>วันที่ฉาย</p>
                    <p style={{ fontWeight: 'bold', fontSize: '18px' }}>จันทร์, 23 ต.ค. 2023</p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#10b981' }}>E-TICKET</p>
                  </div>
                </div>

                {/* Dashed line */}
                <div style={{ width: '100%', borderTop: '1px dashed #27272a', position: 'relative' }}>
                   <div style={{ position: 'absolute', left: '-40px', top: '-6px', width: '12px', height: '12px', backgroundColor: '#000000', borderRadius: '50%' }}></div>
                   <div style={{ position: 'absolute', right: '-40px', top: '-6px', width: '12px', height: '12px', backgroundColor: '#000000', borderRadius: '50%' }}></div>
                </div>
                
                <div style={{ paddingTop: '8px' }}>
                  <p style={{ fontSize: '12px', color: '#71717a', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase' }}>ภาพยนตร์</p>
                  <p style={{ fontWeight: 'bold', fontSize: '24px', lineHeight: '1.2' }}>สไปเดอร์แมน โน เวย์ โฮม</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '12px', color: '#71717a', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase' }}>ที่นั่ง ({booking.seats.length})</p>
                    <p style={{ fontWeight: 'bold', fontSize: '20px' }}>{booking.seats.join(", ")}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', color: '#71717a', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase' }}>เวลา</p>
                    <p style={{ fontWeight: 'bold', fontSize: '20px' }}>{booking.time} น.</p>
                  </div>
                </div>

                {/* QR Code Placeholder */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '16px', opacity: 0.8 }}>
                  <div style={{ width: '128px', height: '128px', backgroundColor: '#ffffff', padding: '8px', borderRadius: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(45deg,#000,#000 2px,#fff 2px,#fff 4px)' }}></div>
                  </div>
                  <p style={{ fontSize: '10px', color: '#52525b', fontFamily: 'monospace', letterSpacing: '0.1em' }}>SCAN FOR THEATER ENTRY</p>
                </div>

                {/* DOWNLOAD BUTTON - Hidden during capture via data-html2canvas-ignore */}
                <div data-html2canvas-ignore style={{ paddingTop: '24px' }}>
                   <Button 
                    onClick={downloadTicket}
                    className="w-full bg-[#10b981] hover:bg-[#059669] text-black font-extrabold h-16 rounded-2xl text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
                  >
                    <Download className="w-6 h-6" />
                    ดาวน์โหลดตั๋ว
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full mt-10" data-html2canvas-ignore>
              <Button 
                variant="outline"
                onClick={() => setCurrentStep("intro")}
                className="w-full border-zinc-800 bg-transparent text-white hover:bg-zinc-900 h-16 text-lg font-bold rounded-2xl border-2"
              >
                กลับสู่หน้าแรก
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
