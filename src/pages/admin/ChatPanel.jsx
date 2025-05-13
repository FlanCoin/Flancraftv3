import { supabase } from "@lib/supabaseClient";
import { useEffect, useState } from "react";

export default function ChatStream() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const channel = supabase
      .channel("chat-logs")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_logs" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="chat-box">
      {messages.map((msg, i) => (
        <div key={i}>
          <strong>[{msg.server}] {msg.player}:</strong> {msg.message}
        </div>
      ))}
    </div>
  );
}
