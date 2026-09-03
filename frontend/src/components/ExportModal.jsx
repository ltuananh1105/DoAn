import { useState, useEffect } from 'react';
import { exportToCSV, exportToJSON, exportToTXT, exportToPDF, formatExportValue } from '../utils/exportUtils';

export default function ExportModal({
  isOpen,
  onClose,
  data = [],
  columns = [],
  defaultFilename = 'bao_cao',
  defaultTitle = 'BÁO CÁO THỐNG KÊ CHI TIẾT',
  defaultSubtitle = 'Hệ thống Quản lý Đào tạo Trực tuyến LearnUp',
}) {
  const [format, setFormat] = useState('csv');
  const [filename, setFilename] = useState(defaultFilename);
  const [title, setTitle] = useState(defaultTitle);
  const [subtitle, setSubtitle] = useState(defaultSubtitle);
  const [footerNote, setFooterNote] = useState('Báo cáo được trích xuất từ hệ thống LearnUp.');
  const [selectedColKeys, setSelectedColKeys] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setFilename(defaultFilename);
      setTitle(defaultTitle);
      setSubtitle(defaultSubtitle);
      setSelectedColKeys(columns.map((c) => c.key));
    }
  }, [isOpen, defaultFilename, defaultTitle, defaultSubtitle, columns]);

  if (!isOpen) return null;

  const toggleColumn = (key) => {
    if (selectedColKeys.includes(key)) {
      if (selectedColKeys.length === 1) {
        alert('Phải giữ lại ít nhất 1 cột dữ liệu!');
        return;
      }
      setSelectedColKeys(selectedColKeys.filter((k) => k !== key));
    } else {
      setSelectedColKeys([...selectedColKeys, key]);
    }
  };

  const selectAll = () => setSelectedColKeys(columns.map((c) => c.key));
  const deselectAll = () => {
    if (columns.length > 0) {
      setSelectedColKeys([columns[0].key]);
    }
  };

  const activeColumns = columns.filter((col) => selectedColKeys.includes(col.key));
  const previewData = data.slice(0, 3);

  const handleExport = () => {
    if (data.length === 0) {
      alert('Không có dữ liệu phù hợp để xuất báo cáo.');
      return;
    }
    if (activeColumns.length === 0) {
      alert('Vui lòng chọn ít nhất một cột dữ liệu để xuất!');
      return;
    }

    if (format === 'csv') {
      exportToCSV(activeColumns, data, filename);
    } else if (format === 'pdf') {
      exportToPDF({
        title,
        subtitle,
        footerNote,
        columns: activeColumns,
        data,
      });
    } else if (format === 'json') {
      // Chỉ xuất các thuộc tính được chọn
      const filteredJson = data.map((row) => {
        const item = {};
        activeColumns.forEach((c) => {
          item[c.label] = formatExportValue(c, row);
        });
        return item;
      });
      exportToJSON(filteredJson, filename);
    } else if (format === 'txt') {
      exportToTXT(activeColumns, data, filename);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold">Tùy chỉnh Xuất Báo Cáo</h3>
              <p className="text-xs text-blue-100">Chọn định dạng, cột dữ liệu và thông tin tiêu đề</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* BODY (SCROLLABLE) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-700">

          {/* 1. ĐỊNH DẠNG FILE */}
          <div>
            <label className="block font-bold text-gray-900 mb-2.5 flex items-center gap-1.5">
              <span>1. Chọn định dạng file xuất</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition text-center ${
                  format === 'csv'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={format === 'csv'}
                  onChange={(e) => setFormat(e.target.value)}
                  className="sr-only"
                />
                <span className="text-2xl mb-1">📗</span>
                <span className="text-xs">Excel / CSV (.csv)</span>
              </label>

              <label
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition text-center ${
                  format === 'pdf'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={format === 'pdf'}
                  onChange={(e) => setFormat(e.target.value)}
                  className="sr-only"
                />
                <span className="text-2xl mb-1">📄</span>
                <span className="text-xs">Tài liệu PDF / In A4</span>
              </label>

              <label
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition text-center ${
                  format === 'json'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="json"
                  checked={format === 'json'}
                  onChange={(e) => setFormat(e.target.value)}
                  className="sr-only"
                />
                <span className="text-2xl mb-1">📋</span>
                <span className="text-xs">Dữ liệu JSON (.json)</span>
              </label>

              <label
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition text-center ${
                  format === 'txt'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="txt"
                  checked={format === 'txt'}
                  onChange={(e) => setFormat(e.target.value)}
                  className="sr-only"
                />
                <span className="text-2xl mb-1">📝</span>
                <span className="text-xs">Văn bản Tab (.txt)</span>
              </label>
            </div>
          </div>

          {/* 2. CHỌN CỘT DỮ LIỆU */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="font-bold text-gray-900">2. Lựa chọn các cột muốn xuất ({activeColumns.length}/{columns.length})</label>
              <div className="space-x-2 text-xs">
                <button type="button" onClick={selectAll} className="text-blue-600 hover:underline font-medium">Chọn tất cả</button>
                <span className="text-gray-300">|</span>
                <button type="button" onClick={deselectAll} className="text-gray-500 hover:underline">Bỏ chọn</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50 p-3.5 rounded-xl border border-gray-200/80">
              {columns.map((col) => {
                const checked = selectedColKeys.includes(col.key);
                return (
                  <label
                    key={col.key}
                    className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition ${
                      checked ? 'bg-white shadow-xs font-medium text-gray-900' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleColumn(col.key)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs">{col.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 3. TÙY CHỈNH THÔNG TIN BÁO CÁO */}
          <div className="space-y-3 pt-1">
            <label className="block font-bold text-gray-900">3. Chỉnh sửa thông tin báo cáo</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tên file tải về</label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nhập tên tệp..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tiêu đề báo cáo (trên PDF / Header)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Tiêu đề báo cáo..."
                />
              </div>
            </div>

            {format === 'pdf' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phụ đề văn bản</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Phụ đề..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Ghi chú chân trang</label>
                  <input
                    type="text"
                    value={footerNote}
                    onChange={(e) => setFooterNote(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ghi chú thêm..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. XEM TRƯỚC BẢNG (LIVE PREVIEW) */}
          <div>
            <label className="block font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <span>4. Xem trước trực tiếp (3 dòng mẫu)</span>
            </label>
            <div className="border border-gray-200 rounded-xl overflow-x-auto shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100/80 border-b">
                  <tr>
                    <th className="px-3 py-2 text-gray-600 font-semibold w-10 text-center">#</th>
                    {activeColumns.map((c) => (
                      <th key={c.key} className="px-3 py-2 text-gray-700 font-semibold">{c.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {previewData.map((row, idx) => (
                    <tr key={idx} className="bg-white hover:bg-gray-50">
                      <td className="px-3 py-2 text-center text-gray-400 font-mono">{idx + 1}</td>
                      {activeColumns.map((c) => (
                        <td key={c.key} className="px-3 py-2 text-gray-700 max-w-[200px] truncate">
                          {formatExportValue(c, row) !== undefined && formatExportValue(c, row) !== null ? String(formatExportValue(c, row)) : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {previewData.length === 0 && (
                    <tr>
                      <td colSpan={activeColumns.length + 1} className="p-4 text-center text-gray-400">
                        Không có dữ liệu mẫu.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Tổng cộng: <strong className="text-gray-800">{data.length}</strong> bản ghi sẽ được xuất
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition shadow-2xs"
            >
              Hủy
            </button>
            <button
              onClick={handleExport}
              disabled={data.length === 0}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-1.5 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {format === 'pdf' ? 'In / Xuất PDF' : 'Tải về máy'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
