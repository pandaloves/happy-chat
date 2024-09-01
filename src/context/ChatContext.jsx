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
      const userDetails = data ? data[0] : null;

      if (userDetails) {
        setInvitedName(userDetails.username);
        setInvitedAvatar(userDetails.avatar);
      }

      let newConversationId = uuidv4();

      const inviteArray = JSON.parse(userDetails.invite || "[]");
      const invitedData = inviteArray.find(
        (inviteItem) => inviteItem.username === authUser.user
      );

      console.log(userDetails.invite);

      let parsedInvite = [];
      if (authUser.invite) {
        try {
          parsedInvite = JSON.parse(authUser.invite);
        } catch (error) {
          console.error("Failed to parse invite:", error);
          setError("Failed to parse invite data");
          return;
        }
      }
      console.log(authUser.invite);

      const authInvitedData = parsedInvite.find(
        (inviteItem) => inviteItem.username === userDetails.username
      );

      if (invitedData) {
        newConversationId = invitedData.conversationId;
      } else if (authInvitedData) {
        newConversationId = authInvitedData.conversationId;
      }

      console.log("invited User:", userDetails.username);
      console.log("conversationId:", newConversationId);
      setConversationId(newConversationId);

      const inviteExists = inviteArray.find(
        (inviteItem) => inviteItem.conversationId === newConversationId
      );
      const authInviteExists = parsedInvite.find(
        (inviteItem) => inviteItem.conversationId === newConversationId
      );

      if (!inviteExists && !authInviteExists) {
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
    let retries = 3;
    while (retries > 0) {
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
        return;
      } catch (err) {
        if (err.code === "ECONNABORTED" && retries > 0) {
          retries -= 1;
        } else {
          setError("Request failed. Please try again later.");
          console.error("Error:", err);
          return;
        }
      }
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
