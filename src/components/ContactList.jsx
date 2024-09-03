import { useContext, useRef, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import SpecificUser from "./SpecificUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../context/UserContext";

const ContactList = ({ user, setChat, matchedUser }) => {
  const [isAuthFriend, setIsAuthFriend] = useState(false);
  const { inviteUser } = useContext(ChatContext);
  const { authUser } = useContext(UserContext);

  const itemRef = useRef(null);

  // Scroll to the matched user if needed
  useEffect(() => {
    if (matchedUser === user.userId && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [matchedUser, user.userId]);

  useEffect(() => {
    const authInviteArray = JSON.parse(authUser.invite || "[]");
    const authInvitedData = authInviteArray.find(
      (inviteItem) => inviteItem.username === user.username
    );

    if (authInvitedData) {
      setIsAuthFriend(true);
    }
  }, [authUser]);

  return (
    <>
      <div
        ref={itemRef}
        className="px-4 py-3 cursor-pointer hover:bg-slate-200 rounded-lg flex flex-row justify-evenly items-center h-36"
        onClick={() => {
          setChat(true);
          inviteUser(user.userId);
        }}
      >
        <SpecificUser src={user.avatar} username={user.username} />

        <div className="flex flex-col items-center gap-1">
          {isAuthFriend && (
            <div className="flex flex-row items-center gap-1">
              <FontAwesomeIcon
                icon={faHeart}
                style={{ color: "#f162e7", width: "20px", height: "30px" }}
              />
              <p className="text-xs font-semibold italic">Friend</p>
            </div>
          )}
        </div>
      </div>
      <div className="divider"></div>
    </>
  );
};

export default ContactList;
