'use client'
import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation';

const login = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    const handleLogin = async (e) => {
        e.preventDefault();
        const userDetails = {email : email, password : password};
        try {
      
            const response = await fetch('http://localhost:5000/user/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(userDetails),
            });
        
            if (response.status === 200) {
              console.log('Login successful!');
              setEmail('');
              setPassword('');
              window.location.href = '/'
            } else {
              console.error('Failed to Login:', response.status);
            }
          } catch (error) {
            console.error('Error While Login:', error);
          }
    }

    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        window.location.href = "http://localhost:5000/google/login";
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"></a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <div className='mx-auto h-20 w-20 rounded bg-orange-500'>
                            <img src="/blog-new-logo.svg" alt="Blogger Logo" className='p-1'/>
                        </div>
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Hey!! Welcome Back
                        </h1>
                        <p className='text-gray-500'>Sign in to your account</p>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                           
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  
                                required=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}></input>
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password"className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                required=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}></input>
                            </div>
                            
                            <button type="submit" className="w-full text-black bg-orange-500 hover:bg-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Sign in</button>
                            
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don't have an account yet? <a href="/register" className="font-medium text-blue-400 hover:underline dark:text-primary-500">Register</a>
                            </p>
                        </form>
                        <p className="text-center text-black">or</p>
                        <div className="flex items-center justify-center dark:bg-gray-800">
                            <button onClick={handleGoogleLogin} className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-green-400 hover:text-slate-900 hover:shadow transition duration-150">
                                <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"></img>
                                <span>Login with Google</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default login