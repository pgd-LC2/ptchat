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
      <div className="absolute bottom-full mb-2 left-6 z-20 w-56 rounded-3xl border border-zinc-200 bg-white shadow-lg overflow-hidden">
        <div className="p-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              <button
                type="button"
                disabled={item.disabled}
                className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left transition-colors ${
                  item.disabled 
                    ? 'text-black/60 cursor-not-allowed' 
                    : 'text-black hover:bg-zinc-50'
                }`}
                onClick={() => {
                  if (!item.disabled) {
                    // 这里可以添加具体的功能
                    console.log(`Clicked: ${item.label}`);
                    onClose();
                  }
                }}
              >
                <item.icon className={`h-5 w-5 ${item.disabled ? 'text-black/60' : 'text-black/60'}`} />
                <div className="flex-1">
                  <div className={`text-sm font-normal ${item.disabled ? 'text-black/60' : 'text-black'}`}>
                    {item.label}
                  </div>
                  {item.subtitle && (
                    <div className="text-xs text-black/60 mt-1 font-normal">
                      {item.subtitle}
                    </div>
                  )}
                </div>
              </button>
              {index === 0 && (
                <div className="mx-2 my-1 border-t border-zinc-200"></div>
              )}
            </div>
          ))}
          
          {/* 更多选项前的分隔线 */}
          <div className="mx-2 my-1 border-t border-zinc-200"></div>
          
          {/* 更多选项 */}
          <button
            type="button"
            className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-black hover:bg-zinc-50 transition-colors font-normal"
            onClick={() => {
              console.log('Clicked: 更多');
              onClose();
            }}
          >
            <MoreHorizontal className="h-5 w-5 text-black/60" />
            <div className="flex-1 text-sm text-black font-normal">更多</div>
            <ChevronRight className="h-4 w-4 text-black/60" />
          </button>
        </div>
      </div>
    </>
  );
}