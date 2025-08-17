import ChatInput from './ChatInput';

type Props = {
  className?: string;
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function WelcomeScreen({ className, input, isLoading, onInputChange, onSubmit }: Props) {
  return (
    <section className={`flex flex-col items-center justify-center flex-1 w-full ${className || ''}`}>
      <h2 className="text-2xl font-normal text-black mb-8">在时刻准备着。</h2>
      <ChatInput
        value={input}
        disabled={isLoading}
        isWelcomeScreen={true}
        onChange={onInputChange}
        onSubmit={onSubmit}
        className="w-full"
      />
    </section>
  );
}
