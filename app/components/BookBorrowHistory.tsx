"use client";

import { useState } from "react";

interface BorrowRecord {
  id: number;
  member_id: number;
  member_name: string;
  member_email: string;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: "BORROWED" | "RETURNED";
  fine_amount: number;
}

interface BookBorrowHistoryProps {
  borrowers: BorrowRecord[];
}

export default function BookBorrowHistory({ borrowers }: BookBorrowHistoryProps) {
  const [filter, setFilter] = useState<"active" | "all">("active");

  const filtered = filter === "active"
    ? borrowers.filter((b) => b.status === "BORROWED")
    : borrowers;

  const activeCount = borrowers.filter((b) => b.status === "BORROWED").length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header with toggle */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Borrow History</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1 text-sm rounded ${
              filter === "active"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Currently borrowing ({activeCount})
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-sm rounded ${
              filter === "all"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({borrowers.length})
          </button>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          {filter === "active"
            ? "No one is borrowing this book right now."
            : "This book has never been borrowed."}
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Member
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Borrowed
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Due / Returned
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Fine
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((record) => {
              const isOverdue =
                record.status === "BORROWED" &&
                new Date(record.due_date) < new Date();

              return (
                <tr
                  key={record.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    isOverdue ? "bg-red-50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{record.member_name}</p>
                    <p className="text-sm text-gray-500">{record.member_email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatDate(record.borrow_date)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {record.return_date ? (
                      <span className="text-green-700">
                        Returned {formatDate(record.return_date)}
                      </span>
                    ) : (
                      <span className={isOverdue ? "text-red-700 font-medium" : "text-gray-700"}>
                        Due {formatDate(record.due_date)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {record.status === "RETURNED" ? (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        Returned
                      </span>
                    ) : isOverdue ? (
                      <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                        Overdue
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    {record.fine_amount > 0 ? (
                      <span className="text-red-600 font-medium">
                        ₹{record.fine_amount.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
