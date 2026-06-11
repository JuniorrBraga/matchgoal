// Links externos da landing page.
// Fluxo: LP → checkout Abacate → pagamento → webhook cria conta → /login → app.

/** Checkout da Abacate Pay (PIX/cartão). */
export const ABACATE_CHECKOUT =
  "https://app.abacatepay.com/pay/bill_0dYMR3jLTfnfKYjY0u1QLCg4";

/** App (área logada). */
export const APP_URL = "https://app.matchgoal.site";

/** Login do app (para quem já assinou). */
export const APP_LOGIN_URL = `${APP_URL}/login`;
