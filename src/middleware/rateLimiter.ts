import rateLimit from "express-rate-limit";

export const apiRateLimiter = rateLimit({
  windowMs:  3 * 1000, 
  max: 2, 
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, 
  legacyHeaders: false, 
});