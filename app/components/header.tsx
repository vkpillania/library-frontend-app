"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Login from "./login";
import Logoff from "./logoff";

function AdminMemberNavLinks() {
  return (
        <Link href="/members" className="mr-4 hover:underline">
            Members
        </Link>
  );
}
function MemberNavLinks(id: number) {
    // console.log("id=======", id.id);
  return (
            <Link href={`/members/${id.id}/my-borrowed-books`} className="mr-4 hover:underline">
                My Borrowed Books
            </Link>
  );
}
function ContactUS() {
  return (
            <Link href="/contact-us" className="mr-4 hover:underline">
                Contact Us
            </Link>
  );
}
function AboutUS() {
  return (
            <Link href="/about-us" className="mr-4 hover:underline">
                About Us
            </Link>
  );
}
export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userid, setUserid] = useState<number | null>(null);

    useEffect(() => {
        const token = sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token");
        if (token) {
        setIsLoggedIn(true);
        const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        setUserid(payload.id);
        console.log("payload========", payload.id);
        console.log("payload", payload.member_type);
        console.table(payload);
        if (payload.exp) {
            const remainingMs = payload.exp * 1000 - Date.now();
            console.log(`Token ${remainingMs > 0 ? "valid" : "EXPIRED"}`);
        }
        if (payload.member_type === "ADMIN") {
            setIsAdmin(true);
        }
        if (payload.member_type === "USER") {
            setIsMember(true);
        }
        }
    }, []);
    return (
        <header className="bg-green-800 text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
        <Image src="/logo-horizontal-dark.svg"
            alt="Library Logo"
            width={200}
            height={200}
            className="inline-block mr-2"
            />
            <span className="align-middle">The Library</span>
            </Link>
            <div>
            <Link href="/" className="mr-4 hover:underline">
                Home
            </Link>
            <Link href="/books" className="mr-4 hover:underline">
                    Books
            </Link>
            { isLoggedIn && isMember  ? <MemberNavLinks id={Number(userid)} /> : null }
            { isLoggedIn && isAdmin  ? <AdminMemberNavLinks /> : null }
          <AboutUS /> 
          <ContactUS />
            </div>
            <div>
                {isLoggedIn ? <Logoff /> : <Login />}
            </div>

        </nav>
        </header>
    );
    }