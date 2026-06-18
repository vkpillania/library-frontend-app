import Link from "next/link";

export default function ContactPage() {
  const channels = [
    {
      label: "General enquiries",
      value: "hello@thelibrary.com",
      href: "mailto:hello@thelibrary.com",
      description: "Questions about the product, pricing, or anything else.",
    },
    {
      label: "Support",
      value: "support@thelibrary.com",
      href: "mailto:support@thelibrary.com",
      description: "Something broken or not working as expected.",
    },
    {
      label: "Press",
      value: "press@thelibrary.com",
      href: "mailto:press@thelibrary.com",
      description: "Media enquiries, logos, and company background.",
    },
    {
      label: "Careers",
      value: "jobs@thelibrary.com",
      href: "mailto:jobs@thelibrary.com",
      description: "Interested in joining the team.",
    },
  ];

  return (
    <main
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#0f172a",
        backgroundColor: "#ffffff",
        margin: 0,
        padding: 0,
        minHeight: "100vh",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          borderBottom: "1px solid #e2e8f0",
          padding: "0 40px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          backgroundColor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          zIndex: 100,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.03em" }}>
          The Library
        </span>
        <div style={{ display: "flex", gap: 32, fontSize: 14 }}>
          <Link href="/about-us" style={{ color: "#64748b", textDecoration: "none" }}>
            About
          </Link>
          <Link
            href="/contact-us"
            style={{ color: "#0f172a", fontWeight: 500, textDecoration: "none" }}
          >
            Contact
          </Link>
        </div>
      </nav>

      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "80px 40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px 80px",
          alignItems: "start",
        }}
      >
        {/* Left col — heading + channels */}
        <div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#6366f1",
              marginBottom: 24,
              marginTop: 20,
            }}
          >
            Contact us
          </p>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
              margin: "0 0 24px",
            }}
          >
            We read every message. Really.
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: "#475569",
              margin: "0 0 56px",
            }}
          >
            No tickets, no bots for first contact. A person on the team will get back
            to you — usually within a few hours during business days.
          </p>

          {/* Response time badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 999,
              marginBottom: 48,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "#22c55e",
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 500, color: "#15803d" }}>
              Avg. response time: 3 hours
            </span>
          </div>

          {/* Contact channels */}
          <div>
            {channels.map((ch, i) => (
              <div
                key={ch.label}
                style={{
                  padding: "20px 0",
                  borderTop: "1px solid #e2e8f0",
                  borderBottom: i === channels.length - 1 ? "1px solid #e2e8f0" : "none",
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#94a3b8",
                    margin: "0 0 4px",
                  }}
                >
                  {ch.label}
                </p>
                <a
                  href={ch.href}
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#6366f1",
                    textDecoration: "none",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  {ch.value}
                </a>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                  {ch.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right col — form */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            padding: "40px",
            marginTop: 20,
          }}
        >
          <p
            style={{
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              marginBottom: 6,
              marginTop: 0,
            }}
          >
            Send us a message
          </p>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 32, marginTop: 0 }}>
            We'll reply to your email directly.
          </p>

          <form style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label
                  htmlFor="firstName"
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#64748b",
                    marginBottom: 8,
                  }}
                >
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Ada"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    fontSize: 14,
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#64748b",
                    marginBottom: 8,
                  }}
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Lovelace"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    fontSize: 14,
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#64748b",
                  marginBottom: 8,
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="ada@example.com"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  fontSize: 14,
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Topic */}
            <div>
              <label
                htmlFor="topic"
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#64748b",
                  marginBottom: 8,
                }}
              >
                Topic
              </label>
              <select
                id="topic"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  fontSize: 14,
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  backgroundColor: "#ffffff",
                  color: "#64748b",
                  outline: "none",
                  appearance: "none",
                  boxSizing: "border-box",
                }}
              >
                <option value="">Select a topic…</option>
                <option value="general">General enquiry</option>
                <option value="support">Support</option>
                <option value="press">Press</option>
                <option value="careers">Careers</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#64748b",
                  marginBottom: 8,
                }}
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Tell us what's on your mind…"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  fontSize: 14,
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: "#6366f1",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                padding: "13px 24px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "-0.01em",
                marginTop: 4,
              }}
            >
              Send message →
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #e2e8f0",
          padding: "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        
        <div style={{ display: "flex", gap: 24 }}>
          <Link href="/about-us" style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none" }}>
            About
          </Link>
          <a href="https://twitter.com" style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none" }}>
            Twitter
          </a>
        </div>
      </div>
    </main>
  );
}
