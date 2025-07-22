import React from 'react';

export default function LawBox({ title, text, sourceUrl }: { title: string, text: string, sourceUrl?: string }) {
  return (
    <aside className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6 rounded">
      <div className="font-bold mb-2">⚖️ {title}</div>
      <blockquote className="italic text-gray-700">{text}</blockquote>
      {sourceUrl && (
        <a href={sourceUrl} target="_blank" rel="noopener" className="text-blue-700 underline text-sm block mt-2">
          Voir le texte officiel
        </a>
      )}
    </aside>
  );
} 