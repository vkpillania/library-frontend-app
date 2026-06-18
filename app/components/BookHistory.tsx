"use client";
import Link from "next/link";
interface BorrowRecord {
  id: number;
  member_id: number;
  borrow_date: string;
  due_date: string | null;
  return_date: string | null;
  borrow_status: string;
  fine_amount?: number;
}

export default function BorrowHistory({ records }: { records: BorrowRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">No borrow history yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <Th>Member ID</Th>
            <Th>Borrowed</Th>
            <Th>Due</Th>
            <Th>Returned</Th>
            <Th>Status</Th>
            <Th align="right">Fine</Th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <BorrowRow key={record.id} record={record} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BorrowRow({ record }: { record: BorrowRecord }) {
  const status = record.borrow_status?.toUpperCase() || "UNKNOWN";

  // Determine if overdue based on dates if status isn't explicit
  const today = new Date();
  const dueDate = record.due_date ? new Date(record.due_date) : null;
  const isOverdue =
    status === "BORROWED" && dueDate && today > dueDate && !record.return_date;

  const displayStatus = isOverdue ? "OVERDUE" : status;

  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50">
      <Td>
        <Link href={`/members/${record.member_id}`} className="block hover:underline">
          #{record.member_id}
        </Link>
      </Td>
      <Td>{formatDate(record.borrow_date)}</Td>
      <Td>{record.due_date ? formatDate(record.due_date) : "—"}</Td>
      <Td>{record.return_date ? formatDate(record.return_date) : "—"}</Td>
      <Td>
        <StatusBadge status={displayStatus} />
      </Td>
      <Td align="right">
        {record.fine_amount && record.fine_amount > 0
          ? `$${record.fine_amount.toFixed(2)}`
          : "—"}
      </Td>
    </tr>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    BORROWED: "bg-green-100 text-green-700",
    RETURNED: "bg-gray-100 text-gray-700",
    OVERDUE: "bg-red-100 text-red-700",
    UNKNOWN: "bg-gray-100 text-gray-500",
  };

  const labels: Record<string, string> = {
    BORROWED: "Borrowed",
    RETURNED: "Returned",
    OVERDUE: "Overdue",
    UNKNOWN: "Unknown",
  };

  const style = styles[status] || styles.UNKNOWN;
  const label = labels[status] || status;

  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${style}`}>
      {label}
    </span>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 text-${align}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <td className={`text-sm text-gray-700 px-4 py-3 text-${align}`}>{children}</td>
  );
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
