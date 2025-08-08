import React from 'react';
import { emojiCategories, popularEmojis } from './chat-utils';

const EmojiPicker = ({ showEmojiPicker, setShowEmojiPicker, onEmojiSelect }) => {
  if (!showEmojiPicker) return null;

  return (
    <div className="emoji-picker">
      {/* Emoji Picker Header */}
      <div className="emoji-picker-header">
        <h4 className="emoji-picker-title">Choose Emoji</h4>
        <button
          className="emoji-close-btn"
          onClick={() => setShowEmojiPicker(false)}
        >
          ✕
        </button>
      </div>

      {/* Popular Emojis */}
      <div className="emoji-popular-section">
        <div className="emoji-section-title">
          Popular
        </div>
        <div className="emoji-popular-grid">
          {popularEmojis.map(emoji => (
            <button
              key={emoji}
              className="emoji-btn-grid"
              onClick={() => {
                onEmojiSelect(emoji);
                setShowEmojiPicker(false);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* All Emojis */}
      <div className="emoji-categories">
        {Object.entries(emojiCategories).map(([category, emojis]) => (
          <div key={category} className="emoji-category">
            <div className="emoji-category-title">
              {category}
            </div>
            <div className="emoji-category-grid">
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  className="emoji-btn-small"
                  onClick={() => {
                    onEmojiSelect(emoji);
                    setShowEmojiPicker(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;