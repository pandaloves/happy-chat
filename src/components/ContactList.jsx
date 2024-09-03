import { useContext, useRef, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import SpecificUser from "./SpecificUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../context/UserContext";

const ContactList = ({ user, setChat, matchedUser }) => {
  const [isAuthFriend, setIsAuthFriend] = useState(false);
  const { fetchUser, inviteUser } = useContext(ChatContext);
  const { authUser } = useContext(UserContext);

  const itemRef = useRef(null);

  // Scroll to the matched user if needed
  useEffect(() => {
    if (matchedUser === user.userId && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [matchedUser, user.userId]);

  // Check if the user is the authenticated user's friend
  useEffect(() => {
    const checkFriendStatus = async () => {
      const data = await fetchUser(user.userId);
      const invitedUser = data ? data[0] : null;

      if (invitedUser) {
        const inviteArray = JSON.parse(invitedUser.invite || "[]");
        const authInviteArray = JSON.parse(authUser.invite || "[]");

        const invitedData = inviteArray.find(
          (inviteItem) => inviteItem.username === authUser.user
        );
        const authInvitedData = authInviteArray.find(
          (inviteItem) => inviteItem.username === user.username
        );

        if (invitedData || authInvitedData) {
          setIsAuthFriend(true);
        }
      }
    };

    checkFriendStatus();
  }, [authUser, user.userId, user.username]);

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

        {/* Display a heart icon and "Friend" label if applicable */}
        <div className="flex flex-col items-center gap-1">
          {isAuthFriend && (
            <div className="flex flex-row items-center gap-1">
              <FontAwesomeIcon
                icon={faHeart}
                style={{ color: "#f162e7", width: "20px", height: "20px" }}
              />
              <p className="text-xs font-semibold italic text-indigo-500">
                Friend
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="divider"></div>
    </>
  );
};

export default ContactList;
