import React, { useState } from 'react';

export default function Admin() {
  const [prefix, setPrefix] = useState('Mr. & Mrs.');
  const [name, setName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const handleGenerate = () => {
    if (!name.trim()) return;
    const url = new URL(window.location.origin);
    url.searchParams.set('prefix', prefix);
    url.searchParams.set('name', name);
    setGeneratedLink(url.toString());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Link Generator</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Prefix</label>
            <select
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#8c244c] focus:border-[#8c244c] outline-none"
            >
              <option value="Mr. & Mrs.">Mr. & Mrs.</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Ms.">Ms.</option>
              <option value="Miss.">Miss.</option>
              <option value="Dr.">Dr.</option>
              <option value="Rev.">Rev.</option>
              <option value="Prof.">Prof.</option>
              <option value="Hon.">Hon.</option>
              <option value="Family of">Family of</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Guest Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#8c244c] focus:border-[#8c244c] outline-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-[#8c244c] text-white font-bold py-3 rounded-lg mt-2 hover:bg-[#c44576] transition-colors"
          >
            Generate Link
          </button>

          {generatedLink && (
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <p className="text-sm text-slate-600 break-all">{generatedLink}</p>
              <button
                onClick={handleCopy}
                className="w-full bg-slate-800 text-white font-medium py-2 rounded-lg hover:bg-slate-900 transition-colors"
              >
                Copy Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
