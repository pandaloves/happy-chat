import { useState, useContext, useEffect } from "react";
import SideNav from "../components/SideNav";
import ChatContainer from "../components/ChatContainer";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import Footer from "../components/Footer";
import InitContainer from "../components/InitContainer";
import { ChatContext } from "../context/ChatContext";
import { UserContext } from "../context/UserContext";

const Chat = () => {
  const [chat, setChat] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [text, setText] = useState("");
  const { authUser } = useContext(UserContext);
  const { createMessage, conversationId } = useContext(ChatContext);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await createMessage(text, conversationId);
    setText("");
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSubmit(e);
    }
  };

  useEffect(() => {
    const pageName = "Chat";
    const europeanTime = new Date().toLocaleString("en-GB", {
      timeZone: "Europe/Berlin",
    });

    console.info(
      `[${europeanTime} user ${authUser.id} visited the ${pageName} page]`
    );
  }, [authUser]);

  return (
    <>
      <div className="chat flex flex-col justify-center items-center min-h-screen h-full">
        <div className="chat-card w-full max-w-4xl md:w-1/2 lg-1/3 flex-1 relative flex flex-col">
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
              <ChatContainer />
              <Footer
                text={text}
                setText={setText}
                handleKeyDown={handleKeyDown}
                handleSubmit={handleSubmit}
              />
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
