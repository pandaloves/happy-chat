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

  // Close the sideNav when clicking outside of it
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

  // Search for a user
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

  // Clear input field
  const handleClearInput = () => {
    setSearchedUser("");
  };

  return (
    <>
      <div
        ref={sideNavRef}
        className={`sidenav flex flex-col text-base border-inherit bg-base-100 shadow-xl shadow-slate-500 absolute top-28 px-6 py-2 rounded-md z-20 transition-transform ${
          isSideNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <form
          className="relative flex items-center h-12 mt-3"
          onSubmit={handleSearch}
        >
          <input
            className="appearance-none border-2 pl-10 border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Search a user..."
            value={cleanData(searchedUser)}
            onChange={(e) => setSearchedUser(e.target.value)}
          />
          <div className="absolute right-0 inset-y-0 flex items-center pr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="-ml-1 mr-3 h-5 w-5 text-gray-400 hover:text-gray-500 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={handleClearInput}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <div className="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400 hover:text-gray-500 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </form>

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
