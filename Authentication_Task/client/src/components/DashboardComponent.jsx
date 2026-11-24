import { useState } from "react";
import { useAuth } from "../context/useAuth";
import ProductComponent from "./ProductComponent";

function DashboardComponent() {
    const { user, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
    };

    return (
        <main className="dashboard">
            <nav className="dashboard-nav">
                <div className="brand">
                    <span className="brand-mark">A</span>
                    <span>AuthSpace</span>
                </div>
                <button
                    className="logout-button"
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                >
                    {isLoggingOut ? "Signing out..." : "Sign out"}
                </button>
            </nav>

            <section className="dashboard-card">
                <span className="eyebrow">Account overview</span>
                <h1>Welcome, {user?.name || "User"}!</h1>
                <p>Your account is active and protected.</p>

                <div className="profile-grid">
                    <div>
                        <span>Name</span>
                        <strong>{user?.name || "-"}</strong>
                    </div>
                    <div>
                        <span>Email</span>
                        <strong>{user?.email || "-"}</strong>
                    </div>
                    <div>
                        <span>Status</span>
                        <strong className="status">Authenticated</strong>
                    </div>
                </div>
            </section>

            <ProductComponent />
        </main>
    );
}

export default DashboardComponent;
