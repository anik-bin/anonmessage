"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from "next-auth"
import { Button } from './ui/button'

const Navbar = () => {

    const { data: session } = useSession()

    const user: User = session?.user as User
    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a className="text-xl font-bold mb-2 md:mb-0 md:order-1" href="#">AnonMessage</a>

                {session ? (
                    <>
                        <div className="flex-grow text-center md:text-center md:order-2">
                            <span className='text-sm md:text-base'>
                                Welcome, {user?.username || user?.email}
                            </span>
                        </div>
                        <div className="flex md:order-3">
                            <Button className="w-full md:w-auto text-sm py-1 px-3" onClick={() => signOut()}>Logout</Button>
                        </div>
                    </>
                ) : (
                    <Link href="/sign-in" className="md:order-2">
                        <Button className="w-full md:w-auto text-sm py-1 px-3">Login</Button>
                    </Link>
                )}
            </div>
        </nav>
    )
}

export default Navbar