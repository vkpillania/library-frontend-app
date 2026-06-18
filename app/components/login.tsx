import Link from "next/link";
export default function Login() {
  return (
    <div className="container mx-auto text-xs flex space-x-4">
    <Link href="/login/signup">
      <span>Sign Up</span>
    </Link>
    <Link href="/login/staff-login">
      <span>Login</span>
    </Link>
    </div>
  );
}