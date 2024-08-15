import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import { UserContextProvider } from "./context/UserContext";
import NotFound from "./pages/NotFound";
import { ChatContextProvider } from "./context/ChatContext";
import { useEffect } from "react";

function App() {
  console.log(import.meta.env);

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  return (
    <>
      <UserContextProvider>
        <ChatContextProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/chat" element={<Chat />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ChatContextProvider>
      </UserContextProvider>
    </>
  );
}

export default App;
