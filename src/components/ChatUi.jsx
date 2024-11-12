import React, { useEffect, useRef, useState } from 'react';
import placeholderMan from '../assets/placeholder-man.jpg';
import MessageInput from './MessageInput';
import { AddMessage } from '../Firebase/AddMessage';
import { useAuth } from '../context/AuthContext';
import { FetchMessage } from '../Firebase/FetchMessage';
import { FormatTimestamp } from '../Firebase/FormatTimeStamp';
import style from './style.module.css'
import { DeleteMessage } from '../Firebase/deleteMessage';
import { IoIosArrowDown } from "react-icons/io";

const ChatUI = ({ user }) => {
  if (!user) {
    return (
      <div className="w-full text-center bg-[#1B202D] text-white rounded-lg h-[calc(100vh_-_60px)] flex justify-center flex-col shadow-lg p-4 space-y-4">
        <h1 className="text-[30px]">Let's have a chat!</h1>
      </div>
    );
  }
  const { currentUser } = useAuth();
  const [openedMenu, setOpemedMenu] = useState(null);
  const inboxContainerRef = useRef(null);

  const generateConversationId = (userId1, userId2) => {
    const sortedUserIds = [userId1, userId2].sort();
    return sortedUserIds.join('_');
  };
  const conversationId = generateConversationId(currentUser.uid, user?.id);
  const messages = FetchMessage(conversationId);
  const addMessage = async (newMessage) => {
    await AddMessage(conversationId, { message: newMessage, senderId: currentUser.uid });
  };

  const scrollToBottom = () => {
    if (inboxContainerRef.current) {
      inboxContainerRef.current.scrollTop = inboxContainerRef.current.scrollHeight;
    }
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-full bg-[#1B202D] text-white rounded-lg h-[calc(100vh_-_60px)] flex justify-between flex-col shadow-lg p-4 space-y-4">
      <div className="flex items-center space-x-4 sticky top-0">
        <img
          src={user?.profileImage || placeholderMan}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover object-center"
        />
        <div className="flex flex-col">
          <span className="font-semibold">{user?.name}</span>
          <span className="text-xs text-gray-400">{user?.email}</span>
        </div>
      </div>

      <div ref={inboxContainerRef} className={`space-y-4 overflow-y-auto max-h-80 ${style.scrollable}`}>
        {messages?.map((message, index) => (
          message.message &&
          <div key={index} className={`flex ${message.senderId === currentUser.uid ? "justify-end" : ""}`}>
            <div className="flex flex-col items-end space-y-1">
              <div
                className={`relative max-w-[250px] py-3 px-[15px] rounded-lg   flex gap-2 ${message.senderId === currentUser.uid ? "bg-[#292F3F] rounded-tr-[0px]" : "bg-gray-700 rounded-tl-[0px]"
                  }`}
              >
                <p className='break-words w-[100%] text-[16px]'>
                  {message.message}
                </p>
                <div >
                  <IoIosArrowDown onClick={() => setOpemedMenu((prev) => prev === index ? null : index)} className='absolute right-1 top-1 hover:opacity-[0.7] cursor-pointer' />
                  {openedMenu === index && (
                    <div className={`absolute mt-2 w-32 z-[100] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${message.senderId === currentUser.uid ? "right-0" : 'left-0'}`}>
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete for me</button>
                        {message.senderId === currentUser.uid && (
                          <>
                            <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
                            <button onClick={() => {
                              DeleteMessage(conversationId, message.id)
                              setOpemedMenu(null)
                            }} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete</button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {FormatTimestamp(message?.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <MessageInput addMessage={addMessage} conversationId={conversationId} />
    </div>
  );
};

export default ChatUI;
