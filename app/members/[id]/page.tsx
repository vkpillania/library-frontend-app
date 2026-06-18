import Link from "next/link";
import { notFound } from "next/navigation";
import MemberActions from "../components/MemberActions";
import BorrowingHistory from "../components/BorrowingHistory";

interface Member {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  active: boolean;
  membership_date?: string;
  created_at?: string;
  borrow_records?: BorrowRecord[];
}

interface BorrowRecord {
  id: number;
  book_id: number;
  book_title?: string;
  book_author?: string;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: "BORROWED" | "RETURNED";
  fine_amount?: number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}
// console.log("API_URL", params);
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://0.0.0.0:8000/api/v1";

async function getMember(id: string): Promise<Member | null> {
  try {
    const res = await fetch(`${API_URL}/members/${id}`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch member: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("Error fetching member:", error);
    return null;
  }
}

export default async function MemberProfilePage({ params }: PageProps) {
  const { id } = await params;
  const member = await getMember(id);
  console.log("member", member);

  if (!member) {
    notFound();
  }

//   // Compute statistics from borrow records
  const borrows = member.borrow_records || [];

  const active = borrows.filter((b) => b.borrow_status === "BORROWED");
  const returned = borrows.filter((b) => b.borrow_status === "RETURNED");
  const overdue = active.filter((b) => new Date(b.due_date) < new Date());
  const totalFines = borrows.reduce((sum, b) => sum + (b.fine_amount || 0), 0);
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Back link */}
      <Link
        href="/members"
        className="inline-flex items-center text-sm text-green-600 hover:underline"
      >
        ← Back to all members
      </Link>
      
      {/* Profile header card */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 flex items-start gap-6 flex-wrap">
          {/* Avatar — initials based */}
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-2xl font-bold flex-shrink-0">
            {getInitials(member.name)}
          </div>

          {/* Name + contact info */}
          <div className="flex-1 min-w-[260px]">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{member.name}</h1>
              {member.active ? (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                  Active
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 font-mono mb-3">Member #{member.id}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <InfoItem label="Email" value={member.email} />
              {member.phone && <InfoItem label="Phone" value={member.phone} />}
              {member.address && <InfoItem label="Address" value={member.address} />}
              {(member.membership_date || member.created_at) && (
                <InfoItem
                  label="Member since"
                  value={formatDate(member.membership_date || member.created_at!)}
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <MemberActions memberId={member.id} memberName={member.name} active={member.active} />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Books out" value={active.length} variant="default" />
        <StatCard
          label="Overdue"
          value={overdue.length}
          variant={overdue.length > 0 ? "danger" : "default"}
        />
        <StatCard label="Returned" value={returned.length} variant="default" />
        <StatCard
          label="Fines"
          value={`₹${totalFines.toFixed(2)}`}
          variant={totalFines > 0 ? "warning" : "default"}
        />
      </div>

      {/* Borrowing history */}
      <BorrowingHistory borrows={borrows} />
    </div>
  );
}

// ============ Helpers ============

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ============ Sub-components ============

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-gray-900">{value}</p>
    </div>
  );
}

function StatCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: number | string;
  variant?: "default" | "warning" | "danger";
}) {
  const colors = {
    default: "text-gray-900",
    warning: "text-orange-600",
    danger: "text-red-600",
  };
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colors[variant]}`}>{value}</p>
    </div>
  );
}
