import { StreamingTextResponse } from 'ai';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const last = messages?.[messages.length - 1];
    const userText = last?.content ?? '';

    const responseText =
      `这是一个来自后端占位符的模拟流式响应。你刚才说：“${userText}”。` +
      '当你接入真实 LLM API 时，这里将被替换为真正的流式内容。';

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for (const ch of responseText) {
          controller.enqueue(encoder.encode(ch));
          await sleep(20);
        }
        controller.close();
      },
    });

    return new StreamingTextResponse(stream);
  } catch {
    const fallback = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const txt = '占位符后端出现错误，但前端流程仍可工作。';
        controller.enqueue(encoder.encode(txt));
        controller.close();
      },
    });
    return new StreamingTextResponse(fallback);
  }
}
