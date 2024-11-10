import Header from "../Components/Header"
export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed flex h-full min-h-screen flex-col overflow-y-auto overflow-x-hidden bg-background">
      <Header />
      <div className="w-full overflow-auto">{children}</div>
    </div>
  )
}
