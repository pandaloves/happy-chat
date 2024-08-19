import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";
import InitContainer from "./InitContainer";
import { v4 as uuidv4 } from "uuid";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { ImSpinner6 } from "react-icons/im";

const ChatContainer = ({ chat }) => {
  const [text, setText] = useState("");
  const [deletingMessageId, setDeletingMessageId] = useState(null); // Track which message is being deleted
  const { authUser, cleanData } = useContext(UserContext);
  const [id, username, email, avatar, invite] = authUser;

  const {
    messages,
    createMessage,
    conversationId,
    invitedName,
    invitedAvatar,
    fetchMessages,
    deleteMessage,
  } = useContext(ChatContext);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId, fetchMessages]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }
    await createMessage(text, conversationId);
    setText("");
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSubmit(e);
    }
  };

  const handleDelete = async (messageId) => {
    setDeletingMessageId(messageId);
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
    } finally {
      setDeletingMessageId(null);
    }
  };

  return (
    <div
      className={
        chat ? "content active chat-container" : "content flex flex-col flex-1"
      }
    >
      {chat ? (
        <div className="flex flex-col flex-1 p-4">
          <div
            ref={scrollContainerRef}
            className="flex flex-col flex-1 gap-2 p-2 overflow-y-auto"
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

          <div className="">
            <div className="divider"></div>
            <form
              className="h-16 flex items-center p-2"
              onSubmit={handleSubmit}
            >
              <InputEmoji
                className="textarea flex-1"
                placeholder="Type a message"
                cleanOnEnter
                value={cleanData(text)}
                onChange={setText}
                onKeyDown={handleKeyDown}
              />

              <button
                type="submit"
                className="btn btn-outline btn-sm btn-primary rounded-xl flex items-center justify-center"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <InitContainer />
      )}
    </div>
  );
};

export default ChatContainer;
