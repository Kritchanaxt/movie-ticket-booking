"use client";

import { CheckCircle2, Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";

export default function SuccessPage() {
  const router = useRouter();
  const { booking, resetBooking } = useBooking();
  const ticketRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === 'dark'; // Default to dark on server
  
  // Theme colors
  const ticketBg = isDark ? '#0c0c0c' : '#ffffff';
  const ticketText = isDark ? '#ffffff' : '#18181b';
  const ticketMuted = isDark ? '#71717a' : '#52525b';
  const ticketBorder = isDark ? '#18181b' : '#e4e4e7';
  const cutoutBg = isDark ? '#000000' : '#f4f4f5'; // F4F4F5 is approx zinc-50 for light layout bg
  const dashColor = isDark ? '#27272a' : '#d4d4d8';

  useEffect(() => {
    if (booking.seats.length === 0) {
      router.push("/");
    }
  }, [booking, router]);

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
          const ticket = clonedDoc.querySelector('[data-ticket-container]') as HTMLElement;
          if (ticket) {
            const all = ticket.getElementsByTagName('*');
            for (let i = 0; i < all.length; i++) {
              const el = all[i] as HTMLElement;
              el.removeAttribute('class'); 
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

  const handleReturnHome = () => {
    resetBooking();
    router.push("/");
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col min-h-[100dvh] pt-12 animate-in zoom-in-95 duration-500">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-[#10b981]/20 rounded-full flex items-center justify-center mb-6 border-2 border-[#10b981]/50 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          <CheckCircle2 className="w-10 h-10 text-[#10b981]" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">ทำรายการสำเร็จ!</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">บันทึก E-Ticket เพื่อใช้เข้าชมการแสดง</p>
      </div>

      <div className="flex-1 flex flex-col items-center overflow-auto no-scrollbar w-full pb-10 gap-8">
        
        {/* E-Ticket Card to Download: Optimized for html2canvas by using pure Inline Styles */}
        <div 
          ref={ticketRef} 
          data-ticket-container
          style={{ 
            width: '100%',
            borderRadius: '32px',
            backgroundColor: ticketBg,
            padding: '32px',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
            border: `1px solid ${ticketBorder}`,
            boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
            color: ticketText,
            fontFamily: 'sans-serif'
          }}
        >
          {/* Decorative side cutouts */}
          <div style={{ position: 'absolute', top: '82px', left: '-20px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: cutoutBg, border: `1px solid ${ticketBorder}`, zIndex: 10 }}></div>
          <div style={{ position: 'absolute', top: '82px', right: '-20px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: cutoutBg, border: `1px solid ${ticketBorder}`, zIndex: 10 }}></div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '12px', color: ticketMuted, marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase' }}>วันที่ฉาย</p>
                <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{booking.date}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#10b981' }}>E-TICKET</p>
              </div>
            </div>

            {/* Dashed line */}
            <div style={{ width: '100%', borderTop: `1px dashed ${dashColor}`, position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-40px', top: '-6px', width: '12px', height: '12px', backgroundColor: cutoutBg, borderRadius: '50%' }}></div>
              <div style={{ position: 'absolute', right: '-40px', top: '-6px', width: '12px', height: '12px', backgroundColor: cutoutBg, borderRadius: '50%' }}></div>
            </div>
            
            <div style={{ paddingTop: '8px' }}>
              <p style={{ fontSize: '10px', color: ticketMuted, marginBottom: '4px', fontWeight: '500', textTransform: 'uppercase' }}>ผู้จอง</p>
              <p style={{ fontWeight: 'bold', fontSize: '16px', color: ticketText, marginBottom: '12px' }}>{booking.customerName}</p>
              <p style={{ fontSize: '12px', color: ticketMuted, marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase' }}>ละครเวที</p>
              <p style={{ fontWeight: 'bold', fontSize: '24px', lineHeight: '1.2', color: ticketText }}>{booking.movieTitle}</p>
              <p style={{ fontSize: '12px', color: ticketMuted, marginTop: '4px' }}>กำกับโดย เบญจมาพร อัศดร</p>
              <p style={{ fontSize: '12px', color: ticketMuted, marginTop: '6px', display: 'flex', alignItems: 'flex-start' }}>
                <MapPin className="w-4 h-4 mr-1.5 shrink-0 mt-0.5" style={{ color: '#10b981' }} /> คณะดนตรีและการแสดงตึก MUPA โรงละคร Black Box (Ac1)
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', color: ticketMuted, marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase' }}>ที่นั่ง ({booking.seats.length})</p>
                <p style={{ fontWeight: 'bold', fontSize: '20px' }}>{booking.seats.join(", ")}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', color: ticketMuted, marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase' }}>เวลา</p>
                <p style={{ fontWeight: 'bold', fontSize: '20px' }}>{booking.time} น.</p>
              </div>
            </div>


            {/* Sponsor Logos Section on Ticket */}
            <div style={{ borderTop: `1px solid ${ticketBorder}`, padding: '24px 0 0', marginTop: '4px' }}>
              <p style={{ fontSize: '9px', color: ticketMuted, textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '16px' }}>สนับสนุนโดย</p>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${ticketBorder}` }}>
                  <img src="/sponsor-bancake.jpg" alt="บ้านเค้กโฮมเมค" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
                </div>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${ticketBorder}` }}>
                  <img src="/sponsor-packteam13.jpg" alt="PackTeam13" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
                </div>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${ticketBorder}` }}>
                  <img src="/sponsor-flower.jpg" alt="The Petal Project" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
                </div>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${ticketBorder}` }}>
                  <img src="/sponsor-sign.jpg" alt="ป้ายแสนดี" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
                </div>
              </div>
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
            onClick={handleReturnHome}
            className="w-full border-zinc-300 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 h-16 text-lg font-bold rounded-2xl border-2"
          >
            กลับสู่หน้าแรก
          </Button>
        </div>
      </div>
    </div>
  );
}