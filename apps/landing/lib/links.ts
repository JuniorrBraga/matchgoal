// Links externos da landing page.
// Fluxo: LP → /checkout (app) → PIX via Abacate API → webhook cria conta → /login → app.

/** App (área logada). */
export const APP_URL = "https://app.matchgoal.site";

/** Checkout próprio: coleta email → gera PIX transparente → webhook com email funciona. */
export const ABACATE_CHECKOUT = `${APP_URL}/checkout`;

/** Login do app (para quem já assinou). */
export const APP_LOGIN_URL = `${APP_URL}/login`;
