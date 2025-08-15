'use client';

import Sidebar from '../components/sidebar/Sidebar';
import ChatView from '../components/chat/ChatView';

export default function HomePage() {
  return (
    <>
      <Sidebar />
      <main className="flex-1">
        <ChatView />
      </main>
    </>
  );
}
