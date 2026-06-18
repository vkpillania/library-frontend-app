import Link from "next/link";
import SignupForm from "../components/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block text-2xl font-bold text-gray-900 mb-2">
            📚 The Library
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Join the library</h1>
          <p className="text-gray-600 mt-1">
            Sign up to start borrowing books today
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <SignupForm />
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already a member?{" "}
          <Link href="/login/staff-login" className="text-green-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
