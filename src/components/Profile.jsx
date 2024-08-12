import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";
import { ToastContainer, toast } from "react-toastify";

const Profile = ({ open, setOpen }) => {
  const [onEdit, setOnEdit] = useState(false);
  const { authUser, setAuthUser, cleanData } = useContext(UserContext);
  const [id, username, email, avatar, invite] = authUser;

  const { updateUser } = useContext(ChatContext);

  const [updatedUsername, setUpdatedUsername] = useState(username);
  const [updatedEmail, setUpdatedEmail] = useState(email);
  const [authAvatar, setAuthAvatar] = useState(avatar);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      updatedUsername === username &&
      updatedEmail === email &&
      authAvatar === avatar
    ) {
      toast.info("No changes have been made.");
      return;
    }

    const updatedInformation = {
      userId: id,
      updatedData: {
        username: updatedUsername,
        email: updatedEmail,
        avatar: authAvatar,
      },
    };

    updateUser(updatedInformation);

    const detail = [id, updatedUsername, updatedEmail, authAvatar, invite];
    localStorage.setItem("authUser", JSON.stringify(detail));
    setAuthUser(detail);
    console.log(detail);
    setOnEdit(false);
  };

  const handleAvatarClick = (e) => {
    e.preventDefault();
    const randomAvatar = `https://i.pravatar.cc/150?img=${
      Math.floor(Math.random() * 70) + 1
    }`;
    setAuthAvatar(randomAvatar);
  };

  return (
    <>
      <div className={`modal ${open ? "modal-open" : ""}`}>
        <div className="modal-box relative">
          <button
            className="btn btn-outline absolute top-4 right-6"
            onClick={() => setOpen(false)}
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>

          <div className="card bg-base-100 text-base w-96">
            <div className="card-body items-center text-center">
              {onEdit ? (
                <form className="card-body" onSubmit={handleSubmit}>
                  <div className="flex flex-col justify-center items-center">
                    <div className="avatar">
                      <div className="w-24 rounded-xl">
                        <img
                          src={
                            cleanData(authAvatar) || "https://i.pravatar.cc/150"
                          }
                          alt="Avatar"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleAvatarClick}
                      className="btn btn-outline btn-secondary text-base mt-3 transition ease-in-out delay-150 hover:-translate-v-1 hover:scale-110"
                    >
                      Click and choose
                    </button>
                  </div>

                  <div className="form-control">
                    <input
                      type="text"
                      placeholder={username}
                      className="input input-bordered w-full"
                      required
                      onChange={(e) => setUpdatedUsername(e.target.value)}
                      value={cleanData(updatedUsername)}
                    />
                  </div>

                  <div className="form-control">
                    <input
                      type="email"
                      placeholder={email}
                      className="input input-bordered w-full"
                      required
                      onChange={(e) => setUpdatedEmail(e.target.value)}
                      value={cleanData(updatedEmail)}
                    />
                  </div>

                  <div className="card-actions justify-between mt-3">
                    <button
                      className="btn btn-outline btn-secondary text-base transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
                      onClick={() => setOnEdit(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-outline btn-primary text-base transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col justify-center gap-3">
                  <img
                    src={avatar}
                    className="w-36 h-36 rounded-full"
                    alt="User Avatar"
                  />
                  <span className="username">{username}</span>
                  <span className="email">{email}</span>

                  <button
                    className="transition ease-in-out delay-150 hover:-translate-v-1 hover:scale-110 text-indigo-500 hover:text-indigo-700 duration-300"
                    onClick={() => setOnEdit(true)}
                  >
                    <i className="fa-solid fa-pen-to-square"></i> Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Profile;
