import { useState, useContext } from "react";
import SideNav from "../components/SideNav";
import ChatContainer from "../components/ChatContainer";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import Footer from "../components/Footer";
import InitContainer from "../components/InitContainer";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const [chat, setChat] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [text, setText] = useState("");
  const { cleanData } = useContext(UserContext);
  const { createMessage, conversationId } = useContext(ChatContext);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

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
    <>
      <div className="chat flex flex-col justify-content items-center min-h-screen">
        <div className="chat-card w-full max-w-4xl md:w-3/4 lg-1/2 xxl-1/3 flex-1 relative flex flex-col mt-10">
          {isSideNavOpen && (
            <SideNav
              setChat={setChat}
              isSideNavOpen={isSideNavOpen}
              setIsSideNavOpen={setIsSideNavOpen}
            />
          )}
          <Navbar toggleSideNav={toggleSideNav} />

          {chat ? (
            <>
              <>
                <ChatContainer />
              </>
              <div>
                <Footer
                  text={text}
                  setText={setText}
                  cleanData={cleanData}
                  createMessage={createMessage}
                  conversationId={conversationId}
                  handleKeyDown={handleKeyDown}
                  handleSubmit={handleSubmit}
                />
              </div>
            </>
          ) : (
            <InitContainer />
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Chat;
