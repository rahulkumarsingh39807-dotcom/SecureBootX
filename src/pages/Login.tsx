import { ShieldCheck, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Temporary frontend login
    if (email && password) {
      navigate("/dashboard");
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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-options">

            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <a href="#">
              Forgot password?
            </a>

          </div>

          <button
            type="submit"
            className="login-button"
          >
            Sign In
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