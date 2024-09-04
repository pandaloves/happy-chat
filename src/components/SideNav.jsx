import { useContext, useState, useRef, useEffect } from "react";
import ContactList from "./ContactList";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";
import { toast, ToastContainer } from "react-toastify";

const SideNav = ({ setChat, isSideNavOpen, setIsSideNavOpen }) => {
  const [searchedUser, setSearchedUser] = useState("");
  const [matchedUser, setMatchedUser] = useState("");
  const { users } = useContext(ChatContext);
  const { authUser, cleanData } = useContext(UserContext);
  const sideNavRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
        setIsSideNavOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [setIsSideNavOpen]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchedUser) {
      toast.error("Please enter a username to search.");
      return;
    }

    if (searchedUser.toLowerCase() === authUser.user.toLowerCase()) {
      toast.error("You cannot search yourself as a friend! Please try again.");
      return;
    }

    const user = users.find(
      (c) => c.username.toLowerCase() === searchedUser.toLowerCase()
    );

    if (user) {
      setSearchedUser("");
      setMatchedUser(user.userId);
    } else {
      toast.error("No such user found! Please try again.");
    }
  };

  return (
    <>
      <div
        ref={sideNavRef}
        className={`sidenav flex flex-col text-base border-inherit bg-base-100 shadow-xl shadow-slate-500 absolute top-28 px-6 py-2 rounded-md z-20 transition-transform ${
          isSideNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-full flex items-center justify-center">
          <form
            className="w-full flex flex-row items-center space-x-2"
            onSubmit={handleSearch}
          >
            <input
              className="input input-bordered w-full md:w-auto p-2 rounded-lg"
              placeholder="Search a user..."
              value={cleanData(searchedUser)}
              onChange={(e) => setSearchedUser(e.target.value)}
            />
            <button
              className="btn p-2 bg-blue-500 text-white rounded-lg"
              type="submit"
              onTouchStart={handleSearch}
            >
              Search
            </button>
          </form>
        </div>

        <div className="divider"></div>

        <div className="overflow-y-scroll">
          {users.map((user) => (
            <ContactList
              key={user.userId}
              user={user}
              setChat={setChat}
              matchedUser={matchedUser}
            />
          ))}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SideNav;
