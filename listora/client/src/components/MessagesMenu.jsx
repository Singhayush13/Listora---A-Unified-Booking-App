import React, { useEffect, useState } from "react";
import api from "../services/api";
import ChatBox from "./ChatBox";

export default function MessagesMenu() {
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    if (!open) return;

    api.get("/chat/conversations")
      .then(res => setConversations(res.data))
      .catch(() => setConversations([]));

  }, [open]);

  return (
    <>
      <button
        className="btn btn-light rounded-circle"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      {open && (
        <div style={{
          position: "absolute",
          right: 0,
          top: "110%",
          width: 320,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,.2)",
          zIndex: 3000
        }}>

          <div style={{ padding: 12, fontWeight: 600 }}>
            Messages
          </div>

          {conversations.map((c, i) => (
            <div
              key={i}
              style={{
                padding: 12,
                borderTop: "1px solid #eee",
                cursor: "pointer"
              }}
              onClick={() => {
                setActiveChat({
                  hotelId: c.hotelId,
                  receiverId: c.receiverId
                });
                setOpen(false);
              }}
            >
              <div><b>{c.hotelName}</b></div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>
                {c.providerName}
              </div>
              <div style={{ fontSize: 13 }}>
                {c.lastMessage}
              </div>
            </div>
          ))}

        </div>
      )}

      {activeChat && (
        <ChatBox
          {...activeChat}
          onClose={() => setActiveChat(null)}
        />
      )}
    </>
  );
}
