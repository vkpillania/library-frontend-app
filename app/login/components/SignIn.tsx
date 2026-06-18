"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  submit?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://0.0.0.0:8000/api/v1";

export default function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [form, setForm] = useState<FormData>({ username: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  // ============ Validation ============

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "username is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.username)) {
      newErrors.username = "Please enter a valid username";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  // ============ Submit ============

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("form=========", form);
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    const formData = new URLSearchParams();
    formData.append("username", form.username.trim().toLowerCase());
    formData.append("password", form.password);
    try {
      const res = await fetch(`${API_URL}/auth/token`, {
        method: "POST",
        headers: { "Content-Type":  "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));

        // Invalid credentials
        if (res.status === 401) {
          setErrors({ submit: "Incorrect username or password" });
          return;
        }

        // Account not active
        if (res.status === 403) {
          setErrors({
            submit: data.detail || "Your account is not active. Please contact support.",
          });
          return;
        }

        // Validation errors from FastAPI
        if (res.status === 422 && Array.isArray(data.detail)) {
          const fieldErrors: FormErrors = {};
          data.detail.forEach((err: { loc: string[]; msg: string }) => {
            const field = err.loc[err.loc.length - 1] as keyof FormErrors;
            fieldErrors[field] = err.msg;
          });
          setErrors(fieldErrors);
          return;
        }

        throw new Error(data.detail || `Server returned ${res.status}`);
      }

      const data = await res.json();
      console.log("data.access_token", data);

      // Store auth token
      if (data.access_token) {
        if (rememberMe) {
          localStorage.setItem("auth_token", data.access_token);
        } else {
          sessionStorage.setItem("auth_token", data.access_token);
        }
      }

      // Redirect to original destination or dashboard
      const memberId = data.user.id;
      const redirectTo = searchParams.get("redirect") || `/members/${memberId}`;
      window.location.href = redirectTo;
      // router.push(redirectTo);
      // router.refresh();

      // window.location.reload();
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setErrors({
          submit: "Cannot reach the server. Please try again later.",
        });
      } else {
        setErrors({
          submit: err instanceof Error ? err.message : "Something went wrong",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ============ Form ============

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* username */}
      <Field label="username" error={errors.username}>
        <input
          type="email"
          name="username"
          value={form.username}
          onChange={(e) => handleChange("username", e.target.value)}
          placeholder="you@example.com"
          className={inputClass(errors.username)}
          autoComplete="username"
          disabled={loading}
          autoFocus
        />
      </Field>

      {/* Password with show/hide toggle */}
      <Field label="Password" error={errors.password}>
        <div className="relative">
          <input
            // type={showPassword ? "text" : "password"}
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="••••••••"
            className={inputClass(errors.password) + " pr-10"}
            autoComplete="current-password"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 px-2 py-1 text-xs"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </Field>

      {/* Remember me + Forgot password */}
      <div className="flex justify-between items-center text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            disabled={loading}
          />
          <span className="text-gray-700">Remember me</span>
        </label>
        <Link
          href="/forgot-password"
          className="text-green-600 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit error */}
      {errors.submit && (
        <div className="border border-red-300 bg-red-50 text-red-700 text-sm p-3 rounded flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{errors.submit}</span>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white font-medium py-2.5 px-4 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

// ============ Sub-components ============

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function inputClass(hasError?: string): string {
  const base =
    "w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-50";
  if (hasError) {
    return `${base} border-red-300 focus:border-red-500 focus:ring-red-100`;
  }
  return `${base} border-gray-300 focus:border-green-500 focus:ring-green-100`;
}
