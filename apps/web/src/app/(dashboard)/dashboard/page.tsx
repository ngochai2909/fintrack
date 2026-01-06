export default function DashboardPage() {
  return (
    <div className='min-h-screen bg-slate-900'>
      {/* Header */}
      {/* <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-white">FinTrack</h1>
            <button className="text-slate-400 hover:text-white transition">
              Đăng xuất
            </button>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-slate-800 rounded-xl p-6 border border-slate-700'>
            <p className='text-slate-400 text-sm'>Tổng số dư</p>
            <p className='text-2xl font-bold text-white mt-1'>0 ₫</p>
          </div>
          <div className='bg-slate-800 rounded-xl p-6 border border-slate-700'>
            <p className='text-slate-400 text-sm'>Thu nhập tháng này</p>
            <p className='text-2xl font-bold text-emerald-400 mt-1'>+0 ₫</p>
          </div>
          <div className='bg-slate-800 rounded-xl p-6 border border-slate-700'>
            <p className='text-slate-400 text-sm'>Chi tiêu tháng này</p>
            <p className='text-2xl font-bold text-red-400 mt-1'>-0 ₫</p>
          </div>
        </div>

        {/* Placeholder for transactions */}
        <div className='bg-slate-800 rounded-xl p-6 border border-slate-700'>
          <h2 className='text-lg font-semibold text-white mb-4'>
            Giao dịch gần đây
          </h2>
          <div className='text-center py-12 text-slate-400'>
            <p>Chưa có giao dịch nào</p>
            <p className='text-sm mt-2'>
              Thêm giao dịch đầu tiên để bắt đầu theo dõi
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
