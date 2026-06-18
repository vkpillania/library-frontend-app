"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { api, getToken } from "@/lib/api";
import { apiCall } from "../../../../lib/api";

// ============ Types — match your backend model ============

type BorrowStatus = "BORROWED" | "RETURNED" | "OVERDUE";
type FineStatus = "PENDING" | "PAID" | "WAIVED";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
}

interface BorrowRecord {
  id: number;
  member_id: number;
  book_id: number;
  borrow_date: string;
  due_date: string | null;
  return_date: string | null;
  borrow_status: BorrowStatus | null;
  fine_amount: number | null;
  fine_date: string | null;
  fine_status: FineStatus | null;
  created_at: string;
  updated_at: string;
  book?: Book;
}

type Tab = "active" | "returned" | "all";

interface PageProps {
  params: Promise<{ id: string }>;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://0.0.0.0:8000/api/v1";

// ============ Component ============

export default function MyBorrowedBooksPage() {
  const router = useRouter();
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("active");
  const [returningId, setReturningId] = useState<number | null>(null);

  // ============ Load borrows ============

  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");
    if (!token) {
      router.push("/login?redirect=/my-borrows");
      return;
    }
    loadBorrows();
  }, [router]);
  const loadBorrows = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        member_id: 1,
      };
      const res = await apiCall("/borrows?member_id=1", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify(payload),
      cache: "no-store",

    });
    const data = await res.json();
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || `Server returned ${res.status}`);
    }
      const records = Array.isArray(data) ? data : data.results || [];
      console.log("records", records);
      setBorrows(records);
    } catch (err: any) {
      if (err.status !== 401) {
        setError(err.message || "Failed to load borrows");
        console.log("err", err);
      }
    } finally {
      setLoading(false);
      // console.log("finally", borrows);

    }
  };

  useEffect(() => {
  loadBorrows();
}, []);
  // loadBorrows();


  // ============ Return book action ============

  const handleReturn = async (borrowId: number) => {
    if (!confirm("Mark this book as returned?")) return;

    setReturningId(borrowId);
    try {
      await apiCall(`/borrows/${borrowId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrow_status: "RETURNED", return_date: new Date().toISOString() }),
        cache: "no-store",
      });
      await loadBorrows();
    } catch (err: any) {
      alert(err.message || "Failed to return book");
    } finally {
      setReturningId(null);
    }
  };

  // ============ Derived state ============

  const enriched = useMemo(() => {
    return borrows.map((b) => ({
      ...b,
      isActive: b.borrow_status === "BORROWED" || b.borrow_status === "OVERDUE",
      isReturned: b.borrow_status === "RETURNED" || !!b.return_date,
      isOverdue:
        !b.return_date &&
        b.due_date != null &&
        new Date() > new Date(b.due_date),
      daysOverdue:
        !b.return_date && b.due_date
          ? Math.max(
              0,
              Math.floor(
                (Date.now() - new Date(b.due_date).getTime()) / 86_400_000
              )
            )
          : 0,
    }));
  }, [borrows]);

  const filtered = useMemo(() => {
    if (tab === "active") return enriched.filter((b) => b.isActive);
    if (tab === "returned") return enriched.filter((b) => b.isReturned);
    return enriched;
  }, [enriched, tab]);

  const counts = useMemo(
    () => ({
      active: enriched.filter((b) => b.isActive).length,
      returned: enriched.filter((b) => b.isReturned).length,
      overdue: enriched.filter((b) => b.isOverdue).length,
      totalFine: enriched.reduce((sum, b) => sum + (b.fine_amount || 0), 0),
    }),
    [enriched]
  );

  // ============ Render ============

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-100 rounded" />
          <div className="h-24 bg-gray-100 rounded" />
          <div className="h-24 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Borrowed Books</h1>
          <p className="text-gray-600 text-sm mt-1">
            Your borrowing history and active loans
          </p>
        </div>
        <Link
          href="/books"
          className="text-green-600 hover:underline text-sm"
        >
          Browse books →
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Currently borrowed" value={counts.active} />
        <StatCard
          label="Overdue"
          value={counts.overdue}
          color={counts.overdue > 0 ? "red" : "default"}
        />
        <StatCard label="Total returned" value={counts.returned} />
        <StatCard
          label="Outstanding fines"
          value={`$${counts.totalFine.toFixed(2)}`}
          color={counts.totalFine > 0 ? "red" : "default"}
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded">
          <p className="text-red-700 text-sm font-medium">Could not load borrows</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={loadBorrows}
            className="mt-2 text-red-700 hover:text-red-900 text-sm underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="flex gap-1">
          <TabButton active={tab === "active"} onClick={() => setTab("active")}>
            Active ({counts.active})
          </TabButton>
          <TabButton active={tab === "returned"} onClick={() => setTab("returned")}>
            Returned ({counts.returned})
          </TabButton>
          <TabButton active={tab === "all"} onClick={() => setTab("all")}>
            All ({enriched.length})
          </TabButton>
        </nav>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState tab={tab} />
      ) : (
        <div className="space-y-3">
          {filtered.map((borrow) => (
            <BorrowCard
              key={borrow.id}
              borrow={borrow}
              onReturn={handleReturn}
              isReturning={returningId === borrow.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============ BorrowCard component ============

function BorrowCard({
  borrow,
  onReturn,
  isReturning,
}: {
  borrow: BorrowRecord & {
    isActive: boolean;
    isReturned: boolean;
    isOverdue: boolean;
    daysOverdue: number;
  };
  onReturn: (id: number) => void;
  isReturning: boolean;
}) {
  const status = borrow.isOverdue
    ? "OVERDUE"
    : borrow.borrow_status || "UNKNOWN";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex gap-4">
        {/* Book cover placeholder */}
        <div className="flex-shrink-0 w-14 h-20 bg-gradient-to-br from-green-500 to-purple-600 rounded flex items-center justify-center text-white font-bold text-sm">
          {borrow.book?.title
            ?.split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "?"}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={`/books/${borrow.book_id}`}
                className="font-medium text-gray-900 hover:text-green-600 line-clamp-1"
              >
                {borrow.book?.title || `Book #${borrow.book_id}`}
              </Link>
              {borrow.book?.author && (
                <p className="text-sm text-gray-600 mt-0.5">
                  by {borrow.book.author}
                </p>
              )}
            </div>
            <StatusBadge status={status} />
          </div>

          {/* Date grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            <DateInfo
              label="Borrowed"
              date={borrow.borrow_date}
            />
            <DateInfo
              label="Due"
              date={borrow.due_date}
              highlight={borrow.isOverdue ? "red" : undefined}
            />
            {borrow.return_date && (
              <DateInfo
                label="Returned"
                date={borrow.return_date}
                highlight="green"
              />
            )}
          </div>

          {/* Overdue alert */}
          {borrow.isOverdue && borrow.daysOverdue > 0 && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm">
              <span className="text-red-700 font-medium">
                ⚠️ Overdue by {borrow.daysOverdue} day{borrow.daysOverdue !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Fine */}
          {borrow.fine_amount && borrow.fine_amount > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-gray-600">Fine:</span>
              <span className="font-medium text-red-700">
                ${borrow.fine_amount.toFixed(2)}
              </span>
              {borrow.fine_status && (
                <FineStatusBadge status={borrow.fine_status} />
              )}
            </div>
          )}

          {/* Actions */}
          {borrow.isActive && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onReturn(borrow.id)}
                disabled={isReturning}
                className="bg-green-600 text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isReturning ? "Returning..." : "Return book"}
              </button>
              <Link
                href={`/books/${borrow.book_id}`}
                className="border border-gray-300 text-gray-700 text-sm font-medium px-4 py-1.5 rounded hover:bg-gray-50"
              >
                View book
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ Helper components ============

function StatCard({
  label,
  value,
  color = "default",
}: {
  label: string;
  value: number | string;
  color?: "default" | "red" | "green";
}) {
  const valueColor =
    color === "red"
      ? "text-red-700"
      : color === "green"
      ? "text-green-700"
      : "text-gray-900";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">
        {label}
      </p>
    </div>
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
      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
        active
          ? "border-green-600 text-green-600"
          : "border-transparent text-gray-600 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    BORROWED: "bg-green-100 text-green-700",
    RETURNED: "bg-gray-100 text-gray-700",
    OVERDUE: "bg-red-100 text-red-700",
    UNKNOWN: "bg-gray-100 text-gray-500",
  };

  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap ${
        styles[status] || styles.UNKNOWN
      }`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function FineStatusBadge({ status }: { status: FineStatus }) {
  const styles: Record<FineStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PAID: "bg-green-100 text-green-700",
    WAIVED: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${styles[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function DateInfo({
  label,
  date,
  highlight,
}: {
  label: string;
  date: string | null;
  highlight?: "red" | "green";
}) {
  const color =
    highlight === "red"
      ? "text-red-700"
      : highlight === "green"
      ? "text-green-700"
      : "text-gray-900";

  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-gray-500">{label}</p>
      <p className={`text-sm font-medium ${color}`}>
        {date ? formatDate(date) : "—"}
      </p>
    </div>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  const messages: Record<Tab, { title: string; subtitle: string }> = {
    active: {
      title: "No books currently borrowed",
      subtitle: "Browse the library to find your next read",
    },
    returned: {
      title: "No returned books yet",
      subtitle: "Your returned borrows will appear here",
    },
    all: {
      title: "No borrowing history",
      subtitle: "Start by borrowing your first book",
    },
  };

  const { title, subtitle } = messages[tab];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
      <p className="text-gray-900 font-medium">{title}</p>
      <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
      <Link
        href="/books"
        className="inline-block mt-4 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-green-700"
      >
        Browse books
      </Link>
    </div>
  );
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
