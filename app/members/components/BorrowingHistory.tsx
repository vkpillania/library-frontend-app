"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiCall } from "../../../lib/api";
interface BorrowRecord {
  id: number;
  book_id: number;
  member_id: number;
  book_title?: string;
  book_author?: string;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: "BORROWED" | "RETURNED";
  fine_amount?: number;
}

interface BorrowingHistoryProps {
  borrows: BorrowRecord[];
}

export default function BorrowingHistory({ borrows }: BorrowingHistoryProps) {
  const [filter, setFilter] = useState<"active" | "returned" | "all">("active");
  
  console.log("borrows  ==========", borrows , "=============" ,filter);
  const today = new Date();
  
  const filtered = borrows.filter((b) => {
    if (filter === "active") return b.borrow_status === "BORROWED";
    if (filter === "returned") return b.borrow_status === "RETURNED";
    return true;
  });

  // Sort: overdue first, then by date
  const sorted = [...filtered].sort((a, b) => {
    const aOverdue = a.borrow_status === "BORROWED" && new Date(a.due_date) < today;
    const bOverdue = b.borrow_status === "BORROWED" && new Date(b.due_date) < today;
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    return new Date(b.borrow_date).getTime() - new Date(a.borrow_date).getTime();
  });

  const activeCount = borrows.filter((b) => b.borrow_status === "BORROWED").length;
  const returnedCount = borrows.filter((b) => b.borrow_status === "RETURNED").length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header with filter tabs */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-lg font-bold text-gray-900">Borrowing History</h2>
        <div className="flex gap-2">
          <TabButton active={filter === "active"} onClick={() => setFilter("active")}>
            Active ({activeCount})
          </TabButton>
          <TabButton active={filter === "returned"} onClick={() => setFilter("returned")}>
            Returned ({returnedCount})
          </TabButton>
          <TabButton active={filter === "all"} onClick={() => setFilter("all")}>
            All ({borrows.length})
          </TabButton>
        </div>
      </div>

      {/* Empty state */}
      {sorted.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-500">
            {filter === "active" && "This member isn't borrowing any books right now."}
            {filter === "returned" && "No returned books yet."}
            {filter === "all" && "This member has never borrowed a book."}
          </p>
        </div>
      )}

      {/* Records table */}
      {sorted.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Book
                </th>
                {/* <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Title
                </th> */}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Borrowed
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Due / Returned
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Fine
                </th>
               <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((record) => (
                <BorrowRow key={record.id} record={record} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BorrowRow({ record }: { record: BorrowRecord }) {
  const router = useRouter();
  const isOverdue =
    record.status === "BORROWED" && new Date(record.due_date) < new Date();

  const overdueDays = isOverdue
    ? Math.floor(
        (new Date().getTime() - new Date(record.due_date).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;
  const handleClick = async (id: number) => {
    const token = sessionStorage.getItem("auth_token");
    const res = await apiCall(`/borrows/${id}/return`, {
      method: "POST",
      headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${token}`},
      body: JSON.stringify({ return_date: "2026-06-17T10:00:00" }),
      cache: "no-store",
    });
    if (!res.ok) {
      alert("error");
    } else {
      router.push(`/members/${record.member_id}`);
    }

  };
  return (
    <tr
      className={`border-b border-gray-100 hover:bg-gray-50 ${
        isOverdue ? "bg-red-50/50" : ""
      }`}
    >
      {/* Book */}
      <td className="px-4 py-3">
        <Link
          href={`/books/${record.book_id}`}
          className="block hover:underline"
        >
          <p className="font-medium text-gray-900">
            {record.book_title || `Book #${record.book_id}`}
          </p>
          {record.book_author && (
            <p className="text-sm text-gray-500 italic">
              by {record.book_author}
            </p>
          )}
        </Link>
      </td>
  {/* <td className="px-4 py-3">
    {record.booktitle || `Book #${record.book_id}`}
  </td> */}
      {/* Borrowed date */}
      <td className="px-4 py-3 text-sm text-gray-700">
        {formatDate(record.borrow_date)}
      </td>

      {/* Due / Returned date */}
      <td className="px-4 py-3 text-sm">
        {record.return_date ? (
          <div>
            <p className="text-green-700 font-medium">
              ✓ {formatDate(record.return_date)}
            </p>
            <p className="text-xs text-gray-500">
              was due {formatDate(record.due_date)}
            </p>
          </div>
        ) : (
          <div className={isOverdue ? "text-red-700" : "text-gray-700"}>
            <p className="font-medium">{formatDate(record.due_date)}</p>
            {isOverdue && (
              <p className="text-xs">
                {overdueDays} {overdueDays === 1 ? "day" : "days"} late
              </p>
            )}
          </div>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3 text-center">
        {record.status === "RETURNED" ? (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
            Returned
          </span>
        ) : isOverdue ? (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
            Overdue
          </span>
        ) : (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
            Active
          </span>
        )}
      </td>

      {/* Fine */}
      <td className="px-4 py-3 text-right text-sm">
        {record.fine_amount && record.fine_amount > 0 ? (
          <span className="text-red-600 font-medium">
            ₹{record.fine_amount.toFixed(2)}
          </span>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-right text-sm">
        { record.borrow_status === "BORROWED" ? <button  className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => handleClick(record.id)}>Return</button> : <span>Already returned</span>}
        {/* <button  className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => handleClick(record.id)}>Return</button> */}
      </td>
    </tr>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
        active
          ? "bg-green-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
