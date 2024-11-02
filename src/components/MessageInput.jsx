import React, { useState, useEffect, useRef } from 'react';
import { IsTyping } from '../Firebase/IsTyping';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const MessageInput = ({ addMessage, conversationId }) => {
  const {currentUser} = useAuth()
  const [inputValue, setInputValue] = useState("");
  const typingTimeoutRef = useRef(null);

  const handleSend = () => {
    if (inputValue.trim()) {
      addMessage(inputValue);
      setInputValue("");
      IsTyping(conversationId, false);
      clearTimeout(typingTimeoutRef.current);
    } else {
      toast.error("Please type somthing")
    }
  };

  const handleTyping = () => {

    IsTyping(conversationId, currentUser.uid);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }


    typingTimeoutRef.current = setTimeout(() => {
      IsTyping(conversationId, false);
    }, 2000);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    handleTyping();
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Message"
        value={inputValue}
        onChange={handleChange}
        className="flex-grow p-2 bg-gray-700 rounded-lg text-sm outline-none"
      />
      <button
        onClick={handleSend}
        className="p-2 bg-yellow-500 rounded-full text-white"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
