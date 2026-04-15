const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://revueraworker.revuerasaas.workers.dev";

type FetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: Record<string, unknown>;
  auth?: boolean;
};

class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function apiFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = "GET", body, auth = false } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Always send session token if we have one (worker uses it for auth)
  if (auth || typeof window !== "undefined") {
    const token = typeof window !== "undefined" ? localStorage.getItem("rv_session") || "" : "";
    if (token) headers["X-Session-Token"] = token;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle 401 — smart session expiry detection.
  //
  // IMPORTANT: A single 401 does NOT mean the session is gone. The deployed worker
  // may return 401 on any endpoint if there is a bug, cold start, or transient error.
  // We only redirect to /login if BOTH conditions are true:
  //   1. The response code is AUTH_REQUIRED
  //   2. We have confirmed the session token is missing from localStorage (truly gone)
  //
  // This prevents the cascade loop: failed data call → 401 → wipe session → /login → repeat.
  if (res.status === 401 && typeof window !== "undefined") {
    let errCode = "AUTH_REQUIRED";
    try {
      const errBody = await res.clone().json();
      errCode = errBody.code || "AUTH_REQUIRED";
    } catch {}

    // Only redirect if the session token is actually missing/empty in localStorage.
    // If the token is present, the 401 is from a worker bug — don't punish the user.
    const storedToken = localStorage.getItem("rv_session");
    const sessionActuallyMissing = !storedToken || storedToken.length < 32;

    if (sessionActuallyMissing) {
      // Session is genuinely gone — clean logout
      localStorage.removeItem("rv_company");
      localStorage.removeItem("rv_session");
      window.location.href = "/login?expired=1";
    }
    // Whether or not we redirect, throw so the caller knows the request failed
    throw new ApiError("Session expired — please log in again", 401, errCode);
  }

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(
      data.error || "Something went wrong",
      res.status,
      data.code
    );
  }

  return data as T;
}

// ═══ AUTH ═══
// FIELD MAP: Worker expects `company` not `name`, `identifier` not `email` for login
export const auth = {
  // Worker expects: { company, email }
  checkDuplicate: (company: string, email: string) =>
    apiFetch("/api/signup/check-duplicate", { method: "POST", body: { company, email } }),

  // Worker expects: { company, email, phone, password, country?, authProvider? }
  createAccount: (data: { company: string; email: string; phone: string; password: string; plan?: string }) =>
    apiFetch<{ success: boolean; companyId: string; sessionToken: string; verificationRequired: boolean }>(
      "/api/signup/create",
      { method: "POST", body: data }
    ),

  // Worker expects: { identifier, password } — identifier can be email or company name
  login: (email: string, password: string) =>
    apiFetch<{ success: boolean; sessionToken: string; company: Record<string, unknown> }>(
      "/api/login",
      { method: "POST", body: { identifier: email, password } }
    ),

  verifyEmail: (code: string) =>
    apiFetch<{ success: boolean }>("/api/verify-email", { method: "POST", body: { code }, auth: true }),

  resendVerification: () =>
    apiFetch("/api/resend-verification", { method: "POST", body: {}, auth: true }),

  googleAuth: (token: string) =>
    apiFetch("/api/auth/google", { method: "POST", body: { token } }),

  googleCompleteSignup: (data: Record<string, unknown>) =>
    apiFetch("/api/auth/google/complete-signup", { method: "POST", body: data }),

  requestPasswordReset: (email: string) =>
    apiFetch("/api/password/request-reset", { method: "POST", body: { email } }),

  resetPassword: (token: string, password: string) =>
    apiFetch("/api/password/reset", { method: "POST", body: { token, password } }),

  // Worker expects: { currentPassword, newPassword } — auth via X-Session-Token header
  changePassword: (_companyId: string, currentPassword: string, newPassword: string) =>
    apiFetch("/api/password/change", {
      method: "POST",
      body: { currentPassword, newPassword },
      auth: true,
    }),
};

// ═══ SUBSCRIPTION ═══
// Worker reads companyId from the authenticated session (X-Session-Token header)
export const subscription = {
  status: () =>
    apiFetch<{
      plan: string;
      subscriptionStatus: string;
      verified: boolean;
      contactLimit: number;
      contactsUsed: number;
      googleReviewLink: string;
      shortcode: string;
      trialEnd: string;
      name: string;
      email: string;
      phone: string;
    }>("/api/subscription/status", { method: "POST", body: {}, auth: true }),

  createCheckout: (plan: string, billing: string) =>
    apiFetch<{ url: string }>("/api/checkout/create", {
      method: "POST",
      body: { plan, billing },
      auth: true,
    }),

  openPortal: () =>
    apiFetch<{ url: string }>("/api/portal", { method: "POST", body: {}, auth: true }),
};

// ═══ CUSTOMERS (Starter) ═══
// Worker expects POST with { companyId, companyName } — auth via session
export const customers = {
  list: (companyId: string, companyName: string) =>
    apiFetch<{ records: Array<{ id: string; fields: Record<string, unknown>; createdTime: string }> }>(
      "/api/customers/list",
      { method: "POST", body: { companyId, companyName }, auth: true }
    ),

  // Worker expects: { name, phone, companyId }
  add: (companyId: string, name: string, phone: string) =>
    apiFetch<{ success: boolean; smsSent?: boolean }>(
      "/api/customers/add",
      { method: "POST", body: { companyId, name, phone }, auth: true }
    ),
};

// ═══ COMPANY ═══
export const company = {
  // Worker expects: { recordId, link } — PATCH method
  updateReviewLink: (recordId: string, link: string) =>
    apiFetch("/api/company/review-link", {
      method: "PATCH",
      body: { recordId, link },
      auth: true,
    }),

  // Worker expects: { confirm: "DELETE_MY_ACCOUNT" }
  deleteAccount: () =>
    apiFetch("/api/account/delete", {
      method: "POST",
      body: { confirm: "DELETE_MY_ACCOUNT" },
      auth: true,
    }),
};

// ═══ SMS ═══
// FIX C2/IDOR: Worker now reads companyId from session token — no query param needed.
// These endpoints use GET with auth header only (no companyId in URL).
export const sms = {
  getSettings: (_companyId: string) =>
    apiFetch<{
      template: string;
      defaultTemplate: string;
      companyName: string;
      preview: string;
      replyPositive: string;
      replyNegative: string;
      replyFeedback: string;
      defaultReplyPositive: string;
      defaultReplyNegative: string;
      defaultReplyFeedback: string;
    }>("/api/sms/settings", { auth: true }),

  saveSettings: (data: {
    companyId?: string;
    template: string;
    replyPositive?: string;
    replyNegative?: string;
    replyFeedback?: string;
  }) =>
    apiFetch<{ success: boolean }>("/api/sms/settings", {
      method: "POST",
      // omit companyId — worker uses session
      body: { template: data.template, replyPositive: data.replyPositive, replyNegative: data.replyNegative, replyFeedback: data.replyFeedback },
      auth: true,
    }),
};

// ═══ ECOMMERCE ═══
// FIX C2/IDOR: All endpoints now use session for company identity — no companyId query param.
// FIX: feedback was calling /orders (wrong); now calls /ecommerce/feedback.
// FIX: stats was calling /orders (wrong); now calls /ecommerce/stats.
export const ecommerce = {
  stats: (_companyId: string) =>
    apiFetch<{ positive: number; negative: number; total: number; positiveRate: number }>(
      "/api/ecommerce/stats",
      { auth: true }
    ),

  orders: (_companyId: string) =>
    apiFetch<{ orders: Array<Record<string, unknown>>; stats: Record<string, unknown> }>(
      "/api/ecommerce/orders",
      { auth: true }
    ),

  feedback: (_companyId: string) =>
    apiFetch<{ records: Array<Record<string, unknown>> }>(
      "/api/ecommerce/feedback",
      { auth: true }
    ),

  getSettings: (_companyId: string) =>
    apiFetch("/api/ecommerce/settings", { auth: true }),

  updateSettings: (data: Record<string, unknown>) =>
    apiFetch("/api/ecommerce/settings", { method: "POST", body: data, auth: true }),

  getFunnel: (_companyId: string) =>
    apiFetch<{
      brandColor: string; funnelMessage: string; funnelPositiveText: string;
      funnelNegativeText: string; logoUrl: string; companyName: string; shortcode: string;
    }>("/api/ecommerce/funnel", { auth: true }),

  saveFunnel: (data: {
    companyId?: string; brandColor?: string; funnelMessage?: string;
    funnelPositiveText?: string; funnelNegativeText?: string; logoUrl?: string;
  }) =>
    apiFetch("/api/ecommerce/funnel", {
      method: "POST",
      // omit companyId — worker uses session
      body: { brandColor: data.brandColor, funnelMessage: data.funnelMessage, funnelPositiveText: data.funnelPositiveText, funnelNegativeText: data.funnelNegativeText, logoUrl: data.logoUrl },
      auth: true,
    }),
};

// ═══ PUBLIC ═══
export const publicApi = {
  leadCapture: (data: Record<string, unknown>) =>
    apiFetch("/api/leads/capture", { method: "POST", body: data }),

  contact: (data: Record<string, unknown>) =>
    apiFetch("/api/contact", { method: "POST", body: data }),

  businessPublic: (shortcode: string) =>
    apiFetch(`/api/business/public?shortcode=${shortcode}`),

  ecommerceEvent: (data: Record<string, unknown>) =>
    apiFetch("/api/ecommerce/event", { method: "POST", body: data }),
};

export { ApiError };
export default apiFetch;
