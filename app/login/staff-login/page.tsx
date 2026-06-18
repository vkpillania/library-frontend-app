import Link from "next/link";
import SigninForm from "../components/SignIn"; // Corrected the import path

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block text-2xl font-bold text-gray-900 mb-2">
            📚 The Library
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-1">
            Sign in to manage your borrowed books
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <SigninForm />
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link href="login/signup" className="text-green-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
