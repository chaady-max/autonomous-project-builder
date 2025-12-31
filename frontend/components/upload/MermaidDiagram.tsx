'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  title?: string;
}

export default function MermaidDiagram({ chart, title }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'monospace',
    });
  }, []);

  useEffect(() => {
    if (containerRef.current && chart) {
      const renderDiagram = async () => {
        try {
          const { svg } = await mermaid.render(id.current, chart);
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = `
              <div class="text-red-600 p-4 border border-red-300 rounded bg-red-50">
                <p class="font-semibold">Diagram rendering error</p>
                <pre class="mt-2 text-xs overflow-auto">${(error as Error).message}</pre>
              </div>
            `;
          }
        }
      };

      renderDiagram();
    }
  }, [chart]);

  return (
    <div className="border rounded-lg p-4 bg-white">
      {title && <h4 className="text-sm font-semibold mb-3 text-gray-700">{title}</h4>}
      <div ref={containerRef} className="overflow-auto"></div>
    </div>
  );
}
