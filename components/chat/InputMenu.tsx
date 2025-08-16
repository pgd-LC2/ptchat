'use client';

import { Paperclip, Book, Image, Lightbulb, Telescope, MoreHorizontal, ChevronRight } from 'lucide-react';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

export default function InputMenu({ isVisible, onClose }: Props) {
  if (!isVisible) return null;

  const menuItems = [
    {
      icon: Paperclip,
      label: '添加照片和文件',
      disabled: false,
    },
    {
      icon: Book,
      label: '研究与学习',
      disabled: false,
    },
    {
      icon: Image,
      label: '创建图片',
      disabled: false,
    },
    {
      icon: Lightbulb,
      label: '思考时间更长',
      disabled: false,
    },
    {
      icon: Telescope,
      label: '深度研究',
      subtitle: '5 将在 8月28日 可用',
      disabled: true,
    },
  ];

  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 z-10"
        onClick={onClose}
      />
      
      {/* 菜单内容 */}
      <div className="absolute bottom-full mb-3 left-0 z-50 w-80 rounded-2xl border border-zinc-300 bg-white shadow-xl overflow-hidden">
        <div className="p-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              type="button"
              disabled={item.disabled}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors text-black ${
                item.disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-zinc-100'
              }`}
              onClick={() => {
                if (!item.disabled) {
                  // 这里可以添加具体的功能
                  console.log(`Clicked: ${item.label}`);
                  onClose();
                }
              }}
            >
              <item.icon className="h-5 w-5 text-black/60" />
              <div className="flex-1">
                <div className="text-black font-medium">
                  {item.label}
                </div>
                {item.subtitle && (
                  <div className="text-xs text-black/60 mt-0.5">
                    {item.subtitle}
                  </div>
                )}
              </div>
            </button>
          ))}
          
          {/* 更多选项 */}
          <button
            type="button"
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-black hover:bg-zinc-100 transition-colors"
            onClick={() => {
              console.log('Clicked: 更多');
              onClose();
            }}
          >
            <MoreHorizontal className="h-5 w-5 text-black/60" />
            <div className="flex-1 text-black font-medium">更多</div>
            <ChevronRight className="h-4 w-4 text-black/60" />
          </button>
        </div>
      </div>
    </>
  );
}