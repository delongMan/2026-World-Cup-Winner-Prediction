import { useState } from 'react';
import { exportPredictionImage } from '../utils/exportImage';

export function ExportButton() {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      await exportPredictionImage();
    } catch (err) {
      console.error('Export failed:', err);
    }
    setExporting(false);
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="px-4 py-2 bg-accent-gold text-bg-primary font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 text-sm"
    >
      {exporting ? '导出中...' : '📸 导出结果'}
    </button>
  );
}
