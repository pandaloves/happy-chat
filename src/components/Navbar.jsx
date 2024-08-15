import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import Profile from "./Profile";
import { ChatContext } from "../context/ChatContext";
import NoAvatar from "../assets/img/NoAvatar.png";

const Navbar = ({ toggleSideNav }) => {
  const [onProfile, setOnProfile] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const { users, setUsers, fetchUsers } = useContext(ChatContext);
  const { isAuthenticated, authUser, handleDeleteAccount, handleLogout } =
    useContext(UserContext);

  const [id, username, email, avatar, invite] = authUser;

  useEffect(() => {
    const loadUsers = async () => {
      if (isAuthenticated) {
        try {
          const allUsers = await fetchUsers();
          const otherUsers = allUsers.filter((user) => user.userId !== id);
          setUsers(otherUsers);
        } catch (err) {
          console.error(err);
        }
      }
    };

    loadUsers();
  }, [isAuthenticated, id]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const confirmDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      handleDeleteAccount(id);
    }
  };

  return (
    <div className="navbar shrink-0 items-center max-w-4xl mx-auto h-28 flex flex-row justify-between border-b-2 border-y-neutral-200 shadow-md shadow-neutral-500 px-6 z-20">
      <div className="flex-none relative">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-20 rounded-full">
              <img src={avatar ? avatar : NoAvatar} alt="Auth user's avatar" />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-5 shadow translate-x-36"
          >
            <li>
              <span className="text-base" onClick={() => setOnProfile(true)}>
                Profile
              </span>
            </li>
            <li>
              <span className="text-base" onClick={handleLogout}>
                Logout
              </span>
            </li>
            <div className="divider"></div>
            <li>
              <span
                className="text-base text-red-500 hover:text-red-400"
                onClick={confirmDeleteAccount}
              >
                Delete Account
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-1 flex justify-center">
        <span className="text-xl font-bold">Happy Chat</span>
      </div>

      {/* Flex container for theme controller, users icons, and hamburger menu icon */}
      <div className="flex items-center space-x-4">
        {/* Theme controller */}
        <label className="swap swap-rotate">
          {/* This hidden checkbox controls the state */}
          <input
            type="checkbox"
            className="theme-controller"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />

          {/* Sun icon */}
          <svg
            className="swap-off h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          {/* Moon icon */}
          <svg
            className="swap-on h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>

        {/* Users icons */}
        {users.length > 2 && (
          <div className="indicator">
            <span className="indicator-item badge badge-primary">
              +{users.length}
            </span>
            <div
              className="avatar-group -space-x-6 rtl:space-x-reverse"
              onClick={toggleSideNav}
            >
              {users.slice(0, 2).map((user, index) => (
                <div key={index} className="avatar">
                  <div className="w-10">
                    <img
                      src={user.avatar ? user.avatar : NoAvatar}
                      alt={`User avatar ${index}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hamburger menu icon */}
        <div className="flex-none mx-2">
          <button className="btn btn-square btn-ghost" onClick={toggleSideNav}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {onProfile && <Profile open={onProfile} setOpen={setOnProfile} />}
    </div>
  );
};

export default Navbar;
