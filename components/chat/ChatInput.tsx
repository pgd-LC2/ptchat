'use client';

import { useState } from 'react';
import { Mic, Plus, Book, Lightbulb } from 'lucide-react';
import InputMenu from './InputMenu';

// 库图标（与侧边栏一致）
function LibraryIcon({ className }: { className?: string }) {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-hidden="true"
    >
      <path d="M9.38759 8.53403C10.0712 8.43795 10.7036 8.91485 10.7997 9.59849C10.8956 10.2819 10.4195 10.9133 9.73622 11.0096C9.05259 11.1057 8.4202 10.6298 8.32411 9.94614C8.22804 9.26258 8.70407 8.63022 9.38759 8.53403Z"></path>
      <path fillRule="evenodd" clipRule="evenodd" d="M10.3886 5.58677C10.8476 5.5681 11.2608 5.5975 11.6581 5.74204L11.8895 5.83677C12.4185 6.07813 12.8721 6.46152 13.1991 6.94614L13.2831 7.07993C13.4673 7.39617 13.5758 7.74677 13.6571 8.14048C13.7484 8.58274 13.8154 9.13563 13.8993 9.81919L14.245 12.6317L14.3554 13.5624C14.3852 13.8423 14.4067 14.0936 14.4159 14.3192C14.4322 14.7209 14.4118 15.0879 14.3095 15.4393L14.2606 15.5887C14.0606 16.138 13.7126 16.6202 13.2577 16.9823L13.0565 17.1297C12.7061 17.366 12.312 17.4948 11.8622 17.5877C11.6411 17.6334 11.3919 17.673 11.1132 17.7118L10.1835 17.8299L7.37098 18.1756C6.68748 18.2596 6.13466 18.3282 5.68348 18.3465C5.28176 18.3628 4.9148 18.3424 4.56337 18.2401L4.41395 18.1913C3.86454 17.9912 3.38258 17.6432 3.0204 17.1883L2.87294 16.9872C2.63655 16.6367 2.50788 16.2427 2.41493 15.7928C2.36926 15.5717 2.32964 15.3226 2.29091 15.0438L2.17274 14.1141L1.82704 11.3016C1.74311 10.6181 1.67455 10.0653 1.65614 9.61411C1.63747 9.15518 1.66697 8.74175 1.81141 8.34458L1.90614 8.11313C2.14741 7.58441 2.53115 7.13051 3.01552 6.80356L3.1493 6.71958C3.46543 6.53545 3.8163 6.42688 4.20985 6.34556C4.65206 6.25423 5.20506 6.18729 5.88856 6.10337L8.70106 5.75767L9.63173 5.64731C9.91161 5.61744 10.163 5.59597 10.3886 5.58677ZM6.75673 13.0594C6.39143 12.978 6.00943 13.0106 5.66298 13.1522C5.5038 13.2173 5.32863 13.3345 5.06923 13.5829C4.80403 13.8368 4.49151 14.1871 4.04091 14.6932L3.64833 15.1327C3.67072 15.2763 3.69325 15.4061 3.71766 15.5243C3.79389 15.893 3.87637 16.0961 3.97548 16.243L4.06141 16.3602C4.27134 16.6237 4.5507 16.8253 4.86903 16.9413L5.00477 16.9813C5.1536 17.0148 5.34659 17.0289 5.6288 17.0174C6.01317 17.0018 6.50346 16.9419 7.20888 16.8553L10.0214 16.5106L10.9306 16.3944C11.0173 16.3824 11.0997 16.3693 11.1776 16.3573L8.61513 14.3065C8.08582 13.8831 7.71807 13.5905 7.41395 13.3846C7.19112 13.2338 7.02727 13.1469 6.88856 13.0975L6.75673 13.0594ZM10.4432 6.91587C10.2511 6.9237 10.0319 6.94288 9.77333 6.97056L8.86317 7.07798L6.05067 7.42271C5.34527 7.50932 4.85514 7.57047 4.47841 7.64829C4.20174 7.70549 4.01803 7.76626 3.88173 7.83481L3.75966 7.9061C3.47871 8.09575 3.25597 8.35913 3.1161 8.66587L3.06141 8.79966C3.00092 8.96619 2.96997 9.18338 2.98524 9.55942C3.00091 9.94382 3.06074 10.4341 3.14735 11.1395L3.42274 13.3895L3.64442 13.1434C3.82631 12.9454 3.99306 12.7715 4.1493 12.6219C4.46768 12.3171 4.78299 12.0748 5.16005 11.9208L5.38661 11.8377C5.92148 11.6655 6.49448 11.6387 7.04579 11.7616L7.19325 11.7987C7.53151 11.897 7.8399 12.067 8.15907 12.2831C8.51737 12.5256 8.9325 12.8582 9.4452 13.2684L12.5966 15.7889C12.7786 15.6032 12.9206 15.3806 13.0106 15.1336L13.0507 14.9979C13.0842 14.8491 13.0982 14.6561 13.0868 14.3739C13.079 14.1817 13.0598 13.9625 13.0321 13.704L12.9247 12.7938L12.58 9.9813C12.4933 9.27584 12.4322 8.78581 12.3544 8.40903C12.2972 8.13219 12.2364 7.94873 12.1679 7.81235L12.0966 7.69028C11.9069 7.40908 11.6437 7.18669 11.3368 7.04673L11.203 6.99204C11.0364 6.93147 10.8195 6.90059 10.4432 6.91587Z"></path>
      <path d="M9.72841 1.5897C10.1797 1.60809 10.7322 1.67665 11.4159 1.7606L14.2284 2.1063L15.1581 2.22446C15.4371 2.26322 15.6859 2.3028 15.9071 2.34849C16.3571 2.44144 16.7509 2.57006 17.1015 2.80649L17.3026 2.95396C17.7576 3.31618 18.1055 3.79802 18.3056 4.34751L18.3544 4.49692C18.4567 4.84845 18.4772 5.21519 18.4608 5.61704C18.4516 5.84273 18.4292 6.09381 18.3993 6.37388L18.2899 7.30454L17.9442 10.117C17.8603 10.8007 17.7934 11.3535 17.702 11.7958C17.6207 12.1895 17.5122 12.5401 17.328 12.8563L17.244 12.9901C17.0958 13.2098 16.921 13.4086 16.7255 13.5829L16.6171 13.662C16.3496 13.8174 16.0009 13.769 15.787 13.5292C15.5427 13.255 15.5666 12.834 15.8407 12.5897L16.0018 12.4276C16.0519 12.3703 16.0986 12.3095 16.1415 12.2459L16.2128 12.1239C16.2813 11.9875 16.3421 11.8041 16.3993 11.5272C16.4771 11.1504 16.5383 10.6605 16.6249 9.95493L16.9696 7.14243L17.077 6.23228C17.1047 5.97357 17.1239 5.7546 17.1317 5.56235C17.1432 5.27997 17.1291 5.08722 17.0956 4.93833L17.0556 4.80259C16.9396 4.4842 16.7381 4.20493 16.4745 3.99497L16.3573 3.90903C16.2103 3.80991 16.0075 3.72745 15.6386 3.65122C15.4502 3.61231 15.2331 3.57756 14.9755 3.54185L14.0663 3.42563L11.2538 3.08091C10.5481 2.99426 10.0582 2.93444 9.67372 2.9188C9.39129 2.90732 9.19861 2.92142 9.0497 2.95493L8.91395 2.99497C8.59536 3.11093 8.31538 3.31224 8.10536 3.57603L8.0204 3.69321C7.95293 3.79324 7.89287 3.91951 7.83778 4.10532L7.787 4.23032C7.64153 4.50308 7.31955 4.64552 7.01161 4.55454C6.65948 4.45019 6.45804 4.07952 6.56239 3.72739L6.63075 3.52036C6.70469 3.31761 6.79738 3.12769 6.91786 2.94907L7.06532 2.7479C7.42756 2.29294 7.90937 1.94497 8.45888 1.74497L8.60829 1.69614C8.95981 1.59385 9.32655 1.57335 9.72841 1.5897Z"></path>
    </svg>
  );
}
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

  // 根据功能返回对应的图标和显示文本
  const getFeatureDisplay = (feature: string) => {
    switch (feature) {
      case '研究与学习':
        return { icon: Book, text: '学习' };
      case '创建图片':
        return { icon: LibraryIcon, text: '照片' };
      case '思考时间更长':
        return { icon: Lightbulb, text: '思考' };
      default:
        return { icon: Book, text: feature };
    }
  };

  const handleFeatureSelect = (feature: string) => {
    setSelectedFeature(feature);
    setIsMenuVisible(false);
  };

  const handleClearFeature = () => {
    setSelectedFeature(null);
  };

  const featureDisplay = selectedFeature ? getFeatureDisplay(selectedFeature) : null;

  return (
    <div className={`relative w-full mx-auto ${isWelcomeScreen ? 'max-w-[820px]' : 'max-w-[820px] pb-3 px-6'} ${className || ''}`}>
      <InputMenu 
        isVisible={isMenuVisible} 
        onClose={() => setIsMenuVisible(false)}
        onFeatureSelect={handleFeatureSelect}
      />
      
      <form
        className={`${selectedFeature ? 'flex flex-col gap-3' : 'flex items-center gap-2'} rounded-[30px] overflow-hidden border border-zinc-200 bg-white px-4 py-3 shadow-sm hover:border-zinc-300 focus-within:border-zinc-400 ${selectedFeature ? 'min-h-[100px]' : 'min-h-[52px]'} ${isWelcomeScreen ? 'mx-4' : ''}`}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
      >
        {selectedFeature ? (
          <>
            {/* 第一行：纯输入框 */}
            <div className="w-full pl-1">
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
              <div className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-[#CCE6FF] transition-colors">
                {featureDisplay && (
                  <>
                    <featureDisplay.icon className="h-4 w-4 text-[#0285FF]" />
                    <span className="text-sm font-medium text-[#0285FF]">
                      {featureDisplay.text}
                    </span>
                  </>
                )}
                <button
                  type="button"
                  className="text-[#0285FF] hover:text-[#0264CC] text-sm"
                  onClick={handleClearFeature}
                >
                  ✕
                </button>
              </div>
              
              {/* 占位符让语音和发送靠右 */}
              <div className="flex-1"></div>
              
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