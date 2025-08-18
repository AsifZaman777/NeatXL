'use client';

import React, { useEffect, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useRouter } from 'next/navigation';

interface InsightChunk {
  id: number;
  text: string;
}

interface InsightsResponse {
  insights?: string[];
  summary?: string;
  [key: string]: any;
}

interface ParsedSection {
  id: number;
  heading: string;
  bullets: string[];
  paragraphs: string[];
}

export default function AIAssistantPage() {
  const { csvData, reorderedData, savedData } = useData();
  const data = savedData || reorderedData || csvData; // prefer most refined
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string>('');
  const [insights, setInsights] = useState<InsightChunk[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [sections, setSections] = useState<ParsedSection[]>([]);
  const [autoTriggered, setAutoTriggered] = useState(false);

  // Serialize current dataset into CSV text for sending
  const buildCSVString = (): string => {
    if (!data) return '';
    const headerLine = data.headers.join(',');
    const lines = data.data.map(row => row.map(cell => {
      if (cell == null) return '';
      const cellStr = String(cell);
      if (/[",\n]/.test(cellStr)) {
        return '"' + cellStr.replace(/"/g, '""') + '"';
      }
      return cellStr;
    }).join(','));
    return [headerLine, ...lines].join('\n');
  };

  const parseResponse = (text: string) => {
    setRawResponse(text);

    // Try JSON first
    try {
      const json: InsightsResponse = JSON.parse(text);
      if (Array.isArray(json.insights)) {
        setInsights(json.insights.map((t, i) => ({ id: i, text: t })));
        return;
      } else if (typeof json.insights === 'string') {
        parseMarkdownInsights(json.insights);
        return;
      } else if (json.summary) {
        setSummary(json.summary);
        return;
      }
    } catch (_) {/* fall through */}

    // If markdown bullets or numbered list
    const bulletLines = text.split(/\n+/).filter(l => /^(\*|-|\d+\.)\s+/.test(l.trim()));
    if (bulletLines.length >= 2) {
      setInsights(bulletLines.map((l, i) => ({ id: i, text: l.replace(/^(\*|-|\d+\.)\s+/, '') })));
      return;
    }

    // Otherwise split by double newline into paragraphs
    const paras = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
    if (paras.length) {
      setInsights(paras.map((p, i) => ({ id: i, text: p })));
    }
  };

  const parseMarkdownInsights = (md: string) => {
    // Remove starting title line if present
    const lines = md.replace(/\r/g, '').split('\n');
    let current: ParsedSection | null = null;
    const built: ParsedSection[] = [];
    lines.forEach(line => {
      const h2 = line.match(/^##\s+(.+)/);
      if (h2) {
        if (current) built.push(current);
        current = { id: built.length, heading: h2[1].trim(), bullets: [], paragraphs: [] };
        return;
      }
      const bullet = line.match(/^[-*]\s+(.+)/);
      if (bullet && current) {
        const text = bullet[1].trim();
        if (text) current.bullets.push(text);
        return;
      }
      const trimmed = line.trim();
      if (trimmed && !/^#/.test(trimmed)) {
        if (!current) {
          current = { id: built.length, heading: 'Overview', bullets: [], paragraphs: [] };
        }
        current.paragraphs.push(trimmed);
      }
    });
    if (current) built.push(current);
    setSections(built);
    // Derive summary from first section paragraphs if appropriate
    if (built.length && built[0].paragraphs.length) {
      setSummary(built[0].paragraphs.join(' '));
    }
  };

  const fetchInsights = async () => {
    if (!data) return;
    setLoading(true);
    setError(null);
    setInsights([]);
    setSummary('');

    try {
      const csvString = buildCSVString();

      // Build form-data with a pseudo file for compatibility
      const formData = new FormData();
      const blob = new Blob([csvString], { type: 'text/csv' });
      formData.append('file', blob, 'dataset.csv');

  // Use internal API proxy to avoid browser CORS issues
  const res = await fetch('/api/insights', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Server responded ' + res.status + ' ' + res.statusText);
      }

      // Try JSON first
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const json = await res.json();
        parseResponse(JSON.stringify(json));
      } else {
        const text = await res.text();
        parseResponse(text);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data && !autoTriggered) {
      setAutoTriggered(true);
      fetchInsights();
    }
  }, [data, autoTriggered]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center border border-purple-200">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Data Loaded</h2>
          <p className="text-gray-600 mb-6 text-sm">Upload a dataset first to generate AI-driven insights.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-md transition-transform transform hover:scale-105 text-sm"
          >
            Upload Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-1">🤖 AI Insights Assistant</h1>
          <p className="text-purple-100 text-sm">Automatically analyzes your dataset to surface patterns, quality issues, and recommendations.</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white border-x border-b rounded-b-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow">
          <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">Rows: {data.data.length}</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">Columns: {data.headers.length}</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">Auto-run: {autoTriggered ? 'yes' : 'no'}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchInsights}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {loading ? 'Analyzing...' : '🔄 Re-run Analysis'}
            </button>
            <button
              onClick={() => {
                const md = generateMarkdown();
                const blob = new Blob([md], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'neatxl-insights.md';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              disabled={!insights.length && !summary}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-purple-300 text-purple-700 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              📄 Export MD
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateMarkdown());
              }}
              disabled={!insights.length && !summary}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-purple-300 text-purple-700 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              📋 Copy
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-300 text-red-700 text-sm rounded">
                <div className="font-semibold mb-1">Error</div>
                <div>{error}</div>
              </div>
            )}

            {loading && !insights.length && (
              <div className="p-6 bg-white rounded-xl border shadow flex items-center gap-4">
                <div className="animate-spin h-8 w-8 rounded-full border-4 border-purple-300 border-t-purple-600" />
                <div>
                  <p className="font-semibold text-gray-700 text-sm">Analyzing dataset...</p>
                  <p className="text-xs text-gray-500">This may take a few seconds for larger files.</p>
                </div>
              </div>
            )}

            {/* {!loading && !error && insights.length === 0 && rawResponse && (
              <div className="p-4 bg-white rounded-xl border shadow text-xs text-gray-700 whitespace-pre-wrap">
                {rawResponse}
              </div>
            )} */}

            {sections.length > 0 ? (
              <div className="space-y-6">
                {sections.map(section => (
                  <div key={section.id} className="bg-white border rounded-xl shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-bold text-purple-700 tracking-wide flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
                        {section.heading}
                      </h2>
                      <button
                        onClick={() => navigator.clipboard.writeText([
                          section.heading,
                          ...section.paragraphs,
                          ...section.bullets.map(b => '- ' + b)
                        ].join('\n'))}
                        className="text-[10px] px-2 py-1 rounded bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200"
                      >Copy</button>
                    </div>
                    {section.paragraphs.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {section.paragraphs.map((p,i) => (
                          <p key={i} className="text-xs text-gray-700 leading-relaxed">{p}</p>
                        ))}
                      </div>
                    )}
                    {section.bullets.length > 0 && (
                      <ul className="space-y-1">
                        {section.bullets.map((b,i) => (
                          <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                            <span className="flex-1">{renderBullet(b, section.heading)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <>
                {summary && (
                  <div className="p-5 bg-white rounded-xl border shadow">
                    <h2 className="text-sm font-bold text-purple-700 mb-2">High-level Summary</h2>
                    <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
                  </div>
                )}
                {insights.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-sm font-bold text-purple-700 tracking-wide">Insights ({insights.length})</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {insights.map(chunk => (
                        <div key={chunk.id} className="group relative bg-white border border-purple-200 rounded-xl p-4 shadow hover:shadow-md transition-shadow">
                          <button
                            onClick={() => navigator.clipboard.writeText(chunk.text)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-2 py-1 rounded bg-purple-100 text-purple-700 hover:bg-purple-200"
                            title="Copy insight"
                          >
                            Copy
                          </button>
                          <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{chunk.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border shadow p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">📄 Raw Response</h3>
              <div className="h-64 overflow-y-auto text-[11px] bg-gray-50 border rounded p-3 font-mono whitespace-pre-wrap">
                {rawResponse || (loading ? 'Waiting for response...' : 'No response yet.')}
              </div>
            </div>

            <div className="bg-white rounded-xl border shadow p-5 text-xs text-gray-600 space-y-2">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">About</h3>
              <p>NeatXL sends your current dataset to a local LLM endpoint and structures any returned summary or bullet points into cards for quick review.</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Prefers saved/reordered dataset</li>
                <li>Attempts JSON parse, then bullets, then paragraphs</li>
                <li>Export insights as Markdown</li>
                <li>Copy individual insight cards</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function generateMarkdown() {
    let md = `# NeatXL AI Insights\n\n`;
    if (sections.length) {
      sections.forEach(sec => {
        md += `## ${sec.heading}\\n\\n`;
        sec.paragraphs.forEach(p => { md += p + '\\n\\n'; });
        sec.bullets.forEach(b => { md += `- ${b}\\n`; });
        md += '\\n';
      });
    } else {
      if (summary) md += `## Summary\\n\\n${summary}\\n\\n`;
      if (insights.length) {
        md += `## Insights (${insights.length})\\n\\n`;
        insights.forEach((i, idx) => { md += `${idx + 1}. ${i.text}\\n`; });
        md += '\\n';
      }
      if (!summary && !insights.length) md += rawResponse + '\\n';
    }
    return md;
  }

  function renderBullet(text: string, sectionHeading: string) {
    // Detect confidence scores pattern "Label: 95% - ..." or trailing percentage
    const pctMatch = text.match(/(\d{1,3}(?:\.\d+)?)(%)\b/);
    if (sectionHeading.toLowerCase().includes('confidence') && pctMatch) {
      const value = Math.min(100, parseFloat(pctMatch[1]));
      return (
        <div className="w-full space-y-1">
          <div className="flex justify-between items-center text-[10px] text-gray-600">
            <span className="truncate max-w-[160px]">{text.replace(/:(.*)/, '').replace(/\s+\d{1,3}(?:\.\d+)?%.*$/, '').trim()}</span>
            <span className="font-semibold text-purple-600">{value}%</span>
          </div>
          <div className="h-1.5 w-full rounded bg-purple-100 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" style={{ width: value + '%' }} />
          </div>
          <p className="text-[10px] text-gray-500 leading-snug">{text}</p>
        </div>
      );
    }
    return text;
  }
}
