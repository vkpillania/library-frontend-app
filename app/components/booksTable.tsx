"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import { apiCall } from "../../lib/api";
interface Book {
  id: number;
  title: string;
  isbn: string;
  total_copies: number;
  available_copies: number;
  borrowed_copies: number;
}

interface BooksTableProps {
  books?: Book[];
}

export default function BooksTable({books}: BooksTableProps) {
  const router = useRouter();
  const handleBorrow = async (id: number) => {
    const token = sessionStorage.getItem("auth_token");
    if (token) {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    console.table(payload);
    
    if (payload.exp) {
      const remainingMs = payload.exp * 1000 - Date.now();
      console.log(`Token ${remainingMs > 0 ? "valid" : "EXPIRED"}`);
    }
    const res = await apiCall(`/borrows`, {
      method: "POST",
      headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${token}`},
      body: JSON.stringify({ book_id: id , member_id: payload.id , borrow_days:14}),
      cache: "no-store",
    });
    if (!res.ok) {
      alert("error");
    } else {
      router.push("/books");
      // alert("Book borrowed successfully");
    }

}
    // const res = await apiCall(`/borrows/${id}/return`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${token}`},
    //   body: JSON.stringify({ return_date: "2026-06-17T10:00:00" }),
    //   cache: "no-store",
    // });
    // if (!res.ok) {
    //   alert("error");
    // };
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-300 bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Book Title</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ISBN</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Total</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Borrowed</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Available</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">View Details</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Borrow</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-600">{book.id}</td>
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">{book.title}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{book.isbn}</td>
              <td className="px-4 py-3 text-sm text-center">{book.total_copies}</td>
              <td className="px-4 py-3 text-sm text-center">{book.borrowed_copies}</td>
              <td className="px-4 py-3 text-sm text-center">
                <span className={book.available_copies === 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                  {book.available_copies}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-center">
                <span className="text-green-600 hover:underline cursor-pointer">
                  <Link href={`/books/${book.id}`}>View Details</Link>
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-center">
                <span className="text-green-600 hover:underline cursor-pointer">
                  <button className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => handleBorrow(Number(book.id))}>Borrow</button>
                </span>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
