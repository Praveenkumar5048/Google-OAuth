'use client'
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faAngleDown, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link'

const Header = () => {
    
    const [isOpen, setIsOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const dropdownRef = useRef(null);
    
 useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('http://localhost:5000/checkLoggedIn', {
            method: 'GET',
            credentials: 'include' 
        });
        const data = await response.json();
        if (data.isAuthenticated) {
          setLoggedIn(true);
          setUser(data.user); 
          console.log("User is authenticated");
        } else {
          setLoggedIn(false);
          setUser(null);
          console.log("User not authenticated");
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setLoggedIn(false);
        setUser(null);
      }
    };

    checkAuthentication();
  }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleLogout = async () => {
        const response = await fetch('http://localhost:5000/logout', { method: 'GET', credentials: 'include' });
        if (response.status === 200) {
            console.log("Logged out successfully");
            setLoggedIn(false);  
            setUser(null);       
        } else {
            console.log("Error logging out");
        }
    };

    return (
        <nav className='flex justify-between'>
            <Link href="/">
                <div className='flex gap-3 m-4'>
                    <img src="/blogger.png" alt="Blogger Logo" className="h-10 w-10 rounded"/>
                    <p className='text-2xl m-auto'>Blogger</p>
                </div>
            </Link>
            {!user ? (
                <Link href="/login">
                    <button className="bg-orange-500 m-4 px-4 h-10 rounded">Login</button>
                </Link>
            ) : (
                <div ref={dropdownRef} className="relative w-fit">
                    <div onClick={toggleDropdown} className="flex items-center px-4 text-sm font-medium rounded-full text-black cursor-pointer border border-secondary transition duration-300 hover:bg-secondary-light-2 hover:shadow">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                            <img src={user.profileImage} alt={user.username} className="object-cover w-full h-full" />
                        </div>
                        <FontAwesomeIcon icon={faAngleDown} className="ml-2 text-lg" />
                    </div>

                    <ul className={`absolute top-16 w-56 right-0 bg-white rounded-lg overflow-hidden shadow transition-max-height duration-500 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                        <li className="py-2 pl-4 text-black">{user.username}</li>
                        <li className="py-2 pl-4 transition duration-300 hover:bg-secondary-light">
                            <button onClick={handleLogout} className="flex items-center text-sm font-medium text-black no-underline">
                                <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-4 text-lg w-9 h-5 bg-secondary text-orange-500 rounded-full text-center leading-9" />
                                Log out
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Header;

