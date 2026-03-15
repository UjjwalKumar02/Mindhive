"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function RoomClient({ roomId }: { roomId: string }) {
  const router = useRouter();
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [chatList, setChatList] = useState<string[]>([]);
  const newChatRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    if (ws) {
      setSocket(ws);

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: "join_room",
            roomId: roomId,
          }),
        );
      };
    }

    return () => {
      ws.close();
    };
  }, []);

  if (socket) {
    socket.onmessage = (e) => {
      const parsedData = e.data;
      setChatList((prev) => [...prev, parsedData]);
    };
  }

  const handleLeave = () => {
    if (!socket) {
      alert("Websocket connection error!");
      return;
    }

    socket.send(
      JSON.stringify({
        type: "leave_room",
        roomId: roomId,
      }),
    );

    router.push("/profile");
  };

  const handleSend = () => {
    if (newChatRef.current?.value === "") {
      alert("Message is required!");
      return;
    }

    if (!socket) {
      alert("Websocket connection error!");
      return;
    }

    socket.send(
      JSON.stringify({
        type: "chat",
        roomId: roomId,
        chat: newChatRef.current?.value,
      }),
    );

    if (newChatRef && newChatRef.current) {
      newChatRef.current.value = "";
    }
  };

  if (!socket) return <div>Websocket connection error!</div>;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      <div className="fixed top-0 left-0">
        <button
          onClick={handleLeave}
          className="bg-sky-500 text-gray-100 font-medium tracking-tight px-6 py-2 rounded-xl mt-2 cursor-pointer"
        >
          Leave room
        </button>
      </div>

      <div className="flex flex-col justify-center items-center gap-4">
        {chatList.length !== 0 && chatList.map((c, i) => <p key={i}>{c}</p>)}
      </div>

      <div className="fixed bottom-0 w-full flex justify-center items-center">
        <input
          ref={newChatRef}
          type="text"
          placeholder="Write your message..."
          className="outline-none border border-black"
        />
        <button
          onClick={handleSend}
          className="bg-sky-500 text-gray-100 font-medium tracking-tight px-6 py-2 rounded-xl mt-2 cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
}
