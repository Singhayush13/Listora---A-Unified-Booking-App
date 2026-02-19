import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import api from "../services/api";

export default function ChatBox({ hotelId, receiverId, onClose }) {
  if (!hotelId || !receiverId) return null;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const bodyRef = useRef(null);

  /* =============================
     GET USER (LOCAL + SESSION)
  ============================== */
  const getStoredUser = () => {
    const localUser = localStorage.getItem("user");
    const sessionUser = sessionStorage.getItem("user");

    return localUser
      ? JSON.parse(localUser)
      : sessionUser
      ? JSON.parse(sessionUser)
      : null;
  };

  const me = getStoredUser();

  /* =============================
     FORMAT TIME
  ============================== */
  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* =============================
     LOAD HISTORY
  ============================== */
  useEffect(() => {
    api.get(`/chat/${hotelId}/${receiverId}`)
      .then(res => setMessages(res.data))
      .catch(() => setMessages([]));
  }, [hotelId, receiverId]);

  /* =============================
     SOCKET CONNECTION
  ============================== */
  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) return;

    socketRef.current = io("http://localhost:5000", {
      auth: { token }
    });

    socketRef.current.emit("joinHotel", { hotelId });

    socketRef.current.on("receiveMessage", msg => {
      if (String(msg.hotel) === String(hotelId)) {
        setMessages(prev => {
          if (prev.some(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    });

    return () => socketRef.current?.disconnect();
  }, [hotelId]);

  /* =============================
     AUTO SCROLL
  ============================== */
  useEffect(() => {
    bodyRef.current?.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages]);

  /* =============================
     SEND MESSAGE
  ============================== */
  const send = () => {
    if (!text.trim() || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      hotelId,
      receiverId,
      message: text.trim()
    });

    setText("");
  };

  return (
    <>
      <div className="listora-chatbox">
        
        {/* HEADER */}
        <div className="chat-header">
          <span>LISTORA Messenger</span>
          <span className="close-btn" onClick={onClose}>✖</span>
        </div>

        {/* BODY */}
        <div className="chat-body" ref={bodyRef}>
          {messages.map(m => {

            const myId = me?._id || me?.id;

            const isMe =
              String(m.sender?._id || m.sender) === String(myId);

            return (
              <div
                key={m._id}
                className={`chat-row ${isMe ? "right" : "left"}`}
              >
                <div className="chat-bubble">
                  <div>{m.message}</div>
                  <div className="chat-time">
                    {formatTime(m.createdAt || new Date())}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* INPUT */}
        <div className="chat-input">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Type a message..."
          />
          <button onClick={send}>Send</button>
        </div>

      </div>

      {/* =============================
         STYLES
      ============================== */}
      <style>{`

        .listora-chatbox {
          position: fixed;
          top:90px;
          bottom: 20px;
          right: 20px;
          width: 380px;
          height: 520px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.25);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .chat-header {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          padding: 16px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
        }

        .close-btn {
          cursor: pointer;
          font-size: 14px;
        }

        .chat-body {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #f4f6fb;
        }

        .chat-row {
          display: flex;
          margin-bottom: 12px;
          animation: fadeIn 0.2s ease;
        }

        .chat-row.left {
          justify-content: flex-start;
        }

        .chat-row.right {
          justify-content: flex-end;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chat-bubble {
          max-width: 75%;
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 14px;
          position: relative;
          word-wrap: break-word;
        }

        .chat-row.left .chat-bubble {
          background: #e5e7eb;
          color: #111;
          border-bottom-left-radius: 4px;
        }

        .chat-row.right .chat-bubble {
          background: #7c3aed;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .chat-time {
          font-size: 10px;
          opacity: 0.7;
          margin-top: 4px;
          text-align: right;
        }

        .chat-input {
          display: flex;
          padding: 12px;
          border-top: 1px solid #eee;
          background: white;
        }

        .chat-input input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 20px;
          border: 1px solid #ddd;
          outline: none;
          font-size: 14px;
        }

        .chat-input button {
          margin-left: 8px;
          padding: 10px 18px;
          border-radius: 20px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .chat-input button:hover {
          opacity: 0.9;
        }

        /* Responsive */
        @media (max-width: 500px) {
          .listora-chatbox {
            width: 100%;
            height: 100%;
            right: 0;
            bottom: 0;
            border-radius: 0;
          }
        }

      `}</style>
    </>
  );
}
