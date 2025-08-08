import React from 'react';
import EmojiPicker from './emojiPicker';

const MessageInput = ({
  message,
  setMessage,
  sendMessage,
  showEmojiPicker,
  setShowEmojiPicker
}) => {
  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
  };

  return (
    <div className="message-input-container">
      {/* Emoji Picker */}
      <EmojiPicker
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        onEmojiSelect={handleEmojiSelect}
      />

      <div className="message-input-wrapper">
        {/* Emoji Button */}
        <button
          className={`emoji-btn ${showEmojiPicker ? 'active' : ''}`}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          title="Add emoji"
        >
          😀
        </button>

        <input
          type="text"
          className="message-input"
          value={message}
          onChange={(e) => {
            console.log('📝 Message input changed:', e.target.value);
            setMessage(e.target.value);
          }}
          onKeyPress={(e) => {
            console.log('⌨️ Key pressed:', e.key);
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message..."
        />

        <button
          className={`send-btn ${message.trim() ? 'enabled' : 'disabled'}`}
          onClick={() => {
            console.log('📤 Send button clicked');
            sendMessage();
          }}
          disabled={!message.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default MessageInput;