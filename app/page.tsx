"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      // Force play when the video element renders
      videoRef.current.play().catch(error => {
        console.log("Autoplay was prevented:", error);
      });
    }
  }, [isPlaying]);

  return (
    <div className="flex flex-col min-h-[100dvh] relative">
      {/* Theme Toggle in top right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="flex-1 w-full max-w-[95%] sm:max-w-[90%] md:max-w-4xl lg:max-w-5xl mx-auto px-2 sm:p-8 pt-20 sm:pt-6 flex flex-col justify-center gap-6 sm:gap-8 animate-in fade-in duration-500">
        <div className="text-center space-y-2 mt-4 sm:mt-0">
          <h1 className="text-4xl font-extrabold tracking-tighter text-zinc-900 dark:text-white drop-shadow-xl mt-4 sm:mt-0">จองที่นั่งละครเวที</h1>
          <p className="text-emerald-600 dark:text-emerald-400 text-base font-medium tracking-wide mt-2">เมื่อเงินจากการปล้นธนาคารถูกซ่อนอยู่ในโลงศพภายในบ้าน ความตาย ความศักดิ์สิทธิ์ และศีลธรรมจึงถูกใช้เป็นเครื่องมือโกหกเพื่อผลประโยชน์ส่วนตัว จนกลายเป็นฉากตลกร้ายที่เต็มไปด้วยความวุ่นวาย</p>
        </div>
        
        <div 
          className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-video bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] flex items-center justify-center group cursor-pointer ring-1 ring-white/10 dark:ring-white/5"
          onClick={() => {
            if (!isPlaying) setIsPlaying(true);
          }}
        >
          {isPlaying ? (
            <video 
              ref={videoRef}
              src="/10.The TEASER Final.mp4" 
              className="w-full h-full object-cover z-30 bg-black" 
              autoPlay 
              muted
              controls 
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 sm:to-transparent z-10 pointer-events-none"></div>
              <Image 
                src="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=2000&auto=format&fit=crop" 
                alt="Theatre Background" 
                fill 
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover opacity-70 group-hover:opacity-90 transition-all duration-700 group-hover:scale-105" 
              />
              <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-6 z-20 pr-4">
                <p className="text-xs sm:text-sm text-zinc-100 font-medium drop-shadow-md mb-2">ละครเวที: The Loot Dead Game 2026 เกมปล้น...คนตาย</p>
                <p className="text-[10px] sm:text-xs text-zinc-300 flex items-center font-medium drop-shadow-md mb-1">
                  กำกับโดย เบญจมาพร อัศดร
                </p>
                <p className="text-[10px] sm:text-xs text-zinc-300 flex items-start font-medium drop-shadow-md">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 mt-0.5 shrink-0 text-[#10b981]" /> <span className="leading-relaxed">คณะดนตรีและการแสดงตึก MUPA <br/>โรงละคร Black Box (Ac1)</span>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-8">
          <Button 
            onClick={() => router.push("/select")}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-zinc-900 font-extrabold h-16 text-xl rounded-2xl shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.7)] transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            ดำเนินการจองที่นั่ง
          </Button>
        </div>

        {/* Sponsor Logos Section */}
        <div className="mt-10 py-8 border-t border-zinc-200/50 dark:border-zinc-800/50">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-500 text-center mb-6">
            สนับสนุนโดย
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 bg-white border border-zinc-200 dark:border-white/10 rounded-full overflow-hidden shadow-md">
              <Image src="/sponsor-bancake.jpg" alt="บ้านเค้กโฮมเมค" fill className="object-contain p-3" />
            </div>
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 bg-white border border-zinc-200 dark:border-white/10 rounded-full overflow-hidden shadow-md">
              <Image src="/sponsor-packteam13.jpg" alt="PackTeam13" fill className="object-contain p-4" />
            </div>
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 bg-white border border-zinc-200 dark:border-white/10 rounded-full overflow-hidden shadow-md">
              <Image src="/sponsor-flower.jpg" alt="The Petal Project" fill className="object-contain p-3" />
            </div>
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 bg-white border border-zinc-200 dark:border-white/10 rounded-full overflow-hidden shadow-md">
              <Image src="/sponsor-sign.jpg" alt="ป้ายแสนดี" fill className="object-contain p-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
