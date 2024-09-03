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

  // Toggle the visibility of sideNav
  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  // Create a message
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }
    await createMessage(text, conversationId);
    setText("");
  };

  // Handle keydown events in the text input
  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSubmit(e);
    }
  };

  useEffect(() => {
    const pageName = "Chat";

    // Get the current time in European format
    const europeanTime = new Date().toLocaleString("en-GB", {
      timeZone: "Europe/Berlin",
    });

    // Log the user visit information to the console
    console.info(
      `[${europeanTime} user ${authUser.id} visited the ${pageName} page]`
    );
  }, [authUser]);

  return (
    <>
      <div className="chat flex flex-col justify-content items-center min-h-screen">
        <div className="chat-card w-full max-w-4xl md:w-1/2 lg-1/3 flex-1 relative flex flex-col mt-3">
          {isSideNavOpen && (
            // Conditionally render SideNav component if isSideNavOpen is true
            <SideNav
              setChat={setChat}
              isSideNavOpen={isSideNavOpen}
              setIsSideNavOpen={setIsSideNavOpen}
            />
          )}
          <Navbar toggleSideNav={toggleSideNav} />

          {chat ? (
            // Conditionally render chat-related components based on chat state
            <>
              <ChatContainer />
              <div>
                <Footer
                  text={text}
                  setText={setText}
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
