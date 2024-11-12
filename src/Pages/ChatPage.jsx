import React, { useEffect } from 'react';
import CharList from '../components/ChatList';
import ChatUI from '../components/ChatUi';
import { useUsers } from '../context/UsersContext';
import { useParams } from 'react-router-dom';
import { FetchUsers } from '../Firebase/FetchUsers';
import Loader from '../components/Loader';
import { IoSearch } from 'react-icons/io5';
import { BiLogOut } from 'react-icons/bi';
import { useAuth } from '../context/AuthContext';

const ChatPage = () => {
  const { users, setUsers, setLoading, loading } = useUsers();
  const { logout, currentUser } = useAuth();
  const { id } = useParams(); 

  useEffect(() => {
    const unsubscribe = FetchUsers((data) => {
      setUsers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUsers, setLoading]);

  if (loading) {
    return <Loader />;
  }

  const user = users?.find((user) => user?.id === id);

  return (
    <div className='flex flex-col bg-[#000000]'>
      <div className="px-5 h-[60px] flex justify-between items-center text-white text-[20px]">
        <h1>Messages</h1>
        <div className='flex gap-4 items-center'>
          <IoSearch className="cursor-pointer hover:text-[#d3d3d3]" />
          <BiLogOut onClick={() => logout()} className="cursor-pointer hover:text-[#d3d3d3]" />
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <p>{currentUser?.displayName}</p>
            </div>
            <img 
              src={currentUser?.photoURL} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover object-center" 
            />
          </div>
        </div>
      </div>
      <div className='flex bg-[#1B202D]'>
        <CharList />
        <ChatUI user={user} />
      </div>
    </div>
  );
};

export default ChatPage;
