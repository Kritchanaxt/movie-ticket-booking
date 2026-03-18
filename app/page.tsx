"use client";

import Image from "next/image";
import { PlayCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-[100dvh] relative">
      {/* Theme Toggle in top right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="flex-1 w-full max-w-md mx-auto p-6 flex flex-col justify-center gap-10 animate-in fade-in duration-500">
        <div className="text-center space-y-2 pt-10">
          <h1 className="text-4xl font-extrabold tracking-tighter text-zinc-900 dark:text-white drop-shadow-xl">จองที่นั่งละครเวที</h1>
          <p className="text-emerald-600 dark:text-emerald-400 text-base font-medium tracking-wide mt-2">จองที่นั่งละครเวทีง่ายๆ ผ่านมือถือ</p>
        </div>
        
        <div className="relative aspect-video bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] flex items-center justify-center group cursor-pointer ring-1 ring-white/10 dark:ring-white/5">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <PlayCircle className="w-16 h-16 text-[#10b981]/90 group-hover:scale-110 group-hover:text-emerald-400 transition-all drop-shadow-lg" />
          </div>
          <Image 
            src="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=2000&auto=format&fit=crop" 
            alt="Theatre Background" 
            fill 
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
          />
          <div className="absolute bottom-4 left-5 z-20">
            <p className="font-bold text-lg text-white drop-shadow-md">ตัวอย่างการแสดง</p>
            <p className="text-xs text-zinc-100 font-medium drop-shadow-md">ละครเวที: เกมปล้นคนตาย</p>
            <p className="text-xs text-zinc-200 mt-1.5 flex items-center font-medium drop-shadow-md">
              <MapPin className="w-3.5 h-3.5 mr-1 text-[#10b981]" /> มหาวิทยาลัยบูรพา ตึก MUPAC
            </p>
          </div>
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
