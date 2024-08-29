import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";
import { v4 as uuidv4 } from "uuid";
import { format } from "timeago.js";

import { ImSpinner6 } from "react-icons/im";

const ChatContainer = ({ chat }) => {
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const { authUser } = useContext(UserContext);
  const [id, username, email, avatar, invite] = authUser;

  const {
    messages,
    conversationId,
    invitedName,
    invitedAvatar,
    fetchMessages,
    deleteMessage,
  } = useContext(ChatContext);

  const scrollContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="messages shadow-xl shadow-slate-500 overflow-y-scroll">
      <div className="flex flex-col flex-1 p-4">
        <div
          ref={scrollContainerRef}
          className="flex flex-col flex-1 gap-2 p-2"
        >
          {messages &&
            messages.map((message) => (
              <div
                key={uuidv4()}
                className={`chat ${
                  message.userId === id ? "chat-end" : "chat-start"
                }`}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="avatar"
                      src={message.userId === id ? avatar : invitedAvatar}
                    />
                  </div>
                </div>
                <div className="chat-header">
                  {message.userId === id ? username : invitedName}
                  <time className="text-sm ml-2">
                    {format(message.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble chat-bubble-primary mt-1 text-lg">
                  {message.text}
                </div>
                {message.userId === id && (
                  <span
                    className="text-lg hover:text-secondary my-2 cursor-pointer"
                    onClick={() => handleDelete(message.id)}
                  >
                    {deletingMessageId === message.id ? (
                      <ImSpinner6 className="animate-spin text-2xl mr-2" />
                    ) : (
                      "Delete"
                    )}
                  </span>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
