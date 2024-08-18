import { createContext, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "../utils/AxiosConfig";
import { decodeToken } from "react-jwt";
import DOMPurify from "dompurify";

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("authUser")) || []
  );
  const navigate = useNavigate();

  const toggleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !avatar) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const csrfResponse = await axios.patch(`/csrf`);
      setCsrfToken(csrfResponse.data.csrfToken);
      localStorage.setItem("csrfToken", csrfResponse.data.csrfToken);

      await axios.post(`/auth/register`, {
        username,
        password,
        email,
        avatar,
        csrfToken: csrfResponse.data.csrfToken,
      });

      toast.success("Registered successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (e) {
      if (
        e.response &&
        (e.response.status === 400 ||
          e.response.data.message === "Username or email already exists!")
      ) {
        toast.error("Username or email already exists!");
      } else {
        toast.error(
          e.response?.data?.message || "An error occurred. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      let currentCsrfToken = csrfToken;
      if (!currentCsrfToken) {
        const csrfResponse = await axios.patch(`/csrf`);
        currentCsrfToken = csrfResponse.data.csrfToken;
        setCsrfToken(currentCsrfToken);
        localStorage.setItem("csrfToken", currentCsrfToken);
      }

      const loginResponse = await axios.post(`/auth/token`, {
        username,
        password,
        csrfToken: currentCsrfToken,
      });

      const token = loginResponse.data.token;
      setToken(token);
      setIsAuthenticated(true);
      localStorage.setItem("token", token);

      // Decode the JWT token to access claims
      const decodedToken = decodeToken(token);

      const { id, user, email, avatar, invite } = decodedToken;
      const userDetail = [id, user, email, avatar, invite];

      setAuthUser(userDetail);
      localStorage.setItem("authUser", JSON.stringify(userDetail));

      toast.success("Logged in successfully!");
      setTimeout(() => {
        navigate("/chat");
      }, 1000);
    } catch (e) {
      toast.error(e.response?.data?.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("csrfToken");
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");

    toast.error("Logged out successfully!");

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleDeleteAccount = async (userId) => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to delete your account.");
      return;
    }

    try {
      await axios.delete(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Your account has been deleted successfully!");

      setTimeout(() => {
        handleLogout();
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error("Failed to delete the account. Please try again later.");
    }
  };

  const cleanData = (inputValue) => {
    return DOMPurify.sanitize(inputValue, { FORBID_TAGS: ["marquee"] });
  };

  const contextValue = {
    username,
    setUsername,
    csrfToken,
    token,
    email,
    setEmail,
    password,
    setPassword,
    avatar,
    setAvatar,
    authUser,
    setAuthUser,
    isAuthenticated,
    error,
    setError,
    isLoading,
    showPassword,
    toggleShowPassword,
    navigate,
    handleSignup,
    handleLogin,
    handleLogout,
    handleDeleteAccount,
    cleanData,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
