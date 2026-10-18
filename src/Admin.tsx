import { useEffect, useState } from "react";
import { Check, Copy, Link2, MessageCircle } from "lucide-react";
import { COUPLE, PREFIXES, PrefixKey, buildDisplayName, buildInviteLink, buildInviteMessage } from "./guest";

const WINE = "#6b1d3a";

export default function Admin() {
  const [prefix, setPrefix] = useState<PrefixKey>("mr");
  const [name, setName] = useState("");
  const [generated, setGenerated] = useState<{ link: string; message: string; displayName: string } | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const displayName = buildDisplayName(prefix, name);
    const link = buildInviteLink(window.location.origin, prefix, name);
    setGenerated({ displayName, link, message: buildInviteMessage(displayName, link) });
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(label);
    } catch {
      setToast("Copy failed. Please copy manually.");
    }
  };

  const previewName = name.trim() ? buildDisplayName(prefix, name) : "";

  return (
    <div className="h-[100dvh] overflow-y-auto bg-[#fdf8f4] flex items-start sm:items-center justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-lg bg-white p-6 sm:p-8 shadow-[0_30px_60px_-30px_rgba(107,29,58,0.3)] border border-[#b8935a]/30">
        <p className="font-display text-[10px] tracking-[0.35em] uppercase text-[#9a7646]">
          {COUPLE.bride} &amp; {COUPLE.groom}
        </p>
        <h1 className="font-serif text-3xl text-[#3a2a30] mt-1 mb-6">Invitation Link Generator</h1>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-4">
            <label className="block">
              <span className="block text-xs font-medium text-slate-600 mb-1">Prefix</span>
              <select
                value={prefix}
                onChange={(e) => setPrefix(e.target.value as PrefixKey)}
                className="w-full border border-slate-300 bg-white p-2.5 text-slate-800 outline-none focus:border-[#6b1d3a] focus:ring-1 focus:ring-[#6b1d3a]"
              >
                {PREFIXES.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="block text-xs font-medium text-slate-600 mb-1">Guest Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sanjaya"
                className="w-full border border-slate-300 p-2.5 text-slate-800 outline-none focus:border-[#6b1d3a] focus:ring-1 focus:ring-[#6b1d3a]"
              />
            </label>
          </div>

          {previewName && (
            <p className="text-sm text-slate-500">
              Greeting: <span className="font-semibold text-slate-800">Dear {previewName} ❤️</span>
            </p>
          )}

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 hover:opacity-90 transition-opacity disabled:opacity-40"
            style={{ background: WINE }}
          >
            <Link2 className="w-4 h-4" />
            Generate Link
          </button>
        </form>

        <div className="mt-6 space-y-4">
          {generated && (
            <>
              <div>
                <span className="block text-xs font-medium text-slate-600 mb-1">Invitation link</span>
                <a
                  href={generated.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all border border-slate-200 bg-slate-50 p-3 text-sm text-[#6b1d3a] underline-offset-2 hover:underline"
                >
                  {generated.link}
                </a>
              </div>

              <div>
                <span className="block text-xs font-medium text-slate-600 mb-1">Message preview</span>
                <pre className="whitespace-pre-wrap break-words border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 font-sans max-h-72 overflow-y-auto">
                  {generated.message}
                </pre>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && copy(generated.link, "Link copied!")}
              className="flex items-center justify-center gap-2 border border-slate-300 py-2.5 text-slate-800 font-medium hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <Copy className="w-4 h-4" />
              Copy Link Only
            </button>
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && copy(generated.message, "Message copied!")}
              className="flex items-center justify-center gap-2 bg-[#25D366] py-2.5 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <MessageCircle className="w-4 h-4" />
              Copy Full Message
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900 text-white text-sm px-4 py-2.5 shadow-lg"
        >
          <Check className="w-4 h-4 text-[#25D366]" />
          {toast}
        </div>
      )}
    </div>
  );
}
