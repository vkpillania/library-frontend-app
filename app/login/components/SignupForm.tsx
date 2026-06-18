"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormData {
  [x: string]: any;
  name: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  member_type: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  submit?: string;
  username?: string;
  password?: string;
  member_type?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://0.0.0.0:8000/api/v1";

export default function SignupForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    username: "",
    password: "",
    member_type: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ============ Validation ============

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (form.name.trim().length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }
    // member_type validation
    if (!form.member_type.trim()) {
      newErrors.member_type = "Membera type is required";
    } 

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (form.username.trim().length < 6) {
      newErrors.username = "Username must be at least 6 characters";
    } else if (form.username.trim().length > 12) {
      newErrors.username = "Username must be less than 12 characters";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.trim().length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (form.password.trim().length > 12) {
      newErrors.password = "Password must be less than 12 characters";
    }


    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (10-15 digits, with optional + and separators)
    const phoneDigits = form.phone.replace(/[\s\-\(\)]/g, "");
    if (!form.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\+?\d{10,15}$/.test(phoneDigits)) {
      newErrors.phone = "Please enter a valid phone number (10–15 digits)";
    }

    // Address validation
    if (!form.address.trim()) {
      newErrors.address = "Address is required";
    } else if (form.address.trim().length < 5) {
      newErrors.address = "Address seems too short";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============ Field changes ============

  const handleChange = (field: keyof FormData, value: string) => {
    setForm({ ...form, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  // ============ Submit ============

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${API_URL}/members/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          username: form.username.trim(),
          password: form.password,
          address: form.address.trim(),
          member_type: form.member_type.trim(),
          active: true,
        }),
      });
      console.log("res", res);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));

        // Handle FastAPI validation errors
        if (res.status === 422 && Array.isArray(data.detail)) {
          const fieldErrors: FormErrors = {};
          data.detail.forEach((err: { loc: string[]; msg: string }) => {
            const field = err.loc[err.loc.length - 1] as keyof FormErrors;
            fieldErrors[field] = err.msg;
          });
          setErrors(fieldErrors);
          return;
        }

        // Handle conflict (duplicate email)
        if (res.status === 409) {
          setErrors({ email: data.detail || "This email is already registered" });
          return;
        }

        throw new Error(data.detail || `Server returned ${res.status}`);
      }

      // Success!
      setSuccess(true);
      
      // Redirect to login or members page after 1.5 seconds
      setTimeout(() => {
        router.push("/login/staff-login");
      }, 1500);
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

  // ============ Success state ============

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome aboard!</h2>
        <p className="text-gray-600">Redirecting you to sign in...</p>
      </div>
    );
  }

  // ============ Form ============

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Name */}
      <Field label="Full name" error={errors.name} required>
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Alice Johnson"
          className={inputClass(errors.name)}
          autoComplete="name"
          disabled={loading}
        />
      </Field>
      <Field label="Username" error={errors.username} required>
        <input
          type="text"
          value={form.username}
          onChange={(e) => handleChange("username", e.target.value)}
          placeholder="alice"
          className={inputClass(errors.username)}
          autoComplete="username"
          disabled={loading}
        />
      </Field>

       <Field label="Password" error={errors.password} required>
        <input
          type="password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="password"
          className={inputClass(errors.password)}
          autoComplete="password"
          disabled={loading}
        />
      </Field>

       {/* <Field label="Member Type" error={errors.member_type} required> */}
        <label className="block text-sm font-medium text-gray-700 mb-1">Member Type
        <select
          name = "member_type"
          value={form.member_type}
          onChange={(e) => handleChange("member_type", e.target.value)}
          className={inputClass(errors.password)}
          autoComplete="Member type"
          disabled={loading}
        >
         <option value="" disabled>-- Select an option --</option>
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        </select>
        </label>
      {/* </Field> */}

      {/* Email */}
      <Field label="Email" error={errors.email} required>
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="alice@example.com"
          className={inputClass(errors.email)}
          autoComplete="email"
          disabled={loading}
        />
      </Field>

      {/* Phone */}
      <Field label="Phone number" error={errors.phone} required>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="+91 9876543210"
          className={inputClass(errors.phone)}
          autoComplete="tel"
          disabled={loading}
        />
      </Field>

      {/* Address */}
      <Field label="Address" error={errors.address} required>
        <textarea
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="123 Main Street, Bangalore"
          rows={3}
          className={inputClass(errors.address)}
          autoComplete="street-address"
          disabled={loading}
        />
      </Field>

      {/* Submit error */}
      {errors.submit && (
        <div className="border border-red-300 bg-red-50 text-red-700 text-sm p-3 rounded">
          {errors.submit}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white font-medium py-2.5 px-4 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="text-green-600 hover:underline">
          terms of service
        </Link>
      </p>
    </form>
  );
}

// ============ Sub-components ============

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
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
