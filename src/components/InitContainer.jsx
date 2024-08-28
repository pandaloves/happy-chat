import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const InitContainer = () => {
  const { authUser } = useContext(UserContext);
  const [id, username, email, avatar, invite] = authUser;

  return (
    <div className="init-container flex justify-center items-center shadow-xl shadow-slate-500 rounded-b-md">
      <div className="flex flex-col justify-center items-center gap-2">
        <i className="fa-solid fa-comments text-3xl"></i>

        <h2 className="text-xl font-bold">
          Welcome, <span className="font-bold text-secondary">{username}</span>!
        </h2>
        <p className="text-lg">Select a user to start a conversation.</p>
      </div>
    </div>
  );
};

export default InitContainer;
