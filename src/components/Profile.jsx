import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";
import { ToastContainer, toast } from "react-toastify";

const Profile = ({ open, setOpen }) => {
  const [onEdit, setOnEdit] = useState(false);
  const { authUser, setAuthUser, cleanData } = useContext(UserContext);
  const { updateUser } = useContext(ChatContext);

  // Local state to store updated user data
  const [updatedUsername, setUpdatedUsername] = useState(authUser.user);
  const [updatedEmail, setUpdatedEmail] = useState(authUser.email);
  const [authAvatar, setAuthAvatar] = useState(authUser.avatar);

  // Update the profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      updatedUsername === authUser.user &&
      updatedEmail === authUser.email &&
      authAvatar === authUser.avatar
    ) {
      toast.info("No changes have been made.");
      return;
    }

    const updatedInformation = {
      userId: authUser.id,
      updatedData: {
        username: updatedUsername,
        email: updatedEmail,
        avatar: authAvatar,
      },
    };

    updateUser(updatedInformation);

    // Update the local storage with the new user's details
    const detail = {
      id: authUser.id,
      user: updatedUsername,
      email: updatedEmail,
      avatar: authAvatar,
      invite: authUser.invite,
    };

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
      {/* Modal for the profile */}
      <div className={`modal ${open ? "modal-open" : ""}`}>
        <div className="modal-box relative max-w-lg">
          {/* Close button for the modal */}
          <button
            className="btn btn-outline absolute top-4 right-6"
            onClick={() => setOpen(false)}
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>

          <div className="card bg-base-100 text-base w-full mt-10">
            <div className="card-body items-center text-center">
              {/* Conditional rendering for edit mode or display mode */}
              {onEdit ? (
                <form
                  className="card-body flex flex-col gap-5 items-center sm:px-6 md:px-8 lg:px-12"
                  onSubmit={handleSubmit}
                >
                  <div className="flex flex-col justify-center items-center">
                    <div className="avatar mb-3">
                      <div className="w-24 sm:w-32 md:w-36 lg:w-40 xl:w-48 rounded-xl">
                        <img
                          src={
                            cleanData(authAvatar) || "https://i.pravatar.cc/150"
                          }
                          alt="Avatar"
                        />
                      </div>
                    </div>
                    {/* Button to choose a random avatar */}
                    <button
                      onClick={handleAvatarClick}
                      className="btn btn-outline btn-secondary text-base transition ease-in-out delay-150 hover:-translate-v-1 hover:scale-110 md:text-xs"
                    >
                      Choose
                    </button>
                  </div>

                  {/* Update the username */}
                  <div className="form-control w-full">
                    <input
                      type="text"
                      placeholder={authUser.user}
                      className="input input-bordered w-full"
                      required
                      onChange={(e) => setUpdatedUsername(e.target.value)}
                      value={cleanData(updatedUsername)}
                    />
                  </div>

                  {/* Update the email */}
                  <div className="form-control w-full">
                    <input
                      type="email"
                      placeholder={authUser.email}
                      className="input input-bordered w-full"
                      required
                      onChange={(e) => setUpdatedEmail(e.target.value)}
                      value={cleanData(updatedEmail)}
                    />
                  </div>

                  <div className="card-actions flex flex-row justify-center gap-3 w-full">
                    <button
                      type="submit"
                      className="btn btn-outline btn-primary text-base transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
                    >
                      Save
                    </button>

                    <button
                      className="btn btn-outline btn-secondary text-base transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
                      onClick={() => setOnEdit(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // Display mode showing current profile information
                <div className="flex flex-col justify-center items-center gap-3">
                  <img
                    src={authUser.avatar}
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-full mb-4"
                    alt="User Avatar"
                  />
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold">
                    {authUser.user}
                  </span>
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                    {authUser.email}
                  </span>

                  {/* Button to switch to edit mode */}
                  <button
                    className="transition ease-in-out delay-150 hover:-translate-v-1 hover:scale-110 text-indigo-500 hover:text-indigo-700 duration-300 mt-4"
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
