import { createContext, useContext, useState } from "react";
import axios from "../utils/AxiosConfig";
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";

export const ChatContext = createContext(null);

export const ChatContextProvider = ({ children }) => {
  const [conversationId, setConversationId] = useState("");
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [invitedName, setInvitedName] = useState("");
  const [invitedAvatar, setInvitedAvatar] = useState("");
  const { authUser, setError } = useContext(UserContext);
  const [id, username, email, avatar, invite] = authUser;
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const fetchUser = async (userId) => {
    try {
      const res = await axios.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const updateUser = async (updatedInfo) => {
    try {
      await axios.put(`/user`, updatedInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Updated the profile successfully!");
    } catch (err) {
      toast.error("Failed to update the profile!");
      setError(err.message);
      console.error(err);
    }
  };

  const inviteUser = async (username, userId) => {
    try {
      /*
      const data = await fetchUser(userId);
      const userDetails = data ? data[0] : null;

      if (userDetails) {
        setInvitedName(userDetails.username);
        setInvitedAvatar(userDetails.avatar);

        console.info("invitedName:", userDetails.username);
        console.info("invitedAvatar:", userDetails.avatar);
      }
      */

      const inviteArray = JSON.parse(invite);
      const invitedData = inviteArray.find(
        (inviteItem) => inviteItem.username === username
      );

      const idToUse = invitedData ? invitedData.conversationId : uuidv4();

      setConversationId(idToUse);

      const res = await axios.post(
        `/invite/${userId}`,
        { conversationId: idToUse },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("conversationId used in invite:", idToUse);
      console.info(res.data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const createMessage = async (text) => {
    try {
      const res = await axios.post(
        `/messages`,
        {
          text,
          conversationId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newMsg = res.data.latestMessage;
      console.info("new message:", newMsg);

      setMessages((prevMessages) => [...prevMessages, newMsg]);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const res = await axios.get(
        `/messages?conversationId=${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(res.data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`/messages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages((messages) =>
        messages.filter((message) => message.id !== id)
      );
      console.warn(`Deleted message with id: ${id}`);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const contextValue = {
    users,
    setUsers,
    user,
    setUser,
    invitedName,
    invitedAvatar,
    messages,
    conversationId,
    setConversationId,
    updateUser,
    inviteUser,
    fetchUsers,
    fetchUser,
    createMessage,
    fetchMessages,
    deleteMessage,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};
