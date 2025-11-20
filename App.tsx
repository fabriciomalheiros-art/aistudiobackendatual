import React, { useState, useEffect } from "react";
import { FaCommentAlt, FaInstagram } from "react-icons/fa";

import StyleMundoPage from './pages/StyleMundoPage';
import SportMundoPage from './pages/SportMundoPage';
import LifeMundoPage from './pages/LifeMundoPage';
import TravelMundoPage from './pages/TravelMundoPage';

import DashboardPage from "./pages/DashboardPage";
import { Backend, getDeviceFingerprint } from "./services/backendService";

import { INSTAGRAM_URL } from "./constants";
import "./App.css";

function App() {
  // ------------------------------------------
  // 🔥 ESTADOS GERAIS
  // ------------------------------------------
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [activeModulePage, setActiveModulePage] = useState<string | null>(null);

  // Feedback modal
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  // ------------------------------------------
  // 🔐 1) Restaurar sessão salva ao abrir
  // ------------------------------------------
  useEffect(() => {
    const saved = localStorage.getItem("tm_session");
    if (saved) {
      setSession(JSON.parse(saved));
    }
    setLoadingSession(false);
  }, []);

  // ------------------------------------------
  // 🔐 2) Login com Google (simples / prompt)
  // ------------------------------------------
  async function handleGoogleLogin() {
    try {
      const tempEmail = prompt("Digite seu email Google:");
      if (!tempEmail) return;

      const deviceFingerprint = getDeviceFingerprint();

      const { ok, user } = await Backend.startSession(tempEmail, tempEmail.split("@")[0]);

      if (ok) {
        const finalUser = { ...user, deviceFingerprint };
        setSession(finalUser);
        localStorage.setItem("tm_session", JSON.stringify(finalUser));
      }
    } catch (err: any) {
      alert("Erro ao fazer login: " + err.message);
    }
  }

  // ------------------------------------------
  // 🔐 3) Logout
  // ------------------------------------------
  function handleLogout() {
    localStorage.removeItem("tm_session");
    setSession(null);
    setActiveModulePage(null);
  }

  // ------------------------------------------
  // 🔄 Atualizar créditos (para botão refresh)
  // ------------------------------------------
  async function handleRefreshCredits() {
    if (!session) return;
    try {
      const data = await Backend.getCredits(session.userId);
      const updated = { ...session, credits: data.credits };
      setSession(updated);
      localStorage.setItem("tm_session", JSON.stringify(updated));
    } catch {
      alert("Erro ao atualizar créditos");
    }
  }

  // ------------------------------------------
  // 🛒 Ir para a compra de créditos
  // ------------------------------------------
  function handleGoToBuyCredits() {
    alert("➡ Em breve: página completa de compra dentro do app");
  }

  // ------------------------------------------
  // 🔀 RENDERIZAÇÃO DE MÓDULOS
  // ------------------------------------------
  function renderModule() {
    switch (activeModulePage) {
      case "travelmundo":
        return <TravelMundoPage onGoBack={() => setActiveModulePage(null)} />;

      case "stylemundo":
        return <StyleMundoPage onGoBack={() => setActiveModulePage(null)} />;

      case "sportmundo":
        return <SportMundoPage onGoBack={() => setActiveModulePage(null)} />;

      case "lifemundo":
        return <LifeMundoPage onGoBack={() => setActiveModulePage(null)} />;

      default:
        return null;
    }
  }

  // =================================================================
  // 🔥 RENDER FINAL DO APP
  // =================================================================

  if (loadingSession) {
    return <div className="loading-screen">Carregando...</div>;
  }

  // 1) Sem sessão → login
  if (!session) {
    return (
      <div className="login-screen">
        <h1>TravelMundo IA</h1>
        <p>Acesse com Google para continuar</p>

        <button className="login-btn" onClick={handleGoogleLogin}>
          Entrar com Google
        </button>
      </div>
    );
  }

  // 2) Sessão ativa + módulo selecionado
  if (activeModulePage) {
    return (
      <div className="app-wrapper">
        {renderModule()}

        {/* FEEDBACK */}
        <button className="feedback-btn" onClick={() => setShowFeedback(true)}>
          <FaCommentAlt className="mr-2" /> Feedback
        </button>

        {showFeedback && (
          <div className="feedback-modal animate-fade-in">
            <div className="feedback-box">
              <button
                onClick={() => setShowFeedback(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>

              <h2>💡 Envie seu feedback</h2>

              <textarea
                placeholder="Conte o que achou..."
                rows={6}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              ></textarea>

              <div className="feedback-actions">
                <button onClick={() => alert("Enviado!")}>Enviar</button>
                <button onClick={() => setShowFeedback(false)}>Fechar</button>
              </div>
            </div>
          </div>
        )}

        {/* Instagram */}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="instagram-btn fixed bottom-6 right-6"
        >
          <FaInstagram className="text-xl mr-2" />
          <span>Seguir no Instagram</span>
        </a>
      </div>
    );
  }

  // 3) Sem módulo → Dashboard Premium
  return (
    <div className="app-wrapper">
      <DashboardPage
        user={session}
        onSelectModule={(moduleName) => setActiveModulePage(moduleName)}
        onLogout={handleLogout}
        onGoToBuyCredits={handleGoToBuyCredits}
        onRefreshCredits={handleRefreshCredits}
      />

      {/* FEEDBACK */}
      <button className="feedback-btn" onClick={() => setShowFeedback(true)}>
        <FaCommentAlt className="mr-2" /> Feedback
      </button>

      {showFeedback && (
        <div className="feedback-modal animate-fade-in">
          <div className="feedback-box">
            <button
              onClick={() => setShowFeedback(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
            >
              &times;
            </button>

            <h2>💡 Envie seu feedback</h2>

            <textarea
              placeholder="Conte o que achou..."
              rows={6}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            ></textarea>

            <div className="feedback-actions">
              <button onClick={() => alert("Enviado!")}>Enviar</button>
              <button onClick={() => setShowFeedback(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Instagram */}
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="instagram-btn fixed bottom-6 right-6"
      >
        <FaInstagram className="text-xl mr-2" />
        <span>Seguir no Instagram</span>
      </a>
    </div>
  );
}

export default App;

