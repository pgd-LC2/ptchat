'use client';

import { useState } from 'react';
import { Mic, Plus } from 'lucide-react';
import InputMenu from './InputMenu';

// 自定义麦克风图标
function MicrophoneIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M15.7806 10.1963C16.1326 10.3011 16.3336 10.6714 16.2288 11.0234L16.1487 11.2725C15.3429 13.6262 13.2236 15.3697 10.6644 15.6299L10.6653 16.835H12.0833L12.2171 16.8486C12.5202 16.9106 12.7484 17.1786 12.7484 17.5C12.7484 17.8214 12.5202 18.0894 12.2171 18.1514L12.0833 18.165H7.91632C7.5492 18.1649 7.25128 17.8672 7.25128 17.5C7.25128 17.1328 7.5492 16.8351 7.91632 16.835H9.33527L9.33429 15.6299C6.775 15.3697 4.6558 13.6262 3.84992 11.2725L3.76984 11.0234L3.74445 10.8906C3.71751 10.5825 3.91011 10.2879 4.21808 10.1963C4.52615 10.1047 4.84769 10.2466 4.99347 10.5195L5.04523 10.6436L5.10871 10.8418C5.8047 12.8745 7.73211 14.335 9.99933 14.335C12.3396 14.3349 14.3179 12.7789 14.9534 10.6436L15.0052 10.5195C15.151 10.2466 15.4725 10.1046 15.7806 10.1963ZM12.2513 5.41699C12.2513 4.17354 11.2437 3.16521 10.0003 3.16504C8.75675 3.16504 7.74835 4.17343 7.74835 5.41699V9.16699C7.74853 10.4104 8.75685 11.418 10.0003 11.418C11.2436 11.4178 12.2511 10.4103 12.2513 9.16699V5.41699ZM13.5814 9.16699C13.5812 11.1448 11.9781 12.7479 10.0003 12.748C8.02232 12.748 6.41845 11.1449 6.41828 9.16699V5.41699C6.41828 3.43889 8.02221 1.83496 10.0003 1.83496C11.9783 1.83514 13.5814 3.439 13.5814 5.41699V9.16699Z"
        fill="currentColor"
      />
    </svg>
  );
}

// 自定义向上箭头图标
function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.99992 16V6.41407L5.70696 9.70704C5.31643 10.0976 4.68342 10.0976 4.29289 9.70704C3.90237 9.31652 3.90237 8.6835 4.29289 8.29298L9.29289 3.29298L9.36907 3.22462C9.76184 2.90427 10.3408 2.92686 10.707 3.29298L15.707 8.29298L15.7753 8.36915C16.0957 8.76192 16.0731 9.34092 15.707 9.70704C15.3408 10.0732 14.7618 10.0958 14.3691 9.7754L14.2929 9.70704L10.9999 6.41407V16C10.9999 16.5523 10.5522 17 9.99992 17C9.44764 17 8.99992 16.5523 8.99992 16Z"
        fill="currentColor"
      />
    </svg>
  );
}

type Props = {
  className?: string;
  value: string;
  disabled?: boolean;
  isWelcomeScreen?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function ChatInput({ className, value, disabled, isWelcomeScreen = false, onChange, onSubmit }: Props) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const handleFeatureSelect = (feature: string) => {
    setSelectedFeature(feature);
    setIsMenuVisible(false);
  };

  const handleClearFeature = () => {
    setSelectedFeature(null);
  };

  return (
    <div className={`relative w-full mx-auto ${isWelcomeScreen ? 'max-w-[820px]' : 'max-w-[720px] pb-3 px-6'} ${className || ''}`}>
      <InputMenu 
        isVisible={isMenuVisible} 
        onClose={() => setIsMenuVisible(false)}
        onFeatureSelect={handleFeatureSelect}
      />
      
      <form
        className={`${selectedFeature ? 'flex flex-col gap-3' : 'flex items-center gap-2'} rounded-[40px] overflow-hidden border border-zinc-200 bg-white px-4 py-3 shadow-sm hover:border-zinc-300 focus-within:border-zinc-400 ${selectedFeature ? 'min-h-[100px]' : 'min-h-[52px]'} ${isWelcomeScreen ? 'mx-4' : ''}`}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
      >
        {selectedFeature ? (
          <>
            {/* 第一行：纯输入框 */}
            <div className="w-full">
              <textarea
                name="input"
                value={value}
                onChange={onChange}
                placeholder="询问任何问题"
                rows={1}
                onInput={(e) => {
                  const ta = e.currentTarget;
                  ta.style.height = 'auto';
                  ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const form = e.currentTarget.form;
                    if (form && e.currentTarget.value.trim().length > 0 && !disabled) {
                      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                    }
                  }
                }}
                className="w-full resize-none bg-transparent outline-none placeholder:text-black/60 leading-6 py-1 text-base font-normal"
              />
            </div>
            
            {/* 第二行：加号 功能标签+关闭按钮 语音 发送 */}
            <div className="flex items-center gap-2">
              {/* 加号最左边 */}
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-black/60 hover:bg-zinc-50 flex-shrink-0"
                aria-label="更多选项"
                onClick={() => setIsMenuVisible(!isMenuVisible)}
              >
                <Plus className="h-5 w-5 text-black" />
              </button>
              
              {/* 功能标签+关闭按钮 */}
              <div className="flex-1 flex items-center gap-2">
                <span className="text-sm font-medium text-blue-600">
                  {selectedFeature}
                </span>
                <button
                  type="button"
                  className="text-black/60 hover:text-black text-sm"
                  onClick={handleClearFeature}
                >
                  ✕
                </button>
              </div>
              
              {/* 语音和发送按钮 */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-50"
                  aria-label="语音"
                >
                  <MicrophoneIcon className="h-5 w-5 text-black" />
                </button>
                <button
                  type="submit"
                  disabled={disabled || value.trim().length === 0}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
                    disabled
                      ? 'bg-[#E5F3FF] text-[#0285FF]'
                      : value.trim().length === 0 
                      ? 'bg-zinc-100 text-black/60 cursor-not-allowed'
                      : 'bg-[#0285FF] text-white hover:bg-[#0264CC]'
                  }`}
                  aria-label="发送"
                >
                  <ArrowUpIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 左侧加号按钮 */}
            <button
              type="button"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-black/60 hover:bg-zinc-50 flex-shrink-0 ${isWelcomeScreen ? 'bg-zinc-100' : ''}`}
              aria-label="更多选项"
              onClick={() => setIsMenuVisible(!isMenuVisible)}
            >
              <Plus className="h-5 w-5 text-black" />
            </button>
            
            {/* 中间输入框 */}
            <div className="flex-1">
              <textarea
                name="input"
                value={value}
                onChange={onChange}
                placeholder="询问任何问题"
                rows={1}
                onInput={(e) => {
                  const ta = e.currentTarget;
                  ta.style.height = 'auto';
                  ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const form = e.currentTarget.form;
                    if (form && e.currentTarget.value.trim().length > 0 && !disabled) {
                      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                    }
                  }
                }}
                className="w-full resize-none bg-transparent outline-none placeholder:text-black/60 leading-6 py-1 text-base font-normal"
              />
            </div>
            
            {/* 语音按钮 */}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-50 flex-shrink-0"
              aria-label="语音"
            >
              <MicrophoneIcon className="h-5 w-5 text-black" />
            </button>
            
            {/* 发送按钮 */}
            <button
              type="submit"
              disabled={disabled || value.trim().length === 0}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0 ${
                disabled
                  ? 'bg-[#E5F3FF] text-[#0285FF]'
                  : value.trim().length === 0 
                  ? 'bg-zinc-100 text-black/60 cursor-not-allowed'
                  : 'bg-[#0285FF] text-white hover:bg-[#0264CC]'
              }`}
              aria-label="发送"
            >
              <ArrowUpIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </form>
      {!isWelcomeScreen && (
        <div className="mt-1 text-center text-sm font-normal text-black/60">
          按 Enter 发送，Shift+Enter 换行
        </div>
      )}
    </div>
  );
}
