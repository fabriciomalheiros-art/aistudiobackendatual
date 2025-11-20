import React from "react";
import "./BuyCreditsPage.css";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { Backend } from "../services/backendService";

interface BuyCreditsPageProps {
  onGoBack: () => void;
  userEmail: string;
}

const BuyCreditsPage: React.FC<BuyCreditsPageProps> = ({ onGoBack, userEmail }) => {

  const handleOpenCheckout = (product: "10" | "25" | "40") => {
    let url = "";

    if (product === "10") {
      url = "LINK_DO_CHECKOUT_10_CREDITOS";
    } else if (product === "25") {
      url = "LINK_DO_CHECKOUT_25_CREDITOS";
    } else {
      url = "LINK_DO_CHECKOUT_40_CREDITOS";
    }

    window.open(url, "_blank");
  };

  const handleRefreshCredits = async () => {
    if (!userEmail) return alert("Erro: usuário inválido");

    try {
      const data = await Backend.getCredits(userEmail);
      alert(`Seu saldo atual é: ${data.credits} créditos`);
    } catch (err: any) {
      alert("Erro ao atualizar créditos: " + err.message);
    }
  };

  return (
    <div className="buy-credits-container">
      <button className="back-btn" onClick={onGoBack}>
        <FaArrowLeft /> Voltar
      </button>

      <h1 className="title">💳 Comprar Créditos</h1>
      <p className="subtitle">
        Escolha um pacote de créditos e desbloqueie toda a experiência TravelMundo IA.
      </p>

      <div className="plans-grid">

        {/* Plano 10 créditos */}
        <div className="plan-card">
          <h2 className="plan-title">Starter</h2>
          <p className="plan-credits">10 créditos</p>
          <p className="plan-access">Acesso somente ao módulo TravelMundo IA</p>
          <button className="plan-btn" onClick={() => handleOpenCheckout("10")}>
            Comprar 10 Créditos
          </button>
        </div>

        {/* Plano 25 créditos */}
        <div className="plan-card premium">
          <h2 className="plan-title">Explorer</h2>
          <p className="plan-credits">25 créditos</p>
          <p className="plan-access">
            <FaCheckCircle /> Acesso TOTAL a todos os módulos:
            <br />TravelMundo, StyleMundo, SportMundo e LifeMundo
          </p>
          <button className="plan-btn premium" onClick={() => handleOpenCheckout("25")}>
            Comprar 25 Créditos
          </button>
        </div>

        {/* Plano 40 créditos */}
        <div className="plan-card premium">
          <h2 className="plan-title">Master</h2>
          <p className="plan-credits">40 créditos</p>
          <p className="plan-access">
            <FaCheckCircle /> Acesso TOTAL + melhor custo-benefício
          </p>
          <button className="plan-btn premium" onClick={() => handleOpenCheckout("40")}>
            Comprar 40 Créditos
          </button>
        </div>

      </div>

      <div className="credits-refresh-box">
        <h3>Já comprou?</h3>
        <p>Clique abaixo para atualizar seus créditos agora:</p>
        <button className="refresh-btn" onClick={handleRefreshCredits}>
          Atualizar Créditos
        </button>
      </div>

      <footer className="footer">
        © 2025 TravelMundo IA — Créditos integrados com Hotmart
      </footer>
    </div>
  );
};

export default BuyCreditsPage;
