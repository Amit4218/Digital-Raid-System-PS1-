import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function Register() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const data = { userName, password };

  const registerHandler = async (e) => {
    e.preventDefault();

    try {
      const r = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/register`,
        data
      );
      if (r.status == 200) {
        toast.success(r.data.message);
        setTimeout(() => {
          navigate("/");
        }, 800);
      } else {
        toast.error(r.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className=" h-screen flex items-center justify-center bg-zinc-900">
        <form onSubmit={registerHandler}>
          <div className="col border border-amber-200 h-60 text-white  p-5">
            <div className="-mt-2">
              <label className="block text-center" htmlFor="userName">
                UserName
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                className="my-2 w-full bg-zinc-500 rounded px-4 py-2"
                id="userName"
                placeholder="Enter Your Credientials"
                name="userName"
              />
            </div>
            <div className="">
              <label className="block text-center" htmlFor="password">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="my-2 w-full bg-zinc-500 rounded px-4 py-2"
                name="password"
                type="Password"
                id="password"
                placeholder="Enter Your Credientials"
              />
            </div>
            <div className="mt-2 bg-blue-400 px-2 py-2 rounded-md text-center">
              <button type="submit">submit</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;
