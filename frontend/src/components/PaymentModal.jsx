export default function PaymentModal({ isOpen, course, onClose, onVNPay, onDemoPay, loading }) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
      <div className="flex items-start justify-between border-b px-6 py-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Thanh toán</p><h2 className="mt-1 text-lg font-bold text-slate-900">Xác nhận đăng ký khóa học</h2></div><button onClick={onClose} disabled={loading} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100">✕</button></div>
      <div className="px-6 py-5"><div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Khóa học</p><p className="mt-1 font-semibold text-slate-900">{course?.title}</p><div className="mt-4 flex items-end justify-between border-t border-slate-200 pt-4"><span className="text-sm text-slate-600">Tổng thanh toán</span><strong className="text-xl text-slate-900">{course?.price?.toLocaleString('vi-VN')} ₫</strong></div></div>
        <p className="mb-2 mt-5 text-sm font-semibold text-slate-800">Phương thức thanh toán</p><div className="space-y-2"><PaymentOption label="VNPay" description="Thẻ ATM, Visa, MasterCard hoặc QR" code="VN" onClick={onVNPay} disabled={loading}/><PaymentOption label="Thanh toán mô phỏng" description="Dùng để kiểm thử trong môi trường demo" code="DEMO" onClick={onDemoPay} disabled={loading}/></div>
        {loading && <p className="mt-4 text-center text-sm text-slate-500">Đang xử lý giao dịch...</p>}
      </div>
      <div className="border-t bg-slate-50 px-6 py-4"><button onClick={onClose} disabled={loading} className="ui-button ui-button-secondary w-full">Hủy</button></div>
    </div>
  </div>;
}

function PaymentOption({ label, description, code, onClick, disabled }) { return <button type="button" onClick={onClick} disabled={disabled} className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50"><span className="flex h-10 w-12 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700">{code}</span><span className="flex-1"><b className="block text-sm text-slate-900">{label}</b><span className="text-xs text-slate-500">{description}</span></span><span className="text-slate-400">›</span></button>; }
