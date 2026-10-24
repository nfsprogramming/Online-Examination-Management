import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
            background: "var(--page-bg)",
            color: "var(--text-primary)",
            fontFamily: "var(--sans)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 20 }}>⚠️</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "var(--text-primary)" }}>
            Application Error
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24, maxWidth: 480 }}>
            An unexpected error occurred. Your examination progress has been preserved in your local session.
          </p>
          <pre
            style={{
              background: "var(--error-bg)",
              border: "1px solid var(--error-border)",
              borderRadius: "var(--radius-md)",
              padding: "14px 20px",
              fontSize: 12,
              color: "var(--error)",
              maxWidth: 580,
              overflowX: "auto",
              marginBottom: 24,
              textAlign: "left",
              fontFamily: "var(--mono)",
            }}
          >
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="btn btn-primary"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
