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
            <div className=" flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8 h-[50rem] bg-center bg-contain  bg-[url(../../public/logoHaji.jpg)]">
                <div className='bg-white/10 w-[30rem] h-[30rem] rounded-sm  '>
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm ">

                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-400">
                            Sign in to your account
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full  sm:max-w-sm">
                        <form onSubmit={handleSubmit} action={(handleSubmit) => { "/dashboard" }} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-500">
                                    Username
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => {
                                            setusername(e.target.value);
                                        }}
                                        required
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-500">
                                        Password
                                    </label>

                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => {
                                            setpassword(e.target.value);
                                        }}
                                        autoComplete="current-password"
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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