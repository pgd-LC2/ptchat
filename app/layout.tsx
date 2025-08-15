import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Devin PT Chat',
  description: 'Next.js + Supabase base configuration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <div className="mx-auto max-w-3xl p-6">
          <header className="mb-8">
            <h1 className="text-2xl font-bold">Devin PT Chat</h1>
            <p className="text-sm text-gray-500">Next.js App Router + Supabase 基础配置</p>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
