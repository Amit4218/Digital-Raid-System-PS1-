import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Navbar from "../components/Navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const data = { email, password };

  // This function sends login info to the backend

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      const r = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/login`,
        data
      );

      if (r.status === 200) {
        localStorage.setItem("token", r.data.token);
        localStorage.setItem("userId", r.data.user._id);
        localStorage.setItem("picture", r.data.user.personalDetails.picture);
        navigate("/raidPage");
        toast.success("Logged in successfully");
      } else {
        toast.error(r.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="p-5 mt-30 flex justify-center items-center">
        <div className="h-[32rem] w-full p-3 shadow-zinc-900 shadow-sm rounded lg:w-[50rem] lg:h-[23rem]">
          <h3 className="mt-5 text-center text-2xl mb-5">
            Official Department Access
          </h3>
          <hr className="w-full" />
          <form onSubmit={loginHandler} className="text-center text-2xl">
            <div className="mt-5 lg:flex lg:row-3 lg:gap-10 lg:items-center">
              <div className="hidden lg:block  mt-7">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-7 h-7 ml-10"
                  aria-hidden="true"
                >
                  <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path>
                </svg>
              </div>
              <label
                className="block lg:mt-5 text-xl font-bold lg:-mr-7"
                htmlFor="email"
              >
                Email
              </label>

              <input
                className="block w-full text-[18px] tracking-tighter py-[8px] px-3 mt-4 outline-none bg-[#334d68] rounded-md p-2 lg:w-[70%] lg:ml-14"
                type="email"
                placeholder="Enter Your Department Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mt-7 lg:flex lg:row-3 lg:gap-10 lg:items-center">
              <div className="hidden lg:block  mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 ml-10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z"></path>
                </svg>
              </div>
              <label
                className="block lg:mt-5 text-xl font-bold lg:-mr-7"
                htmlFor="password"
              >
                Password
              </label>

              <input
                className="block w-full text-[18px] tracking-tighter py-[8px] px-3 mt-4 outline-none bg-[#334d68] rounded-md p-2 lg:w-[70%] lg:ml-5"
                type="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                required
              />
            </div>
            <div className="lg:flex lg:justify-end  lg:mr-10 lg:text-[18px]">
              <button
                type="submit"
                className="bg-[#334d68] mt-10 px-4 py-2 rounded-sm hover:bg-[#506378] transition-colors"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
