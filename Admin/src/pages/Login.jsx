import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../component/Loading";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);

  const navigate = useNavigate();

  const data = { email, password };

  // This function sends login info to the backend

  const loginHandler = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      const r = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/login`,
        data
      );

      if (r.status === 200) {
        localStorage.setItem("token", r.data.token);
        localStorage.setItem("adminId", r.data.user._id);
        localStorage.setItem(
          "adminpicture",
          r.data.user.personalDetails.picture
        );
        setTimeout(() => {
          setloading(false);
        }, 500);

        navigate("/admin");
        toast.success("Logged in successfully");
      } else {
        setTimeout(() => {
          setloading(false);
        }, 300);
        toast.error(r.data.message);
      }
    } catch (err) {
      setTimeout(() => {
        setloading(false);
      }, 300);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-900">
      <form id="login-form" onSubmit={loginHandler}>
        <div className="flex flex-col gap-10 w-96 border border-amber-200 h-96 text-white p-10">
          <div className="-mt-2">
            <label className="block text-center" htmlFor="userName">
              UserName
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="my-2 w-full bg-zinc-500 rounded px-4 py-2"
              id="userName"
              placeholder="Enter Your Credentials"
            />
          </div>
          <div>
            <label className="block text-center" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="my-2 w-full bg-zinc-500 rounded px-4 py-2"
              id="password"
              placeholder="Enter Your Credentials"
            />
          </div>
          <div className="w-full hover:cursor-pointer mt-2 bg-blue-400 p-2 rounded-md text-center">
            <button className=" w-full hover:cursor-pointer" type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
