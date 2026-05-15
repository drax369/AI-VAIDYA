import { PlayCircle, Sparkles } from "lucide-react";

function DemoMode({ onFillDemo }) {
  return (
    <div className="mt-6 rounded-3xl border border-green-400/20 bg-green-500/10 p-5">
      <div className="flex items-center gap-2 text-green-300 font-bold mb-2">
        <Sparkles size={18} />
        Hackathon Demo Mode
      </div>

      <p className="text-sm text-yellow-50/60 mb-4">
        Auto-fills a judge-friendly Ayurveda query and gives you the exact demo sequence.
      </p>

      <button
        onClick={onFillDemo}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-400 to-yellow-400 text-black font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
      >
        <PlayCircle size={18} />
        Start Demo Flow
      </button>
    </div>
  );
}

export default DemoMode;