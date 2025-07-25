import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Mic, X, Image, FileText } from 'lucide-react';

const MessageInput = ({ onSendMessage, onTyping, currentUser, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if ((!message.trim() && attachments.length === 0) || disabled) {
      return;
    }

    const messageData = {
      text: message.trim(),
      type: attachments.length > 0 ? 'media' : 'text',
      attachments: attachments
    };

    onSendMessage(messageData);
    setMessage('');
    setAttachments([]);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Trigger typing indicator
    if (onTyping) {
      onTyping();
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      // Stop typing indicator after 3 seconds
    }, 3000);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const attachment = {
        id: Date.now() + Math.random(),
        file: file,
        name: file.name,
        size: file.size,
        type: getFileType(file),
        url: URL.createObjectURL(file)
      };
      
      setAttachments(prev => [...prev, attachment]);
    });

    // Reset file input
    e.target.value = '';
  };

  const getFileType = (file) => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'file';
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(prev => {
      const updated = prev.filter(att => att.id !== attachmentId);
      // Revoke object URL to prevent memory leaks
      const removed = prev.find(att => att.id === attachmentId);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return updated;
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const attachment = {
          id: Date.now(),
          file: blob,
          name: `voice-message-${Date.now()}.wav`,
          size: blob.size,
          type: 'audio',
          url: URL.createObjectURL(blob)
        };
        
        setAttachments(prev => [...prev, attachment]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newMessage = message.substring(0, start) + emoji + message.substring(end);
    
    setMessage(newMessage);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      textarea.focus();
    }, 0);
  };

  const commonEmojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🎉', '😢', '😮', '😡', '🙏'];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="border-t bg-white p-4">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map(attachment => (
            <div key={attachment.id} className="relative">
              {attachment.type === 'image' ? (
                <div className="relative">
                  <img 
                    src={attachment.url} 
                    alt={attachment.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center bg-gray-100 rounded-lg p-2 pr-8 relative">
                  <FileText className="w-4 h-4 text-gray-600 mr-2" />
                  <div className="text-xs">
                    <p className="font-medium truncate max-w-20">{attachment.name}</p>
                    <p className="text-gray-500">{formatFileSize(attachment.size)}</p>
                  </div>
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="w-2 h-2" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-6 gap-2">
            {commonEmojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="text-xl hover:bg-gray-200 rounded p-1 transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={disabled}
            className="w-full px-4 py-2 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 max-h-32"
            rows="1"
          />
        </div>

        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          disabled={disabled}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Voice Recording Button */}
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          className={`p-2 rounded-full transition-colors disabled:opacity-50 ${
            isRecording 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!message.trim() && attachments.length === 0) || disabled}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
      </form>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="mt-2 flex items-center text-red-500 text-sm">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
          Recording... Click mic to stop
        </div>
      )}
    </div>
  );
};

export default MessageInput;

