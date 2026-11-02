import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="pl-64">
        <main className="p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  )
}
