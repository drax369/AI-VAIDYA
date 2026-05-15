import { Trash2, Clock, Eye } from "lucide-react";
import { clearHistory } from "./history";

function HistoryPanel({ history, setHistory, onOpen }) {
  function handleClear() {
    clearHistory();
    setHistory([]);
  }

  return (
    <div className="mt-6 rounded-3xl border border-yellow-500/20 bg-black/25 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-yellow-400 font-bold">Saved History</h3>

        <button
          onClick={handleClear}
          className="text-red-300 hover:text-red-200"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {history.length === 0 && (
        <p className="text-xs text-yellow-50/40">
          No saved analyses yet.
        </p>
      )}

      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onOpen(item)}
            className="w-full text-left rounded-2xl border border-yellow-500/10 bg-black/30 p-3 hover:border-yellow-400/40"
          >
            <div className="flex items-center gap-2 text-yellow-300 text-sm font-bold mb-1">
              <Eye size={14} />
              {item.type}
            </div>

            <p className="text-xs text-yellow-50/60 line-clamp-2">
              {item.title}
            </p>

            <div className="flex items-center gap-1 text-[10px] text-yellow-50/35 mt-2">
              <Clock size={10} />
              {item.createdAt}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HistoryPanel;