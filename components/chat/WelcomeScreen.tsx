type Props = {
  className?: string;
};

export default function WelcomeScreen({ className }: Props) {
  return (
    <section className={`w-full py-10 ${className || ''}`}>
      <h2 className="text-3xl font-semibold text-zinc-900">ChatGPT</h2>
      <p className="mt-2 text-sm text-zinc-500">开始对话，或选择一个示例提示。</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {['写代码', '制定计划', '总结文本', '给我惊喜', '更多'].map((t) => (
          <button
            key={t}
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            {t}
          </button>
        ))}
      </div>
    </section>
  );
}
