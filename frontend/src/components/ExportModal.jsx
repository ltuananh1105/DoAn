import { useEffect, useMemo, useState } from 'react';
import { exportToExcel, exportToPDF, formatExportValue } from '../utils/exportUtils';

const formats = [
  { value: 'xlsx', label: 'Excel', ext: '.xlsx', note: 'Bảng dữ liệu có định dạng, bộ lọc và dòng tổng hợp' },
  { value: 'pdf', label: 'PDF', ext: '.pdf', note: 'Văn bản A4 hoàn chỉnh để lưu trữ hoặc in' },
];

export default function ExportModal({ isOpen, onClose, data = [], columns = [], defaultFilename = 'bao_cao', defaultTitle = 'BÁO CÁO THỐNG KÊ', defaultSubtitle = 'Hệ thống đào tạo trực tuyến LearnUp' }) {
  const [format, setFormat] = useState('xlsx');
  const [filename, setFilename] = useState(defaultFilename);
  const [title, setTitle] = useState(defaultTitle);
  const [subtitle, setSubtitle] = useState(defaultSubtitle);
  const [preparedBy, setPreparedBy] = useState('Quản trị viên hệ thống');
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [busy, setBusy] = useState(false);
  const previewColumns = useMemo(() => columns.slice(0, 5), [columns]);
  const previewData = useMemo(() => data.slice(0, 4), [data]);

  useEffect(() => {
    if (isOpen) { setFormat('xlsx'); setFilename(defaultFilename); setTitle(defaultTitle); setSubtitle(defaultSubtitle); setPreparedBy('Quản trị viên hệ thống'); setIncludeSignatures(true); }
  }, [isOpen, defaultFilename, defaultTitle, defaultSubtitle]);
  if (!isOpen) return null;

  const handleExport = async () => {
    if (!data.length || busy) return;
    setBusy(true);
    try {
      const report = { title: title.trim() || defaultTitle, subtitle: subtitle.trim(), preparedBy: preparedBy.trim() || 'Hệ thống LearnUp', generatedAt: new Date(), columns, data, filename, includeSignatures };
      if (format === 'xlsx') await exportToExcel(report); else exportToPDF(report);
      onClose();
    } catch (error) { console.error(error); alert(error.message || 'Không thể tạo báo cáo. Vui lòng thử lại.'); }
    finally { setBusy(false); }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
    <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
      <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
        <div><div className="mb-1 text-xs font-bold tracking-widest text-blue-600">TRUNG TÂM BÁO CÁO</div><h2 className="text-xl font-bold text-slate-900">Xuất báo cáo</h2><p className="mt-1 text-sm text-slate-500">Tạo tài liệu chính thức từ dữ liệu đang hiển thị.</p></div>
        <button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">✕</button>
      </header>
      <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[1fr_1.15fr]">
        <section className="space-y-5 border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
          <div><label className="mb-2 block text-sm font-semibold text-slate-800">Loại tài liệu</label><div className="grid grid-cols-2 gap-3">
            {formats.map((item) => <button type="button" key={item.value} onClick={() => setFormat(item.value)} className={`rounded-xl border p-4 text-left transition ${format === item.value ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'}`}><div className="flex justify-between"><b>{item.label}</b><span className={`rounded px-2 py-1 text-[11px] font-bold ${item.value === 'xlsx' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{item.ext}</span></div><p className="mt-2 text-xs leading-5 text-slate-500">{item.note}</p></button>)}
          </div></div>
          <div className="space-y-3">
            <Field label="Tên báo cáo" value={title} onChange={setTitle} />
            <Field label="Mô tả / kỳ báo cáo" value={subtitle} onChange={setSubtitle} />
            <Field label="Người lập báo cáo" value={preparedBy} onChange={setPreparedBy} />
            <div><label className="mb-1.5 block text-sm font-semibold text-slate-700">Tên tệp</label><div className="flex overflow-hidden rounded-lg border border-slate-300 focus-within:ring-2 focus-within:ring-blue-100"><input value={filename} onChange={(e) => setFilename(e.target.value)} className="min-w-0 flex-1 px-3 py-2.5 text-sm outline-none"/><span className="border-l bg-slate-50 px-3 py-2.5 text-sm text-slate-500">{format === 'xlsx' ? '.xlsx' : '.pdf'}</span></div></div>
          </div>
          {format === 'pdf' && <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-slate-50 p-3"><input type="checkbox" checked={includeSignatures} onChange={(e) => setIncludeSignatures(e.target.checked)} className="mt-0.5 h-4 w-4"/><span><b className="block text-sm">Khu vực ký xác nhận</b><span className="text-xs text-slate-500">Thêm vị trí ký của người lập và đơn vị xác nhận.</span></span></label>}
        </section>
        <section className="bg-slate-50 p-6">
          <div className="mb-3 flex items-center justify-between"><div><h3 className="text-sm font-bold">Xem trước dữ liệu</h3><p className="text-xs text-slate-500">4 dòng đầu tiên của báo cáo</p></div><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm">{data.length.toLocaleString('vi-VN')} bản ghi</span></div>
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm"><div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-4 text-white"><div className="text-xs font-bold tracking-widest text-blue-100">LEARNUP EDUCATION</div><div className="mt-2 font-bold">{title}</div><div className="mt-1 text-xs text-blue-100">{subtitle}</div></div><div className="overflow-x-auto"><table className="min-w-full text-left text-xs"><thead className="border-b bg-slate-50"><tr><th className="px-3 py-2.5">STT</th>{previewColumns.map(c => <th key={c.key} className="whitespace-nowrap px-3 py-2.5">{c.label}</th>)}</tr></thead><tbody className="divide-y">{previewData.map((row, i) => <tr key={i}><td className="px-3 py-2.5 text-center text-slate-400">{i + 1}</td>{previewColumns.map(c => <td key={c.key} className="max-w-40 truncate whitespace-nowrap px-3 py-2.5">{String(formatExportValue(c, row) ?? '—')}</td>)}</tr>)}{!previewData.length && <tr><td colSpan={previewColumns.length + 1} className="p-8 text-center text-slate-400">Không có dữ liệu trong phạm vi đã chọn.</td></tr>}</tbody></table></div>{columns.length > 5 && <div className="border-t px-4 py-2 text-center text-[11px] text-slate-400">Và {columns.length - 5} cột khác trong tệp xuất</div>}</div>
          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-blue-800">Báo cáo ghi thời điểm xuất, người lập, tổng số bản ghi và toàn bộ dữ liệu theo bộ lọc hiện tại.</div>
        </section>
      </div>
      <footer className="flex items-center border-t px-6 py-4"><span className="hidden text-xs text-slate-500 sm:block">Dữ liệu được lấy tại thời điểm tạo báo cáo</span><div className="ml-auto flex gap-3"><button type="button" onClick={onClose} className="rounded-lg border px-4 py-2.5 text-sm font-semibold">Hủy</button><button type="button" onClick={handleExport} disabled={!data.length || busy} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-slate-300">{busy ? 'Đang tạo...' : `Xuất ${format === 'xlsx' ? 'Excel' : 'PDF'}`}</button></div></footer>
    </div>
  </div>;
}

function Field({ label, value, onChange }) { return <div><label className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label><input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/></div>; }
