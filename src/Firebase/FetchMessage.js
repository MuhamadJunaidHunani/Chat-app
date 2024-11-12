import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./Firebase";

export const FetchMessage = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    const messagesRef = collection(db, "conversations", conversationId, "messages");

    const fetchMessages = async () => {
      setLoading(true);
      const q = query(messagesRef, orderBy("timestamp", "asc"), limit(10));
      const snapshot = await onSnapshot(q);
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setMessages(fetchedMessages);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setLoading(false);
    };

    fetchMessages();

    return () => {};
  }, [conversationId]);

  const fetchMoreMessages = async () => {
    if (loading || !lastVisible) return;

    setLoading(true);
    const messagesRef = collection(db, "conversations", conversationId, "messages");
    const q = query(
      messagesRef,
      orderBy("timestamp", "asc"),
      startAfter(lastVisible),
      limit(10)
    );

    const snapshot = await onSnapshot(q);
    const moreMessages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  
    setMessages((prevMessages) => [...moreMessages, ...prevMessages]);
    setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    setLoading(false);
  };

  return { messages, fetchMoreMessages, loading };
};