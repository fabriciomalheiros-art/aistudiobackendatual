// ============================================================================
// TravelMundo IA — BACKEND CLIENT (versão premium final)
// Integrado com:
// - Login Google
// - Sessões persistentes
// - DeviceID antifraude
// - Créditos, compras, consumo, histórico
// - Permissão por planos
// - Suporte aos módulos: travelmundo, stylemundo, sportmundo, lifemundo
// ============================================================================

// /services/backendService.ts
// -----------------------------------------------------
// TravelMundo IA — Client SDK (AI Studio)
// v4.0 — compatível com antifraude + planos + módulos
// -----------------------------------------------------

const API_BASE = "https://travelmundo-api-prod-448904673707.us-west1.run.app";

// ============================================================
// 🔐 1) DeviceID persistente (evita fraudes simples)
// ============================================================
export function getDeviceFingerprint(): string {
  const KEY = "tm_device_fingerprint";

  let existing = localStorage.getItem(KEY);
  if (existing) return existing;

  const newId = crypto.randomUUID();
  localStorage.setItem(KEY, newId);
  return newId;
}

// ============================================================
// 🌐 2) Wrapper de requisição com tratamento de erro
// ============================================================
async function api(endpoint: string, method = "GET", body?: any) {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Erro desconhecido");
    }

    return data;
  } catch (err: any) {
    console.error("🔥 API ERROR:", err);
    throw new Error(err.message || "Erro ao conectar com o servidor");
  }
}

// ============================================================
// 🎯 3) Regras de módulos por plano (client-side)
// (refletem o backend v4.0.0)
// ============================================================
export const MODULE_PLAN_RULES: Record<string, string[]> = {
  free: ["travelmundo"],
  explorer: ["travelmundo"],
  creator: ["travelmundo", "stylemundo", "sportmundo", "lifemundo"],
  master: ["travelmundo", "stylemundo", "sportmundo", "lifemundo"],
};

// ============================================================
// 🧱 4) SDK oficial
// ============================================================
export const Backend = {

  // -------------------------------------------
  // 🔵 LOGIN / SESSION START (Google Login)
  // -------------------------------------------
  async startSession(email: string, name?: string) {
    const deviceFingerprint = getDeviceFingerprint();

    return api("/session/start", "POST", {
      email,
      name,
      deviceFingerprint,
    });
  },

  // -------------------------------------------
  // 🔎 USER INFO (para Dashboard Premium)
  // -------------------------------------------
  async getUserInfo(userId: string) {
    return api(`/user/info/${userId}`, "GET");
  },

  // -------------------------------------------
  // 💳 SALDO DE CRÉDITOS
  // -------------------------------------------
  async getCredits(userId: string) {
    return api(`/credits/${userId}`, "GET");
  },

  // -------------------------------------------
  // 📜 HISTÓRICO DE TRANSAÇÕES
  // -------------------------------------------
  async getTransactions(userId: string) {
    return api(`/transactions/${userId}`, "GET");
  },

  // -------------------------------------------
  // 💰 COMPRAR CRÉDITOS (Hotmart → Webhook)
  // -------------------------------------------
  async addCredits(userId: string, amount: number, transactionId?: string) {
    return api("/buy-credits", "POST", {
      userId,
      credits: amount,
      transactionId,
    });
  },

  // -------------------------------------------
  // 🧩 CONSUMO SEPARADO (opcional)
  // -------------------------------------------
  async consumeCredit(userId: string, amount = 1, reason = "generation") {
    return api("/consume-credit", "POST", {
      userId,
      credits: amount,
      reason,
    });
  },

  // =====================================================
  // 🚀 SESSÃO OFICIAL DE GERAÇÃO (com antifraude v4.0)
  // =====================================================
  async openGenerationSession({
    userId,
    module,
    destination,
    creditsCost = 1,
    metadata = {},
  }: {
    userId: string;
    module: string;
    destination?: string;
    creditsCost?: number;
    metadata?: Record<string, any>;
  }) {
    const deviceFingerprint = getDeviceFingerprint();

    return api("/sessions/generate", "POST", {
      userId,
      module,
      destination,
      creditsCost,
      deviceFingerprint,
      metadata,
    });
  },

  // -------------------------------------------
  // 🎯 Validação local (UX)
  // -------------------------------------------
  validateModuleAccess(plan: string, moduleName: string): boolean {
    const allowed = MODULE_PLAN_RULES[plan] || [];
    return allowed.includes(moduleName);
  },

};
// ========================================================
// 🚀 LOGIN / START SESSION — Wrapper para /session/start
// ========================================================
Backend.startSession = async function ({ email, name, deviceFingerprint }) {
  return api("/session/start", "POST", {
    email,
    name,
    deviceFingerprint,
  });
};

