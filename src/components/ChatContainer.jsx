import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";
import InitContainer from "./InitContainer";
import { v4 as uuidv4 } from "uuid";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";

const ChatContainer = ({ chat }) => {
  const [text, setText] = useState("");
  const { authUser, cleanData } = useContext(UserContext);

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
            className="flex flex-col flex-1 gap-2 p-2 overflow-y-scroll"
          >
            {messages &&
              messages.map((message) => (
                <div
                  key={uuidv4()}
                  className={`chat ${
                    message.userId === authUser.id ? "chat-end" : "chat-start"
                  }`}
                >
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="avatar"
                        src={
                          message.userId === authUser.id
                            ? authUser.avatar
                            : invitedAvatar
                        }
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    {message.userId === authUser.id
                      ? authUser.user
                      : invitedName}
                    <time className="text-sm opacity-50 ml-2">
                      {format(message.createdAt)}
                    </time>
                  </div>
                  <div className="chat-bubble chat-bubble-primary mt-1 text-lg">
                    {message.text}
                  </div>
                  {message.userId === authUser.id && (
                    <span
                      className="text-lg text-gray-500 hover:text-secondary my-2 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteMessage(message.id);
                      }}
                    >
                      Delete
                    </span>
                  )}
                </div>
              ))}
          </div>

          <div className="divider"></div>
          <form className="h-16 flex items-center p-2" onSubmit={handleSubmit}>
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
      ) : (
        <InitContainer />
      )}
    </div>
  );
};

export default ChatContainer;
