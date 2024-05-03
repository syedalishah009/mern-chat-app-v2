import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { makeRequest } from "../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await makeRequest.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      const user = response.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      // toast.success("Logged in")
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div class="flex min-h-screen w-screen items-center justify-center text-gray-600 bg-gray-50">
        <div class="relative">
          <div class="hidden sm:block h-56 w-56 text-yellow-400 absolute a-z-10 -left-20 -top-20">
            <svg
              id="patternId"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="a"
                  patternUnits="userSpaceOnUse"
                  width="40"
                  height="40"
                  patternTransform="scale(0.6) rotate(0)"
                >
                  <rect x="0" y="0" width="100%" height="100%" fill="none" />
                  <path
                    d="M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5"
                    stroke-width="1"
                    stroke="none"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width="800%"
                height="800%"
                transform="translate(0,0)"
                fill="url(#a)"
              />
            </svg>
          </div>
          <div class="hidden sm:block h-28 w-28 text-yellow-400 absolute a-z-10 -right-20 -bottom-20">
            <svg
              id="patternId"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="b"
                  patternUnits="userSpaceOnUse"
                  width="40"
                  height="40"
                  patternTransform="scale(0.5) rotate(0)"
                >
                  <rect x="0" y="0" width="100%" height="100%" fill="none" />
                  <path
                    d="M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5"
                    stroke-width="1"
                    stroke="none"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width="800%"
                height="800%"
                transform="translate(0,0)"
                fill="url(#b)"
              />
            </svg>
          </div>
          {/* <!-- Register --> */}
          <div class="relative flex flex-col sm:w-[30rem] rounded-lg border-gray-400 bg-white shadow-lg px-4">
            <div class="flex-auto p-6">
              {/* <!-- Logo --> */}
              <div class="mb-10 flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden">
                <a
                  href="#"
                  class="flex cursor-pointer items-center gap-2 text-yellow-500 no-underline hover:text-yellow-500"
                >
                  <span class="flex-shrink-0 text-yellow-500  text-3xl font-black tracking-tight opacity-100">
                    DevChat
                  </span>
                </a>
              </div>
              {/* <!-- /Logo -->  */}
              <h4 class="mb-2 font-medium text-gray-700 xl:text-xl">
                Welcome to DevChat!
              </h4>
              <form id="" class="mb-4" action="#" method="POST">
                <div class="mb-4">
                  <label
                    for="email"
                    class="mb-2 inline-block text-xs font-medium uppercase text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    class="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                    id="email"
                    name="email"
                    placeholder="Enter your email or username"
                    autofocus=""
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div class="mb-4">
                  <div class="flex justify-between">
                    <label
                      class="mb-2 inline-block text-xs font-medium uppercase text-gray-700"
                      for="password"
                    >
                      Password
                    </label>
                    {/* <a
                      href="auth-forgot-password-basic.html"
                      class="cursor-pointer text-indigo-500 no-underline hover:text-indigo-500"
                    >
                      <small class=" ">Forgot Password?</small>
                    </a> */}
                  </div>
                  <div class="relative flex w-full flex-wrap items-stretch">
                    <input
                      type="password"
                      id="password"
                      class="relative block flex-auto cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                      name="password"
                      placeholder="············"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div class="mb-4">
                  <button
                    class="grid w-full cursor-pointer select-none rounded-md border border-yellow-400 bg-yellow-500 py-2 px-5 text-center align-middle text-sm text-white shadow hover:border-yellow-600 hover:bg-yellow-600 hover:text-white focus:border-indigo-600 focus:bg-indigo-600 focus:text-white focus:shadow-none"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <p class="mb-4 text-center">
                New on DevChat?
                <Link
                  to="/signup"
                  class="cursor-pointer text-yellow-500 no-underline hover:text-yellow-600"
                >
                  {" "}
                  Create an account{" "}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
