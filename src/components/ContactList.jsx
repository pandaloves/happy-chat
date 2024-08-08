import { useContext, useRef, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import SpecificUser from "./SpecificUser";

const ContactList = ({ user, setChat, matchedUser }) => {
  const { inviteUser } = useContext(ChatContext);
  const itemRef = useRef(null);

  useEffect(() => {
    if (matchedUser === user.userId && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [matchedUser, user.userId]);

  return (
    <>
      <div
        ref={itemRef}
        className="px-4 py-3 cursor-pointer hover:bg-slate-200 rounded-lg flex flex-row
        justify-evenly items-center h-36"
        onClick={() => {
          setChat(true);
          inviteUser(user.userId);
        }}
      >
        <SpecificUser src={user.avatar} username={user.username} />

        <p className="text-sm text-secondary italic">
          {" "}
          Say hi to {user.username}!
        </p>
      </div>
      <div className="divider"></div>
    </>
  );
};

export default ContactList;
