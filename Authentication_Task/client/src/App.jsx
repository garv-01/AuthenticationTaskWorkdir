import { useState } from "react";
import DashboardComponent from "./components/DashboardComponent";
import LoginComponent from "./components/LoginComponent";
import RegisterComponent from "./components/RegisterComponent";
import { useAuth } from "./context/useAuth";

const App = () => {
    const { user, isLoading } = useAuth();
    const [view, setView] = useState("login");

    if (isLoading) {
        return (
            <main className="loading-screen">
                <div className="spinner" aria-label="Loading" />
            </main>
        );
    }

    if (user) {
        return <DashboardComponent />;
    }

    return (
        <main className="auth-page">
            <aside className="auth-banner">
                <div className="brand brand-light">
                    <span className="brand-mark">A</span>
                    <span>AuthSpace</span>
                </div>
                <div className="banner-copy">
                    <span className="eyebrow">Secure by design</span>
                    <h2>One account.<br />Everything connected.</h2>
                    <p>Fast, reliable authentication for your next project.</p>
                </div>
            </aside>

            <section className="auth-panel">
                {view === "login" ? (
                    <LoginComponent onSwitchToRegister={() => setView("register")} />
                ) : (
                    <RegisterComponent onSwitchToLogin={() => setView("login")} />
                )}
            </section>
        </main>
    );
};

export default App;