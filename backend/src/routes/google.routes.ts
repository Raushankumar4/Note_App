import { Router } from "express";
import passport from "passport";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google-blocked`,
  }),
  (req: any, res) => {
    const token = req.user.token;
    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
  }
);

export default router;
