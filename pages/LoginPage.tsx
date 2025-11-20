import React, { useState } from "react";
import { Backend, getDeviceId } from "../services/backendService";

interface LoginPageProps {
  onLoginSuccess: (userData: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------------------------
  // 🔵 1) Login com Google (popup do próprio AI Studio)
  // -------------------------------------------------------------------
  async function handleGoogleLogin() {
    try {
      setLoading(true);
      setError(null);

      // Login oficial dentro do AI Studio
      // (o próprio ambiente abre o popup)
      // @ts-ignore
      const user = await window.ai?.auth?.signInWithGoogle();

      if (!user) {
        throw new Error("Não foi possível autenticar com o Google");
      }

      const email = user.email;
      const name = user.displayName || "Usuário";

      // 🔐 Fingerprint real do device
      const deviceFingerprint = getDeviceId();

      // -------------------------------------------------------------------
      // 🔥 2) Registrar sessão e validar antifraude
      // -------------------------------------------------------------------
      const session = await Backend.sessionStart({
        email,
        name,
        deviceFingerprint,
      });

      // Se OK → manda para dashboard
      onLoginSuccess({
        ...session.user,
        email,
        name,
      });

    } catch (err: any) {
      console.error("Erro no login:", err);
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <h1 className="login-title">TravelMundo IA — Acesso</h1>
      <p className="login-subtitle">Entre com Google para continuar</p>

      {error && <p className="login-error">{error}</p>}

      <button
        className="google-login-btn"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        {loading ? "Entrando..." : "✨ Entrar com Google"}
      </button>
    </div>
  );
};

export default LoginPage;
