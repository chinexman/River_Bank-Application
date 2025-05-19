import rateLimit from "express-rate-limit";

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, // Max requests per windowMs per IP
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, 
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});