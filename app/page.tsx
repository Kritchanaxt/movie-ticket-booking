"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col min-h-[100dvh] relative">
      {/* Theme Toggle in top right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="flex-1 w-full max-w-md md:max-w-lg mx-auto p-6 pt-20 sm:pt-6 flex flex-col justify-center gap-8 animate-in fade-in duration-500">
        <div className="text-center space-y-2 mt-4 sm:mt-0">
          <h1 className="text-4xl font-extrabold tracking-tighter text-zinc-900 dark:text-white drop-shadow-xl mt-4 sm:mt-0">จองที่นั่งละครเวที</h1>
          <p className="text-emerald-600 dark:text-emerald-400 text-base font-medium tracking-wide mt-2">เมื่อเงินจากการปล้นธนาคารถูกซ่อนอยู่ในโลงศพภายในบ้าน ความตาย ความศักดิ์สิทธิ์ และศีลธรรมจึงถูกใช้เป็นเครื่องมือโกหกเพื่อผลประโยชน์ส่วนตัว จนกลายเป็นฉากตลกร้ายที่เต็มไปด้วยความวุ่นวาย</p>
        </div>
        
        <div 
          className="relative aspect-[4/3] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] flex items-center justify-center group cursor-pointer ring-1 ring-white/10 dark:ring-white/5"
          onClick={() => {
            if (!isPlaying) setIsPlaying(true);
          }}
        >
          {isPlaying ? (
            <video 
              src="/307065.mp4" 
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:bg-[#10b981]/20 transition-all duration-300">
                  <PlayCircle className="w-12 h-12 text-[#10b981] group-hover:scale-110 transition-all drop-shadow-lg" />
                </div>
              </div>
              <Image 
                src="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=2000&auto=format&fit=crop" 
                alt="Theatre Background" 
                fill 
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover opacity-70 group-hover:opacity-90 transition-all duration-700 group-hover:scale-105" 
              />
              <div className="absolute bottom-5 left-6 z-20 pr-4">
                <p className="font-bold text-xl text-white drop-shadow-md mb-1.5">ตัวอย่างการแสดง</p>
                <p className="text-sm text-zinc-100 font-medium drop-shadow-md mb-2">ละครเวที: The Loot Dead Game 2026 เกมปล้น...คนตาย</p>
                <p className="text-xs text-zinc-300 flex items-center font-medium drop-shadow-md mb-1.5">
                  กำกับโดย เบญจมาพร อัศดร
                </p>
                <p className="text-xs text-zinc-300 flex items-start font-medium drop-shadow-md">
                  <MapPin className="w-4 h-4 mr-1.5 mt-0.5 shrink-0 text-[#10b981]" /> <span className="leading-relaxed">คณะดนตรีและการแสดงตึก MUPA <br/>โรงละคร Black Box (Ac1)</span>
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
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder for Sponsor Logos */}
            <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-[10px] text-zinc-500 font-bold border border-zinc-300 dark:border-zinc-700">Logo 1</div>
            <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-[10px] text-zinc-500 font-bold border border-zinc-300 dark:border-zinc-700">Logo 2</div>
            <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-[10px] text-zinc-500 font-bold border border-zinc-300 dark:border-zinc-700">Logo 3</div>
          </div>
        </div>
      </div>
    </div>
  );
}
