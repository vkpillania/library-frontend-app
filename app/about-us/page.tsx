import Link from "next/link";

export default function AboutPage() {
  const team = [
    {
      name: "Sarah Chen",
      role: "Co-founder & CEO",
      bio: "Former product lead at Stripe. Obsessed with building tools that get out of people's way.",
      initials: "SC",
      color: "#6366f1",
    },
    {
      name: "Marcus Webb",
      role: "Co-founder & CTO",
      bio: "Built distributed systems at Cloudflare. Believes great infrastructure should be invisible.",
      initials: "MW",
      color: "#0ea5e9",
    },
    {
      name: "Priya Nair",
      role: "Head of Design",
      bio: "Previously at Linear and Figma. Convinced that clarity is the highest form of design.",
      initials: "PN",
      color: "#8b5cf6",
    },
    {
      name: "James Okafor",
      role: "Head of Engineering",
      bio: "Open-source contributor and systems thinker. Writes code that his future self can read.",
      initials: "JO",
      color: "#10b981",
    },
  ];

  const values = [
    {
      label: "Clarity over cleverness",
      body:
        "We'd rather say something plainly than say it impressively. In our product and in our writing.",
    },
    {
      label: "Speed is a feature",
      body:
        "Every millisecond we shave off is a small act of respect for the person using what we build.",
    },
    {
      label: "Defaults matter",
      body:
        "Most people never change settings. We think hard about what ships out of the box.",
    },
    {
      label: "Small teams, big trust",
      body:
        "We keep the team tight and give people real ownership. Consensus doesn't scale; judgment does.",
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
        <div style={{ display: "flex", gap: 32, fontSize: 14, color: "#64748b" }}>
          <Link href="/about-us" style={{ color: "#0f172a", fontWeight: 500, textDecoration: "none" }}>
            About
          </Link>
          <Link href="/contact-us" style={{ color: "#64748b", textDecoration: "none" }}>
            Contact
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "100px 40px 80px",
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#6366f1",
            marginBottom: 24,
          }}
        >
          About us
        </p>
        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            margin: "0 0 32px",
            color: "#0f172a",
          }}
        >
          Built by people who got frustrated with the alternative.
        </h1>
        <p
          style={{
            fontSize: 20,
            lineHeight: 1.65,
            color: "#475569",
            maxWidth: 580,
            margin: 0,
          }}
        >
          We started The Library in 2021 after spending years patching together tools that
          almost did what we needed. We figured we weren't alone. We weren't.
        </p>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ height: 1, backgroundColor: "#e2e8f0" }} />
      </div>

      {/* Story */}
      <section
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "72px 40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px 64px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#94a3b8",
                marginBottom: 16,
              }}
            >
              The problem
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#334155", margin: 0 }}>
              The tools that existed were either too complex for small teams or too
              limited for growing ones. You'd outgrow them right when you started
              depending on them.
            </p>
          </div>
          <div>
            <h2
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#94a3b8",
                marginBottom: 16,
              }}
            >
              Our answer
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#334155", margin: 0 }}>
              Something that scales with you without demanding you become a different
              kind of team first. Same interface on day one as on day one thousand.
            </p>
          </div>
          <div>
            <h2
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#94a3b8",
                marginBottom: 16,
              }}
            >
              Where we are now
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#334155", margin: 0 }}>
              Over 4,000 teams use The Library today. We're still the same size team we
              were at launch — by choice. We'd rather be excellent at fewer things.
            </p>
          </div>
          <div>
            <h2
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#94a3b8",
                marginBottom: 16,
              }}
            >
              Where we're going
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#334155", margin: 0 }}>
              Deeper, not wider. We're investing in making what already exists in the
              product faster, smarter, and more reliable before adding anything new.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        style={{
          backgroundColor: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          borderBottom: "1px solid #e2e8f0",
          padding: "72px 40px",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#94a3b8",
              marginBottom: 40,
            }}
          >
            How we work
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {values.map((v, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "240px 1fr",
                  gap: 40,
                  padding: "28px 0",
                  borderBottom: i < values.length - 1 ? "1px solid #e2e8f0" : "none",
                  alignItems: "start",
                }}
              >
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: 0,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {v.label}
                </p>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: "#64748b",
                    margin: 0,
                  }}
                >
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "72px 40px",
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#94a3b8",
            marginBottom: 40,
          }}
        >
          The team
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
          }}
        >
          {team.map((person) => (
            <div
              key={person.name}
              style={{
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: person.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#ffffff",
                  flexShrink: 0,
                  letterSpacing: "0.02em",
                }}
              >
                {person.initials}
              </div>
              <div>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: "0 0 2px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {person.name}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    margin: "0 0 10px",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                  }}
                >
                  {person.role}
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "#64748b", margin: 0 }}>
                  {person.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          borderTop: "1px solid #e2e8f0",
          padding: "64px 40px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#0f172a",
            marginBottom: 8,
          }}
        >
          Want to work with us?
        </p>
        <p style={{ fontSize: 15, color: "#64748b", marginBottom: 28 }}>
          We're always looking for people who care deeply about craft.
        </p>
        <Link
          href="/contact-us"
          style={{
            display: "inline-block",
            backgroundColor: "#6366f1",
            color: "#ffffff",
            padding: "12px 28px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          Get in touch →
        </Link>
      </section>
    </main>
  );
}
