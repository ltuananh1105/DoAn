export default function PaymentModal({ isOpen, course, onClose, onConfirm, loading }) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
      <div className="flex items-start justify-between border-b px-6 py-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Thanh toán</p><h2 className="mt-1 text-lg font-bold text-slate-900">Xác nhận đăng ký khóa học</h2></div><button onClick={onClose} disabled={loading} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100">✕</button></div>
      <div className="px-6 py-5"><div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Khóa học</p><p className="mt-1 font-semibold text-slate-900">{course?.title}</p><div className="mt-4 flex items-end justify-between border-t border-slate-200 pt-4"><span className="text-sm text-slate-600">Tổng thanh toán</span><strong className="text-xl text-slate-900">{course?.price?.toLocaleString('vi-VN')} ₫</strong></div></div>
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-semibold text-amber-900">Thanh toán mô phỏng</p><p className="mt-1 text-xs leading-5 text-amber-800">Không phát sinh giao dịch thật. Hệ thống sẽ tạo đơn demo và kích hoạt khóa học ngay sau khi xác nhận.</p></div>
        {loading && <p className="mt-4 text-center text-sm text-slate-500">Đang xử lý giao dịch...</p>}
      </div>
      <div className="flex gap-3 border-t bg-slate-50 px-6 py-4"><button onClick={onClose} disabled={loading} className="ui-button ui-button-secondary flex-1">Hủy</button><button onClick={onConfirm} disabled={loading} className="ui-button ui-button-primary flex-1">{loading ? 'Đang xử lý...' : 'Xác nhận demo'}</button></div>
    </div>
  </div>;
}
