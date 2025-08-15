'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <p className="text-base">
        仓库已初始化，包含 Supabase 基础配置与健康检查 API。
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          环境变量模板在 <code>.env.example</code>，复制为 <code>.env</code> 并填写值。
        </li>
        <li>
          访问 <Link href="/api/health" className="text-blue-600 underline">/api/health</Link> 可验证配置。
        </li>
      </ul>
    </div>
  );
}
