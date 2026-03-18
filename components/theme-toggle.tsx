"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Ensure theme is only shown on the client to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="w-8 h-8" />

  return (
    <div className="flex bg-zinc-200/50 dark:bg-zinc-800/50 p-1 rounded-full backdrop-blur-sm border border-zinc-300 dark:border-zinc-700">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={`w-8 h-8 rounded-full transition-all ${
          theme === "light" ? "bg-white text-emerald-600 shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("system")}
        className={`w-8 h-8 rounded-full transition-all ${
          theme === "system" ? "bg-white dark:bg-zinc-700 text-emerald-600 shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
      >
        <Monitor className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={`w-8 h-8 rounded-full transition-all ${
          theme === "dark" ? "bg-zinc-700 text-emerald-400 shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
      >
        <Moon className="h-4 w-4" />
      </Button>
    </div>
  )
}
