import { useContext, useState, useRef, useEffect } from "react";
import ContactList from "./ContactList";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";
import { toast, ToastContainer } from "react-toastify";

const SideNav = ({ setChat, isSideNavOpen, setIsSideNavOpen }) => {
  const [searchedUser, setSearchedUser] = useState("");
  const [matchedUser, setMatchedUser] = useState(null);
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
        <div className="h-20 w-full flex items-center pt-4">
          <form
            className="rounded-lg w-full my-0 mx-2 flex items-center"
            onSubmit={handleSearch}
          >
            <div className="join w-full">
              <input
                className="input input-bordered join-item w-full"
                placeholder="Search a user..."
                value={cleanData(searchedUser)}
                onChange={(e) => setSearchedUser(e.target.value)}
              />
              <button className="btn join-item rounded-r-full">Search</button>
            </div>
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
