
import { ShieldCheck, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: email.trim().toLowerCase(),
          password,
        }
      );

      const user = response.data.user;
      const token = response.data.token;

      if (!user || !token) {
        throw new Error(
          "The server did not return a user and authentication token."
        );
      }

      // Clear any previous session first.
      localStorage.removeItem("securebootx_user");
      localStorage.removeItem("securebootx_token");
      sessionStorage.removeItem("securebootx_user");
      sessionStorage.removeItem("securebootx_token");

      // Remember me = persistent storage.
      // Otherwise, keep the session for this browser tab.
      const storage = rememberMe
        ? localStorage
        : sessionStorage;

      storage.setItem(
        "securebootx_user",
        JSON.stringify(user)
      );

      storage.setItem("securebootx_token", token);

      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      console.error("Login failed:", err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Unable to connect to the SecureBootX server."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <ShieldCheck size={32} />
          </div>

          <h1>SecureBootX</h1>

          <p>Cybersecurity Monitoring Platform</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="login-form-group">
            <label htmlFor="email">Email</label>

            <div className="input-wrapper">
              <Mail size={18} />

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Password</label>

            <div className="input-wrapper">
              <Lock size={18} />

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
                disabled={loading}
              />
              Remember me
            </label>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="login-divider">
          <span>Secure Access</span>
        </div>

        <p className="login-footer">
          Protected by SecureBootX Security
        </p>
      </div>
    </div>
  );
}

export default Login;