
"use client";

import { useState } from "react";

const accounts = [
  {
    initials: "AD",
    name: "Admin",
    role: "Administrator",
    email: "admin@wegrow.in",
    password: "Admin@123",
    color: "#092f91",
  },
  {
    initials: "PR",
    name: "Priya Raghavan",
    role: "HR Manager",
    email: "priya@wegrow.in",
    password: "Demo@123",
    color: "#d4145a",
  },
  {
    initials: "AM",
    name: "Arjun Mehta",
    role: "Head of Operations",
    email: "arjun@wegrow.in",
    password: "Demo@123",
    color: "#1671d9",
  },
  {
    initials: "KS",
    name: "Kavya Subramanian",
    role: "Lead Trainer, Data Analytics",
    email: "kavya@wegrow.in",
    password: "Demo@123",
    color: "#7622a8",
  },
  {
    initials: "RN",
    name: "Rahul Nair",
    role: "Admissions Counsellor",
    email: "rahul@wegrow.in",
    password: "Demo@123",
    color: "#218838",
  },
];

const features = [
  {
    icon: "https://cdn-icons-png.flaticon.com/128/11063/11063388.png",
    label: "Team chat",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/128/17315/17315978.png",
    label: "Channels",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/128/3719/3719612.png",
    label: "Meetings",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/128/15992/15992876.png",
    label: "Calendar",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reset, setReset] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  function selectAccount(account) {
    setEmail(account.email);
    setPassword(account.password);
    setMessage("");
    setForgotMode(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!email.trim()) {
      setMessage("Please enter your work email.");
      return;
    }

    if (forgotMode) {
      setMessage(
        "Password reset requested. Connect an email service to send a reset link."
      );
      return;
    }

    if (!password) {
      setMessage("Please enter your password.");
      return;
    }

    const account = accounts.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (account) {
      setLoading(true);
      setMessage(`Welcome, ${account.name}! Login successful.`);
      setLoading(false);
    } else {
      setMessage("Invalid email or password. Please try again.");
    }
  }

  function resetForm() {
    setEmail("");
    setPassword("");
    setMessage("");
    setShowPassword(false);
    setForgotMode(false);
    setReset(true);

    setTimeout(() => setReset(false), 2500);
  }

  return (
    <main className="login-page">
      {/* LEFT WELCOME PANEL */}
      <section className="welcome-panel">
        <div className="dot-pattern" />

        <div className="welcome-content">
          {/* WEGROW CONNECTX BRAND */}
          <div className="brand-name">
            <div className="brand-first-line">
              <span>WeGr</span>

              <span className="logo-o">
                <img src="/wegro&bschool1.png" alt="WeGrow logo icon" />
              </span>

              <span>w</span>
            </div>

            <div className="connect-text">
              Connect<span className="orange-x">X</span>
            </div>
          </div>

          {/* WELCOME TEXT */}
          <div className="welcome-copy">
            <h1>
              Where our teams
              <br />
              <span>connect</span>, learn and
              <br />
              grow.
            </h1>

            <p>
              Chat, channels, meetings and calendars for everyone at WeGrow,
              SkillCampus and BSchool, all in one place.
            </p>

            {/* FEATURES WITH FLATICON IMAGE */}
            <div className="feature-grid">
              {features.map((feature, index) => (
                <div className="feature-item" key={index}>
                  <img
                    src={feature.icon}
                    alt={feature.label}
                    className="feature-icon"
                  />
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SQUIRREL MESSAGE */}
          <div className="mascot-message">
            Welcome back! Let&apos;s
            <br />
            grow together 👋
            <span className="message-arrow" />
          </div>

          {/* SQUIRREL IMAGE */}
          <img
            className="squirrel-mascot"
            src="/squirrel.png"
            alt="WeGrow squirrel mascot"
          />

          {/* BRAND BADGES */}
          <div className="brand-badges">
            <div className="brand-badge">
              <span className="brand-dot green">W</span>
              WeGrow
            </div>

            <div className="brand-badge">
              <span className="brand-dot purple">SC</span>
              SkillCampus
            </div>

            <div className="brand-badge">
              <span className="brand-dot red">BS</span>
              BSchool
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT LOGIN PANEL */}
      <section className="form-panel">
        <div className="login-card">
          {/* LOGIN LOGO */}
          <img
            className="card-logo"
            src="/wegrow&Bschool.png"
            alt="WeGrow ConnectX"
          />

          {/* FORM HEADING */}
          <div className="form-heading">
            <h2>Welcome back!</h2>

            <p>
              Sign in with the work email and password your admin gave you.
            </p>
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="email">Work email</label>

              <input
                id="email"
                type="email"
                placeholder="you@wegrow.in"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
              />
            </div>

            {/* PASSWORD */}
            {!forgotMode && (
              <div className="form-group">
                <label htmlFor="password">Password</label>

                <div className="password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    className="show-password"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              className="sign-in-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : forgotMode
                  ? "Reset password →"
                  : "Sign in →"}
            </button>

            {/* FORGOT PASSWORD */}
            <button
              className="forgot-button"
              type="button"
              onClick={() => {
                setForgotMode(!forgotMode);
                setMessage("");
              }}
            >
              {forgotMode ? "Back to sign in" : "Forgot password?"}
            </button>

            {/* STATUS MESSAGE */}
            {message && (
              <div
                className={`form-message ${
                  message.includes("successful") ? "success" : ""
                }`}
                role="status"
              >
                {message}
              </div>
            )}
          </form>

          {/* DEMO ACCOUNTS */}
          <div className="prototype-box">
            <div className="prototype-header">
              <h3>Logins</h3>
              <span>Select one to fill in</span>
            </div>

            <div className="account-list">
              {accounts.map((account) => (
                <button
                  className="account-item"
                  key={account.email}
                  type="button"
                  onClick={() => selectAccount(account)}
                >
                  <span
                    className="avatar"
                    style={{ backgroundColor: account.color }}
                  >
                    {account.initials}
                  </span>

                  <span className="account-info">
                    <strong>{account.name}</strong>

                    <small>
                      {account.email === "admin@wegrow.in"
                        ? `${account.email} · ${account.password}`
                        : account.role}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* RESET FORM */}
          <button
            className="reset-button"
            type="button"
            onClick={resetForm}
            aria-label="Reset login form"
          >
            {reset ? "Form cleared!" : ""}
          </button>
        </div>

        {/* FOOTER */}
        <footer className="form-footer">
          WeGrow · SkillCampus · BSchool
        </footer>
      </section>
    </main>
  );
}

