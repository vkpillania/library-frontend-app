
"use client";
import Image from "next/image";
import BooksTable from "../components/booksTable";
import Link from "next/link";
import { apiCall } from "../../lib/api";
import { decodeJwt } from "../../lib/jwt";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  total_copies: number;
  available_copies: number;
  borrowed_copies: number;
}


export default async function AvailableBooks() {
    // const response = await apiCall("/books" , { cache: "no-store" });
    // console.log("response", response);
    // if (!response.ok) {
    //   console.log("Failed to fetch books");
    // }
    // // let isAuthenticated = true;
    // // if (response.status === 401) {
    // //   isAuthenticated = false;
    // // }
    
    // const data =  await response.json();
    // const books = data.results;

  return (
     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-between py-32 px-10 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center  text-center sm:items-start sm:text-left">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Borrow Books
          </h1>
          <div className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Explore our collection of books available for borrowing. Click on a book to learn more about it and borrow it today!
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-1">
          {books.map((book: Book) => (
            <BookRow key={book.id} {...book} />
          ))}
        </div>
      </main>
    </div>
  );
}


function BookRow(book: Readonly<Book>) {
    const handleClick = async (id: number) => {
    const token = sessionStorage.getItem("auth_token");
    alert("token" + token);
    // const res = await apiCall(`/borrows/${id}/return`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${token}`},
    //   body: JSON.stringify({ return_date: "2026-06-17T10:00:00" }),
    //   cache: "no-store",
    // });
    // if (!res.ok) {
    //   alert("error");
    };
  return (
          <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
              {/* <Image src={book.image} alt={book.title} width={400} height={300} className="w-full h-48 object-cover" /> */}
              <div className="p-4 font-xs">
                <h2 className="text-xl font-medium text-green-300">
                  <Link href={`/books/${book.id}`}>{book.title}</Link>
                  </h2>
                <p className="text-gray-600">{book.author}</p>
                <p className="text-gray-600">{book.isbn}</p>
                <p className="mt-2 text-xs text-gray-800 justify-between">{book.description}</p>
                <div className="mt-9 flex items-center justify-between">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700">Total</th>
                        <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700">Available</th>
                        <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700">Borrowed</th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-2 py-3 text-center  font-bold text-xs text-green-400">{book.total_copies}</td>
                          <td className="px-2 py-3 text-center font-bold text-xs text-green-300">{book.available_copies}</td>
                          <td className="px-2 py-3 text-center font-bold text-xs text-red-700">{book.borrowed_copies}</td>
                         </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => handleClick(Number(book.id))}>Borrow</button>
                </div>
              </div>              
      </div>
  );

}