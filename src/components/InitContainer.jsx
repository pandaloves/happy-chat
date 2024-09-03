import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const InitContainer = () => {
  const { authUser } = useContext(UserContext);

  return (
    <div className="init-container flex justify-center items-center shadow-xl shadow-slate-500 rounded-b-md">
      <div className="flex flex-col justify-center items-center gap-2">
        <i className="fa-solid fa-comments text-lg"></i>
        <h2 className="h2 font-bold">
          Welcome,{" "}
          <span className="text-lg font-bold text-secondary">
            {authUser.user}
          </span>
          !
        </h2>
      </div>
    </div>
  );
};

export default InitContainer;
