import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

function Chat() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const socketRef = useRef();

  const messagesEndRef = useRef(null);

  /* SOCKET CONNECT */
  useEffect(() => {

    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("connect", () => {

      console.log("Connected ✅");

    });

    /* RECEIVE MESSAGE */
    socketRef.current.on("receive_message", (data) => {

      setMessages((prev) => [...prev, data]);

    });

    return () => {

      socketRef.current.disconnect();

    };

  }, []);

  /* AUTO SCROLL */
  useEffect(() => {

  /* CONNECT */
  socketRef.current = io("http://localhost:5000");

  /* LOAD OLD MESSAGES */
  socketRef.current.on("load_messages", (data) => {

    setMessages(data);

  });

  /* RECEIVE NEW MESSAGE */
  socketRef.current.on("receive_message", (data) => {

    setMessages((prev) => [...prev, data]);

  });

  return () => {

    socketRef.current.disconnect();

  };

}, []);

  /* SEND MESSAGE */
  const sendMessage = () => {

    if (!message.trim()) return;

    const msgData = {

      text: message,

      time: new Date().toLocaleTimeString(),

    };

    /* SEND */
    socketRef.current.emit("send_message", msgData);

    /* LOCAL ADD */
    setMessages((prev) => [...prev, msgData]);

    setMessage("");

  };

  return (
    <div className="container mt-4">

      <div className="card shadow border-0">

        {/* HEADER */}
        <div
          className="card-header text-white fw-bold"
          style={{
            background:
              "linear-gradient(45deg,#007bff,#00c6ff)",
          }}
        >
          Live Chat 💬
        </div>

        {/* CHAT BODY */}
        <div
          className="card-body"
          style={{
            height: "450px",
            overflowY: "auto",
            background: "#f8f9fa",
          }}
        >

          {messages.length === 0 && (
            <p className="text-center text-muted">
              No messages yet 👀
            </p>
          )}

          {messages.map((msg, index) => (

            <div
              key={index}
              className="mb-3 d-flex justify-content-end"
            >

              <div
                style={{
                  maxWidth: "70%",
                }}
              >

                <div
                  className="p-2 rounded shadow-sm"
                  style={{
                    background: "#007bff",
                    color: "white",
                  }}
                >
                  {msg.text}
                </div>

                <small className="text-muted">
                  {msg.time}
                </small>

              </div>

            </div>

          ))}

          <div ref={messagesEndRef}></div>

        </div>

        {/* INPUT */}
        <div className="card-footer d-flex">

          <input
            type="text"
            className="form-control me-2"
            placeholder="Type message..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {

                sendMessage();

              }

            }}
          />

          <button
            className="btn btn-primary"
            onClick={sendMessage}
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default Chat;