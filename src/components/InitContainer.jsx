import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const InitContainer = () => {
  const { authUser } = useContext(UserContext);

  return (
    <div className="init-container flex justify-center items-center shadow-xl shadow-slate-500 rounded-b-md">
      <div className="flex flex-col justify-center items-center gap-2">
        <i className="fa-solid fa-comments text-lg"></i>
        <p className="text-lg sm:text-xs font-bold">
          Welcome,{" "}
          <span className="text-lg sm:text-xs font-bold text-secondary">
            {authUser.user}
          </span>
          !
        </p>
      </div>
    </div>
  );
};

export default InitContainer;
