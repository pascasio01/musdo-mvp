import Stripe from "npm:stripe@^17.0.0";

// The Stripe secret key lives ONLY as a Supabase Edge Function secret.
// It never touches the frontend or the repo.
const secretKey = Deno.env.get("STRIPE_SECRET_KEY");
if (!secretKey) {
  console.error("[stripe] STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(secretKey ?? "", {
  apiVersion: "2025-03-31.basil",
  // Deno runtime: use the fetch-based HTTP client.
  httpClient: Stripe.createFetchHttpClient(),
});

// Subtle-crypto provider for async webhook signature verification in Deno.
export const cryptoProvider = Stripe.createSubtleCryptoProvider();

export { Stripe };
