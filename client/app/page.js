'use client'
import Link from 'next/link'
import Header from './components/Header'
import { useState } from 'react';

export default function Home() {
  
  return (
    <>
    <Header />
    <div className="flex flex-col mt-12 gap-6 items-center">
    <p className=" text-3xl  md:text-5xl text-center">Publish your passions, your way</p>
    <p className="text-md  md:text-lg text-center">Create a unique and beautiful blog easily.</p>
    <Link href="/card"><button className="bg-orange-500 w-36 h-10 rounded" type="submit">Create Your Blog</button></Link>
    <Link href="/veiw"><button className="bg-orange-500 w-36 h-10 rounded" type="submit">Veiw Blogs</button></Link>
    </div>
  
    </>
  )
  
}
