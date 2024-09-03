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

  // Fetch the list of users
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

  // Fetch a specific user by userId
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

  // Update profile
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

  // Invite a user to a conversation and decide if a new conversationId is needed
  const inviteUser = async (userId) => {
    try {
      // Fetch the invited user's details
      const data = await fetchUser(userId);
      const invitedUser = data ? data[0] : null;

      if (invitedUser) {
        console.log("Invited userDetails:", invitedUser);
        setInvitedName(invitedUser.username);
        setInvitedAvatar(invitedUser.avatar);
      }

      let newConversationId = null;

      // Check existing invitations for conversation ID
      if (invitedUser) {
        const inviteArray = JSON.parse(invitedUser.invite || "[]");
        const authInviteArray = JSON.parse(authUser.invite || "[]");

        const invitedData = inviteArray.find(
          (inviteItem) => inviteItem.username === authUser.user
        );
        const authInvitedData = authInviteArray.find(
          (inviteItem) => inviteItem.username === invitedUser.username
        );

        if (invitedData) {
          newConversationId = invitedData.conversationId;
        } else if (authInvitedData) {
          newConversationId = authInvitedData.conversationId;
        }

        if (newConversationId) {
          console.info("Existing conversation found:", newConversationId);
          setConversationId(newConversationId);
        } else {
          // Generate a new ConversationId if there is no existing conversationId
          newConversationId = uuidv4();
          setConversationId(newConversationId);

          // Create a new conversation and invite the user
          await axios.post(
            `/invite/${userId}`,
            { conversationId: newConversationId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.info("Newly created conversationId:", newConversationId);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  // Create a new message in the conversation
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
      setMessages((prevMessages) => [...prevMessages, newMsg]);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  // Fetch all the messages for a specific conversation
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

  // Delete a specific message by its ID
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
