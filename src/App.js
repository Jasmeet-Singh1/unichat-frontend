//import React from "react";
import Login from "./pages/Login.js";
import ChatContainer from "./components/chat/ChatContainer.jsx";
import ChatWindow from "./components/chat/ChatWindow.jsx";
import Message from "./components/chat/Message.jsx";
import MessageInput from "./components/chat/MessageInput.jsx";
import MessageList from "./components/chat/MessageList.jsx";
import TypingIndicator from "./components/chat/TypingIndicator.jsx";

      setTypingUsers(prev => {
        const updatedTypingUsers = new Set(prev);
        updatedTypingUsers.add(userId);
        return updatedTypingUsers;
      });
function App() {
  return (
    <>
      <Login />
      <ChatContainer />
      <ChatWindow />
      <Message />
      <MessageInput />
      <MessageList />
      <TypingIndicator />
    </>
  );
}

export default App;


