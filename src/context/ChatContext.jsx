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

  const inviteUser = async (userId) => {
    try {
      const data = await fetchUser(userId);
      const invitedUser = data ? data[0] : null;

      if (invitedUser) {
        console.log("Invited userDetails:", invitedUser);
        setInvitedName(invitedUser.username);
        setInvitedAvatar(invitedUser.avatar);
      }
      console.log("authUser.invite:", authUser.invite);
      console.log("Invited userDetails.invite:", invitedUser.invite);
      
      let newConversationId = null;

      const inviteArray = JSON.parse(invitedUser.invite || "[]");
      const invitedData = inviteArray.find(
        (inviteItem) => inviteItem.username === authUser.user
      );

      const authInviteArray = JSON.parse(authUser.invite || "[]");
      const authInvitedData = authInviteArray.find(
        (inviteItem) => inviteItem.username === invitedUser.username
      );

      if (invitedData) {
        newConversationId = invitedData.conversationId;
      } else if (authInvitedData) {
        newConversationId = authInvitedData.conversationId;
      }

      console.log("invited User:", invitedUser.username);
      console.log("conversationId:", newConversationId);
      setConversationId(newConversationId);

      const inviteExists = inviteArray.find(
        (inviteItem) => inviteItem.conversationId === newConversationId
      );
      const authInviteExists = authInviteArray.find(
        (inviteItem) => inviteItem.conversationId === newConversationId
      );

      if (!inviteExists && !authInviteExists) {
        let newConversationId = uuidv4();
        setConversationId(newConversationId);

        await axios.post(
          `/invite/${userId}`,
          { conversationId: newConversationId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
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
      console.log(newMsg);

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
          timeout: 5000,
        }
      );
      setMessages(res.data);
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please try again later.");
      } else {
        setError(err.message);
      }
      console.error("Error:", err);
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
