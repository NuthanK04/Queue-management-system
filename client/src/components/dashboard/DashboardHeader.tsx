import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Moon, Sparkles, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const handleLogout = () => { logout(); navigate("/login"); };

  return <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
      <button
        type="button"
        onClick={() => window.location.reload()}
        aria-label="Reload dashboard"
        className="flex items-center gap-3 rounded-3xl p-2 transition hover:bg-slate-100 dark:hover:bg-white/10"
      >
        <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
          <Sparkles size={21} />
        </div>
        <div className="text-left">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">QueueFlow</p>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">Manager workspace</h1>
        </div>
      </button>
      <div className="flex items-center gap-2"><button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme" className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white">{theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}</button><button aria-label="Notifications" className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"><Bell size={19} /></button><button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-red-500/10 dark:hover:text-red-300"><LogOut size={16} /><span className="hidden sm:inline">Log out</span></button></div>
    </div>
  </header>;
}
