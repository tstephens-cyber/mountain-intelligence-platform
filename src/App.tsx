import { useState } from "react";

const BACKEND_URL =
  "https://mountain-intelligence-coach-backend.onrender.com/coach";

type Tab = "dashboard" | "coach" | "workspace" | "documents" | "analytics" | "settings";

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("Mountain Intelligence is ready.");
  const [loading, setLoading] = useState(false);

  async function askCoach() {
    if (!message.trim()) return;

    setLoading(true);
    setReply("Thinking...");

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setReply(data.reply || data.message || JSON.stringify(data));
    } catch (err) {
      setReply(
        "Backend connection failed. The app is working, but the AI Coach backend needs to be checked."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Mountain Intelligence</h1>
          <p style={styles.subtitle}>Executive operating system</p>
        </div>
        <div style={styles.badge}>v5.0</div>
      </header>

      <nav style={styles.nav}>
        {[
          ["dashboard", "Dashboard"],
          ["coach", "AI Coach"],
          ["workspace", "Workspace"],
          ["documents", "Documents"],
          ["analytics", "Analytics"],
          ["settings", "Settings"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as Tab)}
            style={{
              ...styles.navButton,
              ...(tab === key ? styles.activeButton : {}),
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {tab === "dashboard" && (
          <section>
            <h2>Executive Dashboard</h2>
            <div style={styles.grid}>
              <Card title="Operational Confidence" value="92%" note="Teams aligned and active" />
              <Card title="Revenue Focus" value="$2.1M" note="Annual run-rate target" />
              <Card title="Board Readiness" value="14 items" note="Next check-in pending" />
              <Card title="Priority Risk" value="Medium" note="Monitor margin and labor" />
            </div>
          </section>
        )}

        {tab === "coach" && (
          <section>
            <h2>AI Coach</h2>
            <div style={styles.card}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask Mountain Intelligence something..."
                style={styles.textarea}
              />
              <button onClick={askCoach} disabled={loading} style={styles.primaryButton}>
                {loading ? "Sending..." : "Send to Coach"}
              </button>
              <div style={styles.reply}>{reply}</div>
            </div>
          </section>
        )}

        {tab === "workspace" && (
          <Section title="Workspace" text="Command center for tasks, priorities, decisions, and team execution." />
        )}

        {tab === "documents" && (
          <Section title="Documents" text="Upload and organize P&Ls, reports, SOPs, and branch files here." />
        )}

        {tab === "analytics" && (
          <Section title="Analytics" text="Branch performance, EBITA, revenue, labor, COGS, and trend intelligence." />
        )}

        {tab === "settings" && (
          <Section title="Settings" text="Backend, users, data sources, app behavior, and PWA settings." />
        )}
      </main>
    </div>
  );
}

function Card({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div style={styles.card}>
      <p style={styles.cardTitle}>{title}</p>
      <h3 style={styles.cardValue}>{value}</h3>
      <p style={styles.note}>{note}</p>
    </div>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <section style={styles.card}>
      <h2>{title}</h2>
      <p>{text}</p>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: "100vh",
    background: "#020617",
    color: "#e5e7eb",
    fontFamily: "system-ui, sans-serif",
    padding: 16,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    margin: 0,
    fontSize: 28,
  },
  subtitle: {
    margin: "4px 0 0",
    color: "#94a3b8",
  },
  badge: {
    background: "#1d4ed8",
    padding: "8px 12px",
    borderRadius: 999,
    fontWeight: 700,
  },
  nav: {
    display: "flex",
    gap: 8,
    overflowX: "auto",
    paddingBottom: 12,
    marginBottom: 16,
  },
  navButton: {
    background: "#111827",
    color: "#e5e7eb",
    border: "1px solid #334155",
    padding: "10px 14px",
    borderRadius: 12,
    whiteSpace: "nowrap",
    cursor: "pointer",
  },
  activeButton: {
    background: "#2563eb",
    borderColor: "#60a5fa",
  },
  main: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },
  card: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,.25)",
  },
  cardTitle: {
    color: "#94a3b8",
    margin: 0,
  },
  cardValue: {
    fontSize: 30,
    margin: "8px 0",
  },
  note: {
    color: "#cbd5e1",
    margin: 0,
  },
  textarea: {
    width: "100%",
    minHeight: 120,
    borderRadius: 12,
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
    padding: 12,
    fontSize: 16,
    boxSizing: "border-box",
    marginBottom: 12,
  },
  primaryButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  reply: {
    marginTop: 16,
    background: "#020617",
    border: "1px solid #334155",
    borderRadius: 12,
    padding: 12,
    whiteSpace: "pre-wrap",
  },
};
