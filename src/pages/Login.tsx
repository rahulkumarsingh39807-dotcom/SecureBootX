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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      const user = response.data.user;

      const storage = rememberMe
        ? localStorage
        : sessionStorage;

      storage.setItem(
        "securebootx_user",
        JSON.stringify(user)
      );

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Unable to connect to the SecureBootX server."
        );
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

          <p>
            Cybersecurity Monitoring Platform
          </p>

        </div>

        <form onSubmit={handleLogin}>

          <div className="login-form-group">

            <label>Email</label>

            <div className="input-wrapper">

              <Mail size={18} />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

          </div>

          <div className="login-form-group">

            <label>Password</label>

            <div className="input-wrapper">

              <Lock size={18} />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>

          </div>

          {error && (
            <div className="login-error">
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
              />

              Remember me
            </label>

            <a href="#">
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