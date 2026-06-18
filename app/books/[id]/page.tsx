

// import { useParams } from "next/navigation";  
// "use client";
// import { useState, useEffect } from "react";
import Link from "next/link";
import BookBorrowHistory from "../../components/BookBorrowHistory";
import BorrowHistory from "../../components/BookHistory";
import { notFound } from "next/navigation";

interface Book {
  id: number;
  title: string;
  isbn: string;
  total_copies: number;
  available_copies: number;
  borrowed_copies: number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://0.0.0.0:8000/api/v1";

async function getBook(id: string): Promise<Book | null> {
  try {
    const res = await fetch(`${API_URL}/books/${id}`, { cache: "no-store" });
    console.log("res", res);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch book: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("Error fetching member:", error);
    return null;
  }
} 


export default async function BookDetailPage({ params }: PageProps) {
  const { id } = await params;
  const book = await getBook(id);
  console.log("book", book);

  if (!book) {
    notFound();
  }

  const isAvailable = book.available_copies > 0;
  const availabilityColor = isAvailable ? "text-green-700" : "text-red-700";
  const availabilityBg = isAvailable ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
  const publishedYear = new Date(book.publishedDate).getFullYear();
  const coverInitials = book.title
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
    
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // // const [isMember, setIsMember] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);
  // useEffect(() => {
  // const token = sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token");
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token");
  }
  let isLoggedIn = false;
  let isAdmin = false;
  if (token) {
    isLoggedIn = true;
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    console.log("payload", payload.member_type);
    console.table(payload);
    if (payload.exp) {
        const remainingMs = payload.exp * 1000 - Date.now();
        console.log(`Token ${remainingMs > 0 ? "valid" : "EXPIRED"}`);
    }
    if (payload.member_type === "ADMIN") {
        isAdmin = true;
    }
    if (payload.member_type === "USER") {
        isAdmin = true;
    }
  }
      // }, []);
  return (
     <div className="max-w-5xl mx-auto p-6">
      {/* Breadcrumb */}
      <Link
        href="/books"
        className="text-green-600 hover:underline text-sm mb-4 inline-block"
      >
        ← Back to books
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid md:grid-cols-3 gap-8 p-6 md:p-8">
          {/* Cover */}
          <div>
            <div className="aspect-[3/4] bg-gradient-to-br from-green-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <span className="text-6xl font-bold">{coverInitials}</span>
            </div>

            {/* Availability badge */}
            <div className={`mt-4 px-3 py-2 border rounded ${availabilityBg}`}>
              <p className={`text-sm font-medium ${availabilityColor}`}>
                {isAvailable ? "✓ Available" : "✗ Out of stock"}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {book.available_copies} of {book.total_copies} copies available
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-lg text-gray-600 mb-1">by {book.author}</p>
            <p className="text-sm text-gray-500 mb-4">
              {book.publisher} · {publishedYear}
            </p>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-900 mb-2">About this book</h2>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Metadata label="ISBN" value={book.isbn} />
              <Metadata label="Pages" value={book.pages.toString()} />
              <Metadata label="Price" value={`$${book.price.toFixed(2)}`} />
              <Metadata
                label="Published"
                value={new Date(book.published_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                // onClick={handleBorrow}
                // disabled={!isAvailable || borrowing}
                className="bg-green-600 text-white font-medium px-6 py-2.5 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {/* {borrowing ? "Borrowing..." : isAvailable ? "Borrow this book" : "Not available"} */}
              </button>
              <Link
                href={`/books/${book.id}/edit`}
                className="border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded hover:bg-gray-50 transition-colors"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 md:px-8 py-4 grid grid-cols-3 gap-4">
          <Stat label="Total copies" value={book.total_copies} />
          <Stat label="Available" value={book.available_copies} />
          <Stat label="Currently borrowed" value={book.borrowed_copies} />
        </div>
      </div>

      {/* Borrow history */}
      {isLoggedIn && isAdmin && book.borrow_records && book.borrow_records.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent borrows</h2>
          {/* <BookBorrowHistory borrowers={book.borrow_records} /> */}
          <BorrowHistory records={book.borrow_records} />
        </div>
      )}
    </div>
  );
}
  
// ============ Helper components ============

function Metadata({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-gray-900 font-medium">{value}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}
