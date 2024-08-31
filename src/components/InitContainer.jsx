import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const InitContainer = () => {
  const { authUser } = useContext(UserContext);
  const [id, username, email, avatar, invite] = authUser;

  return (
    <div className="init-container flex justify-center items-center shadow-xl shadow-slate-500 rounded-b-md">
      <div className="flex flex-col justify-center items-center gap-2">
        <i className="fa-solid fa-comments text-lg"></i>
        <h3 className="h3 font-bold">
          Welcome, <span className="font-bold text-secondary">{username}</span>!
        </h3>
      </div>
    </div>
  );
};

export default InitContainer;
