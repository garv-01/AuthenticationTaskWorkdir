import { useState } from "react";
import { useAuth } from "../context/useAuth";

function LoginComponent({ onSwitchToRegister }) {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        setFormData((current) => ({
            ...current,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setIsLoading(true);

        try {
            await login(formData.email, formData.password);
        } catch (error) {
            setMessage(error.response?.data?.message || "Unable to sign in");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-heading">
                <span className="eyebrow">Welcome back</span>
                <h1>Sign in to your account</h1>
                <p>Continue to your personal dashboard.</p>
            </div>

            <label htmlFor="login-email">Email address</label>
            <input
                id="login-email"
                name="email"
                type="email"
                placeholder="alex@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
            />

            <label htmlFor="login-password">Password</label>
            <input
                id="login-password"
                name="password"
                type="password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
            />

            <button className="primary-button" type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
            </button>

            {message && (
                <p className="form-message error" role="alert">
                    {message}
                </p>
            )}

            <p className="auth-switch">
                New here?{" "}
                <button type="button" onClick={onSwitchToRegister}>
                    Create account
                </button>
            </p>
        </form>
    );
}

export default LoginComponent;
