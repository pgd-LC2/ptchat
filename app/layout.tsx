import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Devin PT Chat',
  description: 'ChatGPT 界面静态复刻（Phase 2）',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-[#F7F7F8] text-black">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
