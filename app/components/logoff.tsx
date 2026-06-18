
import Link from "next/link";
export default function Logoff() {
  const handleLogout = () => {
    sessionStorage.removeItem("auth_token");
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    window.location.href = "/login/staff-login";
  }

  return (
    <div className="container mx-auto text-xs flex space-x-4">
      <Link href="/login/staff-login" className="hover:underline">
        <span onClick={handleLogout}>Logout</span>
      </Link>
    </div>
  );
}