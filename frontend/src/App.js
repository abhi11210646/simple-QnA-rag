import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [user] = useState(`User${Math.floor(Math.random() * 100)}`); // Random user for simplicity
  const ws = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => console.log('Connected to WebSocket');
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (inputValue) {
      const message = { user, message: inputValue };
      setMessages((prevMessages) => [...prevMessages, message]);
      ws.current.send(JSON.stringify(message));
      setInputValue('');
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <h2></h2>
        <MessageList messages={messages} currentUser={user} />
        <div className="input-container">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

function MessageList({ messages, currentUser }) {
  return (
    <div className="messages">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.user === currentUser ? 'sent' : 'received'}`}>
          {msg.user !== currentUser && (
            <div className="user-info">
              <span className="user-name">{msg.user}</span>
            </div>
          )}
          <div className={`message-text ${msg.user === currentUser ? 'sent' : 'received'}`}
          // dangerouslySetInnerHTML={{ __html: msg.message }}
          style={{ whiteSpace: "pre-wrap" }}
          >
            {msg.message}
          </div>
        </div>
      ))}
    </div>
  );
}


export default App;
