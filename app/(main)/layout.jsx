import { Nav } from "./_components/nav";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen pt-20">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r bg-background p-4 lg:block overflow-y-auto">
        <Nav />
      </aside>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b px-4 flex items-center justify-between z-40">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <Nav />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {children}
      </main>
    </div>
  );
} 