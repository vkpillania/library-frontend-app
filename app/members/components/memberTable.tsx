import Link from "next/link";
interface Member{
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;

}

interface MembersTableProps {
  members?: Member[];
}

export default function MembersTable({members}: MembersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-b-2 border-gray-300 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Phone</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Address</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Active</th>            
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Borrowed</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">View Details</th>   
         
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-3 text-xs text-gray-600">{member.id}</td>
              <td className="px-4 py-3 text-xs text-gray-900 font-medium">{member.name}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{member.email}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{member.phone}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{member.address}</td>   
              <td className="px-4 py-3 text-sm text-center ">{member.active ? <span class='text-green-600 font-semibold'>Yes</span> : <span class='text-red-600 font-semibold'>No</span>}</td>
              <td className="px-4 py-3 text-sm text-center">{member.borrow_records.length}</td>
              {/* <td className="px-4 py-3 text-sm text-center">
                <span className={member.available_copies === 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                  {member.available_copies}
                  {member.borrowed_copies > 0 ? " (Borrowed)" : ""}
                </span>
              </td> */}
              <td className="px-4 py-3 text-xs text-center">
                <span className="text-green-600 hover:underline cursor-pointer">
                  <Link href={`/members/${member.id}`}>View Details</Link>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
