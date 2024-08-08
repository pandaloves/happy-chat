import { useState } from "react";
import SideNav from "../components/SideNav";
import ChatContainer from "../components/ChatContainer";
import Navbar from "../components/Navbar";

const Chat = () => {
  const [chat, setChat] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  return (
    <>
      <Navbar toggleSideNav={toggleSideNav} />
      <div className="flex flex-col items-center min-h-screen">
        <div className="w-full max-w-4xl relative">
          {isSideNavOpen && (
            <SideNav
              setChat={setChat}
              isSideNavOpen={isSideNavOpen}
              setIsSideNavOpen={setIsSideNavOpen}
            />
          )}
          <div className="messenger flex">
            <ChatContainer chat={chat} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
