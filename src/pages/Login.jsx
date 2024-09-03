import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ImSpinner6 } from "react-icons/im";
import { IoNavigate } from "react-icons/io5";
import { ToastContainer } from "react-toastify";

const Login = () => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    authUser,
    error,
    showPassword,
    toggleShowPassword,
    isLoading,
    navigate,
    handleLogin,
    cleanData,
  } = useContext(UserContext);

  // Handle login form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();

    const pageName = "Chat";

    // Get the current time in European format
    const europeanTime = new Date().toLocaleString("en-GB", {
      timeZone: "Europe/Berlin",
    });

    // Log the user visit information to the console
    console.info(
      `[${europeanTime} user ${authUser.id} visited the ${pageName} page]`
    );
  };

  return (
    <>
      <div className="hero-content flex-col items-center mx-auto">
        <div className="card bg-base-100 w-full max-w-xl shrink-0 shadow-2xl py-6">
          <div className="text-center">
            <h3 className="h3 font-bold">
              Login <span className="text-indigo-500">Happy Chat</span>
            </h3>
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Username"
                className="input w-full input-bordered"
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
                  placeholder="Password"
                  className="input w-full input-bordered"
                  required
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={cleanData(password)}
                />
                <button
                  type="button"
                  className="btn btn-outline absolute inset-y-0 right-0 flex items-center"
                  onClick={toggleShowPassword}
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              </div>
            </div>
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-outline btn-primary text-base transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
              >
                {isLoading ? (
                  <ImSpinner6 className="animate-spin text-2xl mr-2" />
                ) : (
                  <>
                    Login
                    <IoNavigate className="ml-2" />
                  </>
                )}
              </button>
            </div>
            <div
              className="text-base flex items-center mt-3 mx-auto"
              onClick={() => navigate("/register")}
            >
              Have no account yet?
              <span className="cursor-pointer text-indigo-700 hover:text-secondary ml-2">
                Sign up
              </span>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
