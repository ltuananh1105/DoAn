const safeFilename = (filename, fallback = 'bao_cao') => {
  const cleaned = String(filename || fallback).replace(/[<>:"/\\|?*]/g, '_')
    .split('').map((char) => char.charCodeAt(0) < 32 ? '_' : char).join('').trim();
  return cleaned || fallback;
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

const cellValue = (column, row) => column.format ? column.format(row[column.key], row) : row[column.key];
export const formatExportValue = (column, row) => cellValue(column, row);
const protectSpreadsheetFormula = (value) => /^[=+\-@]/.test(value) ? `'${value}` : value;
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);

export const exportToCSV = (columns, data, filename = 'export.csv') => {
  const headers = columns.map((col) => `"${col.label.replace(/"/g, '""')}"`).join(',');
  const rows = data.map((row) =>
    columns
      .map((col) => {
        let val = cellValue(col, row);
        if (val === null || val === undefined) val = '';
        val = protectSpreadsheetFormula(String(val)).replace(/"/g, '""');
        return `"${val}"`;
      })
      .join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const name = safeFilename(filename);
  downloadBlob(blob, name.endsWith('.csv') ? name : `${name}.csv`);
};

export const exportToJSON = (data, filename = 'export.json') => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const name = safeFilename(filename);
  downloadBlob(blob, name.endsWith('.json') ? name : `${name}.json`);
};

export const exportToTXT = (columns, data, filename = 'export.txt') => {
  let txtContent = '';
  // Headers
  txtContent += columns.map((col) => col.label).join('\t') + '\n';
  txtContent += '-'.repeat(100) + '\n';

  // Rows
  data.forEach((row) => {
    txtContent += columns.map((col) => cellValue(col, row) ?? '').join('\t') + '\n';
  });

  const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
  const name = safeFilename(filename);
  downloadBlob(blob, name.endsWith('.txt') ? name : `${name}.txt`);
};

export const exportToPDF = ({
  title = 'BÁO CÁO HỆ THỐNG',
  subtitle = 'Nền tảng đào tạo trực tuyến LearnUp',
  footerNote = 'Báo cáo được trích xuất tự động từ hệ thống quản trị LearnUp.',
  columns = [],
  data = [],
}) => {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert('Vui lòng cho phép mở popup để in / xuất tài liệu PDF!');
    return;
  }

  const currentDate = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const html = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <title>${escapeHtml(title)}</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
          margin: 0;
          padding: 20px;
          line-height: 1.5;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 15px;
          margin-bottom: 25px;
        }
        .brand { font-size: 24px; font-weight: 800; color: #2563eb; letter-spacing: -0.5px; }
        .date { font-size: 12px; color: #64748b; margin-top: 4px; }
        .report-title { text-align: center; margin-bottom: 25px; }
        .report-title h1 { font-size: 22px; font-weight: 700; margin: 0; color: #0f172a; text-transform: uppercase; }
        .report-title p { font-size: 14px; color: #64748b; margin: 6px 0 0 0; }
        
        .meta-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px 18px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          font-size: 12px;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 8px 12px;
          text-align: left;
        }
        th {
          background-color: #f1f5f9;
          font-weight: 600;
          color: #1e293b;
        }
        tr:nth-child(even) { background-color: #fafafa; }
        
        .footer-note {
          font-size: 12px;
          font-style: italic;
          color: #64748b;
          margin-top: 20px;
        }
        
        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          page-break-inside: avoid;
        }
        .signature-col {
          text-align: center;
          width: 200px;
        }
        .signature-title { font-weight: 700; font-size: 13px; margin-bottom: 60px; }
        .signature-line { border-top: 1px dashed #94a3b8; padding-top: 5px; font-size: 12px; color: #64748b; }

        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">🎓 LearnUp Education</div>
          <div class="date">Hệ thống Quản lý Đào tạo Trực tuyến</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 12px; font-weight: 600; color: #475569;">Thời gian xuất báo cáo:</div>
          <div class="date">${currentDate}</div>
        </div>
      </div>

      <div class="report-title">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(subtitle)}</p>
      </div>

      <div class="meta-box">
        <div><strong>Tổng số bản ghi:</strong> ${data.length} hàng dữ liệu</div>
        <div><strong>Trạng thái:</strong> Chính thức</div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">STT</th>
            ${columns.map((col) => `<th>${escapeHtml(col.label)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row, idx) => `
            <tr>
              <td style="text-align: center; color: #64748b;">${idx + 1}</td>
              ${columns
                .map((col) => {
                  const val = cellValue(col, row);
                  return `<td>${escapeHtml(val)}</td>`;
                })
                .join('')}
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      ${footerNote ? `<div class="footer-note">📌 Ghi chú: ${escapeHtml(footerNote)}</div>` : ''}

      <div class="signatures">
        <div class="signature-col">
          <div class="signature-title">Người lập biểu</div>
          <div class="signature-line">(Ký và ghi rõ họ tên)</div>
        </div>
        <div class="signature-col">
          <div class="signature-title">Xác nhận đơn vị</div>
          <div class="signature-line">(Ký tên và đóng dấu)</div>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};
