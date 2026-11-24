import { useState } from "react";
import api from "../services/api";

function RegisterComponent({ onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
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
            const response = await api.post("/auth/register", formData);
            setMessage(response.data.message || "Registration successful");
            setMessageType("success");
            setFormData({ name: "", email: "", password: "" });
        } catch (error) {
            setMessage(error.response?.data?.message || "Registration failed");
            setMessageType("error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-heading">
                <span className="eyebrow">Create account</span>
                <h1>Join us today</h1>
                <p>Enter your details to get started.</p>
            </div>

            <label htmlFor="register-name">Full name</label>
            <input
                id="register-name"
                name="name"
                placeholder="Alex Morgan"
                value={formData.name}
                onChange={handleChange}
                minLength={3}
                maxLength={20}
                autoComplete="name"
                required
            />

            <label htmlFor="register-email">Email address</label>
            <input
                id="register-email"
                name="email"
                type="email"
                placeholder="alex@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
            />

            <label htmlFor="register-password">Password</label>
            <input
                id="register-password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                autoComplete="new-password"
                required
            />

            <button className="primary-button" type="submit" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
            </button>

            {message && (
                <p className={`form-message ${messageType}`} role="status">
                    {message}
                </p>
            )}

            <p className="auth-switch">
                Already have an account?{" "}
                <button type="button" onClick={onSwitchToLogin}>
                    Sign in
                </button>
            </p>
        </form>
    );
}

export default RegisterComponent;