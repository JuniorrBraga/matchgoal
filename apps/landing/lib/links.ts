// Links externos da landing page.
// Fluxo: LP → checkout Kiwify → pagamento → webhook cria conta → /login → app.

/** Checkout da Kiwify (PIX/cartão/boleto). */
export const ABACATE_CHECKOUT = "https://pay.kiwify.com.br/NfTuIhY";

/** App (área logada). */
export const APP_URL = "https://app.matchgoal.site";

/** Login do app (para quem já assinou). */
export const APP_LOGIN_URL = `${APP_URL}/login`;
