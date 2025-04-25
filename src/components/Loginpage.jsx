import React, { useState } from 'react';
import axios from 'axios';
// import  { Redirect } from 'react-router-dom'

const Loginpage = () => {
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name: username,
            password: password
        }
        console.log(username, password);
        console.log(formData);
        try {

            const response = await axios.post("http://localhost:5000/api/admins", formData);
            console.log("Form data submitted successfully:", response.data);
            localStorage.setItem("token", response.data);
            window.location.reload();

        } catch (error) {

            console.error("Error submitting form data:", error);
        }
        setusername('');
        setpassword('');
    };


    return (
        <>
           <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8 h-[50rem] bg-center bg-cover bg-[url(../../public/logoHaji.jpg)] bg-gray-100">
  {/* Glassmorphism container */}
  <div className='bg-white/80 backdrop-blur-sm w-[30rem] h-[30rem] rounded-lg shadow-xl ring-1 ring-gray-200/50 p-8'>
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-800">
        Sign in to your account
      </h2>
    </div>

    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleSubmit} action={(handleSubmit) => { "/dashboard" }} className="space-y-6">
        {/* Username field with animated focus */}
        <div className="group">
          <label htmlFor="username" className="block text-sm font-medium text-gray-600 group-focus-within:text-gray-800 transition-colors">
            Username
          </label>
          <div className="mt-1 relative">
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              required
              className="block w-full rounded-md bg-white px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-all duration-200"
            />
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-600 group-focus-within:w-full transition-all duration-300"></div>
          </div>
        </div>

        {/* Password field with animated focus */}
        <div className="group">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 group-focus-within:text-gray-800 transition-colors">
              Password
            </label>
          </div>
          <div className="mt-1 relative">
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              autoComplete="current-password"
              className="block w-full rounded-md bg-white px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-all duration-200"
            />
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-600 group-focus-within:w-full transition-all duration-300"></div>
          </div>
        </div>

        {/* Submit button */}
        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-gray-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transition-colors duration-200"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
        </>
    )
}

export default Loginpage