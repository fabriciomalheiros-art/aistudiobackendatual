import React from "react";
import "./DashboardPage.css";
import { FaShoppingCart, FaSyncAlt } from "react-icons/fa";

interface DashboardProps {
  user: any; // { userId, credits, plan, allowedModules, devices }
  onSelectModule: (moduleName: string) => void;
  onLogout: () => void;

  // ADICIONADOS:
  onGoToBuyCredits: () => void;
  onRefreshCredits: () => void;
}

const MODULE_LABELS: Record<string, string> = {
  travelmundo: "TravelMundo IA",
  stylemundo: "StyleMundo IA",
  sportmundo: "SportMundo IA",
  lifemundo: "LifeMundo IA",
};

const PLAN_BADGES: Record<string, string> = {
  free: "FREE",
  explorer: "EXPLORER",
  creator: "CREATOR",
  master: "MASTER",
};

const DashboardPage: React.FC<DashboardProps> = ({
  user,
  onSelectModule,
  onLogout,
  onGoToBuyCredits,
  onRefreshCredits,
}) => {
  const { credits, plan, allowedModules, email, name } = user;

  return (
    <div className="dashboard-container">
      
      {/* HEADER */}
      <header className="dashboard-header">
        <h1>TravelMundo IA — Portal Premium</h1>
        <button className="logout-btn" onClick={onLogout}>
          Sair
        </button>
      </header>

      {/* USER CARD */}
      <section className="user-card">
        <h2>{name}</h2>
        <p className="email">{email}</p>

        <div className="status-row">
          <div className="status-box">
            <span className="status-label">Créditos</span>
            <span className="status-value">{credits}</span>

            {/* Refresh Credits */}
            <button className="refresh-credits-btn" onClick={onRefreshCredits}>
              <FaSyncAlt className="mr-1" /> Atualizar
            </button>
          </div>

          <div className="status-box">
            <span className="status-label">Plano</span>
            <span className="status-tag plan-tag">
              {PLAN_BADGES[plan] || plan.toUpperCase()}
            </span>
          </div>
        </div>

        {/* BUY CREDITS BUTTON */}
        <div className="buy-section">
          <button className="buy-btn" onClick={onGoToBuyCredits}>
            <FaShoppingCart className="mr-2" /> Comprar Créditos
          </button>
        </div>
      </section>

      {/* MODULES SECTION */}
      <section className="modules-section">
        <h2>Módulos Disponíveis</h2>

        <div className="modules-grid">
          {Object.keys(MODULE_LABELS).map((moduleKey) => {
            const allowed = allowedModules.includes(moduleKey);

            return (
              <div
                key={moduleKey}
                className={`module-card ${allowed ? "allowed" : "blocked"}`}
                onClick={() => allowed && onSelectModule(moduleKey)}
              >
                <h3>{MODULE_LABELS[moduleKey]}</h3>

                {allowed ? (
                  <p className="allowed-text">Liberado ✔</p>
                ) : (
                  <p className="blocked-text">Bloqueado 🔒</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="dashboard-footer">
        © 2025 TravelMundo IA | Desenvolvido por Fabricio Menezes IA
      </footer>
    </div>
  );
};

export default DashboardPage;
