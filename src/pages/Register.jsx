import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { ToastContainer } from "react-toastify";
import { ImSpinner6 } from "react-icons/im";
import { IoNavigate } from "react-icons/io5";

const Register = () => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    email,
    setEmail,
    avatar,
    setAvatar,
    error,
    isLoading,
    navigate,
    handleSignup,
    cleanData,
  } = useContext(UserContext);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailMatch, setEmailMatch] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!avatar) {
      const defaultAvatar = `https://i.pravatar.cc/150?img=${
        Math.floor(Math.random() * 70) + 1
      }`;
      setAvatar(defaultAvatar);
    }
  }, [avatar, setAvatar]);

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
    setPasswordMatch(value === password);
  };

  const handleConfirmEmailChange = (e) => {
    const { value } = e.target;
    setConfirmEmail(value);
    setEmailMatch(value === email);
  };

  const handleAvatarClick = (e) => {
    e.preventDefault();

    const randomAvatar = `https://i.pravatar.cc/150?img=${
      Math.floor(Math.random() * 70) + 1
    }`;
    setAvatar(randomAvatar);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSignup(e);
  };

  return (
    <>
      <div className="flex-col items-center mx-auto">
        <div className="card bg-base-100 w-full max-w-xl shrink-0 shadow-2xl my-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              Sign up <span className="text-indigo-500">Happy Chat</span>
            </h1>
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <form className="card-body" onSubmit={handleFormSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Username"
                className="input input-bordered w-full"
                required
                onChange={(e) => setUsername(e.target.value)}
                value={cleanData(username)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>

              <div className="relative">
                <input
                  placeholder="password"
                  className="input input-bordered w-full"
                  required
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={cleanData(password)}
                />

                <button
                  className="btn btn-outline absolute inset-y-0 right-0 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <i className="fas fa-eye-slash fa-2x"></i>
                  ) : (
                    <i className="fas fa-eye fa-2x"></i>
                  )}
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm password</span>
              </label>

              <div className="relative">
                <input
                  placeholder="Confirm password"
                  className="input input-bordered w-full"
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  onChange={handleConfirmPasswordChange}
                  value={cleanData(confirmPassword)}
                />

                <button
                  className="btn btn-outline absolute inset-y-0 right-0 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <i className="fas fa-eye-slash fa-2x"></i>
                  ) : (
                    <i className="fas fa-eye fa-2x"></i>
                  )}
                </button>
              </div>

              {!passwordMatch && (
                <span className="text-red-500 text-sm mt-1 self-end">
                  * Passwords do not match.
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={cleanData(email)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm email</span>
              </label>
              <input
                type="text"
                placeholder="Confirm email"
                className="input input-bordered w-full"
                required
                onChange={handleConfirmEmailChange}
                value={cleanData(confirmEmail)}
              />
              {!emailMatch && (
                <span className="text-red-500 text-sm mt-1 self-end">
                  * Emails do not match.
                </span>
              )}
            </div>

            <div className="flex flex-col justify-center items-center gap-3 mt-2">
              <label htmlFor="avatar" className="text-base">
                Avatar
              </label>

              <div className="avatar">
                <div className="w-24 rounded-xl">
                  <img
                    src={cleanData(avatar) || "https://i.pravatar.cc/150"}
                    alt="Avatar"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="btn btn-outline btn-secondary text-base transition ease-in-out delay-150 hover:-translate-v-1 hover:scale-110"
              >
                Click and choose
              </button>
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-outline btn-primary text-base transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300">
                {isLoading ? (
                  <ImSpinner6 className="animate-spin text-2xl mr-2" />
                ) : (
                  <>
                    Sign up
                    <IoNavigate className="ml-2" />
                  </>
                )}
              </button>
            </div>
            <div
              className="text-base flex items-center mt-3 mx-auto"
              onClick={() => navigate("/")}
            >
              Already have an account?{" "}
              <span className="cursor-pointer text-indigo-700 hover:text-secondary ml-2">
                Login
              </span>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;
