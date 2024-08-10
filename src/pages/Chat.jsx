import { useState } from "react";
import SideNav from "../components/SideNav";
import ChatContainer from "../components/ChatContainer";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";

const Chat = () => {
  const [chat, setChat] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  return (
    <>
      <div className="flex flex-col items-center min-h-screen">
        <Navbar toggleSideNav={toggleSideNav} />
        <div className="w-full max-w-4xl flex-1 relative flex flex-col">
          {isSideNavOpen && (
            <SideNav
              setChat={setChat}
              isSideNavOpen={isSideNavOpen}
              setIsSideNavOpen={setIsSideNavOpen}
            />
          )}
          <div className="flex flex-1">
            <ChatContainer chat={chat} />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Chat;
