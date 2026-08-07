import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

import { loginWithGoogle } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

import logoImg from "../../assets/logo.png";
import styles from "./Login.module.css";

function Login(): React.JSX.Element {
  const { login } = useAuth();

  const [error, setError] = useState<string | null>(null);

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.logoWrapper}>
          <img src={logoImg} alt="Job Market" className={styles.logo} />
        </div>

        <p className={styles.label}>Junior career platform</p>

        <h1>Welcome to Job Market</h1>

        <p className={styles.description}>
          Discover junior, entry-level and internship opportunities from
          companies across the United States.
        </p>

        <div className={styles.features}>
          <span>Junior</span>
          <span>Entry Level</span>
          <span>Internships</span>
        </div>

        <div className={styles.divider}>
          <span>Sign in to continue</span>
        </div>

        <div className={styles.googleButton}>
          <GoogleLogin
            width="280"
            size="large"
            shape="pill"
            theme="outline"
            text="signin_with"
            onSuccess={async (credentialResponse) => {
              try {
                setError(null);

                const credential = credentialResponse.credential;

                if (!credential) {
                  throw new Error("Google credential is missing");
                }

                const response = await loginWithGoogle(credential);

                login(response.user);
              } catch (error: unknown) {
                console.error("Google login failed:", error);

                setError(
                  error instanceof Error
                    ? error.message
                    : "Google login failed",
                );
              }
            }}
            onError={() => {
              setError("Google login failed");
            }}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.privacy}>
          We only use your Google account to identify you.
        </p>
      </section>
    </main>
  );
}

export default Login;
