import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { v4 as uuidv4 } from "uuid";

export const ChatContext = createContext(null);

export const ChatContextProvider = ({ children }) => {
  const [conversationId, setConversationId] = useState("");
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [invitedName, setInvitedName] = useState("");
  const [invitedAvatar, setInvitedAvatar] = useState("");
  const { url, isAuthenticated, setError, cookies } = useContext(UserContext);
  const token = cookies.get("jwt_authorization");

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUsers = async () => {
        try {
          const res = await axios.get(`${url}/users`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsers(res.data);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchUsers();
    }
  }, [isAuthenticated, token, url, setError]);

  const fetchUser = async (userId) => {
    try {
      const res = await axios.get(`${url}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      setError(err.message);
    }
  };

  const updateUser = async (updatedInfo) => {
    try {
      const res = await axios.put(`${url}/user`, updatedInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const inviteUser = async (userId) => {
    const data = await fetchUser(userId);
    const userDetails = data ? data[0] : null;
    if (userDetails) {
      setInvitedName(userDetails.username);
      setInvitedAvatar(userDetails.avatar);

      console.log("invitedName:", userDetails.username);
      console.log("invitedAvatar:", userDetails.avatar);
    }

    const inviteConversationId = uuidv4();
    setConversationId(inviteConversationId);

    console.log("conversationId:", inviteConversationId);

    try {
      const res = await axios.post(
        `${url}/invite/${userId}`,
        { conversationId: inviteConversationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const createMessage = async (text) => {
    try {
      const res = await axios.post(
        `${url}/messages`,
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
      console.log("new message:", newMsg);

      setMessages((prevMessages) => [...prevMessages, newMsg]);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const res = await axios.get(
        `${url}/messages?conversationId=${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(res.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${url}/messages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages((messages) =>
        messages.filter((message) => message.id !== id)
      );
      console.log(`Deleted message with id: ${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const contextValue = {
    user,
    users,
    invitedName,
    invitedAvatar,
    messages,
    conversationId,
    updateUser,
    inviteUser,
    fetchUser,
    createMessage,
    fetchMessages,
    deleteMessage,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};
