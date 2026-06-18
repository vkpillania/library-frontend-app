"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import { redirect } from 'next/navigation';
import Link from "next/link";
import { apiCall } from "../../../lib/api";

interface BookForm {
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  description: string;
  pages: string;
  price: string;
  published_date: string;
  total_copies: string;
}

const INITIAL_FORM: BookForm = {
  title: "",
  author: "",
  isbn: "",
  publisher: "",
  description: "",
  pages: "",
  price: "",
  published_date: "",
  total_copies: "1",
};

export default function AddBookPage() {
  const router = useRouter();
  const [form, setForm] = useState<BookForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ============ Validation ============

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.author.trim()) newErrors.author = "Author is required";
    
    if (!form.isbn.trim()) {
      newErrors.isbn = "ISBN is required";
    } else if (!/^[\d-]{10,17}$/.test(form.isbn.trim())) {
      newErrors.isbn = "ISBN should be 10-13 digits (hyphens allowed)";
    }
    
    if (!form.publisher.trim()) newErrors.publisher = "Publisher is required";
    
    if (form.pages && (isNaN(Number(form.pages)) || Number(form.pages) < 1)) {
      newErrors.pages = "Pages must be a positive number";
    }
    
    if (form.price && (isNaN(Number(form.price)) || Number(form.price) < 0)) {
      newErrors.price = "Price must be a valid number";
    }
    
    if (!form.total_copies || isNaN(Number(form.total_copies)) || Number(form.total_copies) < 1) {
      newErrors.total_copies = "Total copies must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============ Form handlers ============

  const handleChange = (field: keyof BookForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        isbn: form.isbn.trim(),
        publisher: form.publisher.trim(),
        description: form.description.trim(),
        pages: form.pages ? Number(form.pages) : null,
        price: form.price ? Number(form.price) : null,
        published_date: form.published_date || null,
        total_copies: Number(form.total_copies),
        available_copies: Number(form.total_copies),
        borrowed_copies: 0,
      };

    //   const newBook = await api.post<{ id: number }>("/books", payload);
    //   router.push(`/books/${newBook.id}`);
    const res = await apiCall("/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    // const router = useRouter();
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || `Server returned ${res.status}`);
    }
    // else
    // {
    //   router.push('/books'); 
    // }
    } catch (err: any) {
      setSubmitError(err.message || "Failed to create book");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitError(null);
  };

  // ============ Render ============

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link
        href="/books"
        className="text-green-600 hover:underline text-sm mb-4 inline-block"
      >
        ← Back to books
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Book</h1>
        <p className="text-gray-600 text-sm mb-6">
          Fill in the details to add a book to the library catalog.
        </p>

        {submitError && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded">
            <p className="text-red-700 text-sm font-medium">Could not create book</p>
            <p className="text-red-600 text-sm mt-1">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <Field
            label="Title"
            required
            error={errors.title}
          >
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Clean Code"
              className={inputClass(!!errors.title)}
              autoFocus
            />
          </Field>

          {/* Author */}
          <Field
            label="Author"
            required
            error={errors.author}
          >
            <input
              type="text"
              value={form.author}
              onChange={(e) => handleChange("author", e.target.value)}
              placeholder="e.g. Robert C. Martin"
              className={inputClass(!!errors.author)}
            />
          </Field>

          <div className="grid md:grid-cols-2 gap-5">
            {/* ISBN */}
            <Field
              label="ISBN"
              required
              error={errors.isbn}
              hint="10 or 13 digit identifier"
            >
              <input
                type="text"
                value={form.isbn}
                onChange={(e) => handleChange("isbn", e.target.value)}
                placeholder="978-0132350884"
                className={inputClass(!!errors.isbn)}
              />
            </Field>

            {/* Publisher */}
            <Field
              label="Publisher"
              required
              error={errors.publisher}
            >
              <input
                type="text"
                value={form.publisher}
                onChange={(e) => handleChange("publisher", e.target.value)}
                placeholder="e.g. Prentice Hall"
                className={inputClass(!!errors.publisher)}
              />
            </Field>
          </div>

          {/* Description */}
          <Field
            label="Description"
            error={errors.description}
            hint="Optional — a short summary of the book"
          >
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              placeholder="A handbook of agile software craftsmanship..."
              className={inputClass(!!errors.description)}
            />
          </Field>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Pages */}
            <Field label="Pages" error={errors.pages}>
              <input
                type="number"
                value={form.pages}
                onChange={(e) => handleChange("pages", e.target.value)}
                placeholder="464"
                min={1}
                className={inputClass(!!errors.pages)}
              />
            </Field>

            {/* Price */}
            <Field label="Price (USD)" error={errors.price}>
              <input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="49.99"
                step="0.01"
                min={0}
                className={inputClass(!!errors.price)}
              />
            </Field>

            {/* Published date */}
            <Field label="Published date" error={errors.published_date}>
              <input
                type="date"
                value={form.published_date}
                onChange={(e) => handleChange("published_date", e.target.value)}
                className={inputClass(!!errors.published_date)}
              />
            </Field>
          </div>

          {/* Total copies */}
          <Field
            label="Total copies"
            required
            error={errors.total_copies}
            hint="Number of copies available in the library"
          >
            <input
              type="number"
              value={form.total_copies}
              onChange={(e) => handleChange("total_copies", e.target.value)}
              min={1}
              className={inputClass(!!errors.total_copies)}
            />
          </Field>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white  font-medium px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Adding..." : "Add book"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={submitting}
              className="border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Reset
            </button>
            <Link
              href="/books"
              className="ml-auto text-gray-600 hover:text-gray-900 text-sm px-4 py-2.5"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============ Helper components ============

function Field({
  label,
  required = false,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      {hint && !error && <p className="text-gray-500 text-xs mt-1">{hint}</p>}
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return [
    "w-full px-3 py-2 border rounded text-sm",
    "focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",
    hasError
      ? "border-red-300 bg-red-50"
      : "border-gray-300 bg-white",
  ].join(" ");
}
