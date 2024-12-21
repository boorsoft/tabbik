import { Router } from "express";
import tournaments from "./tournaments/tournaments.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import teamInvitations from "./teamInvitations/teamInvitations.controller";
import { auth } from "./auth/auth.controller";

const api = Router();

api.use(authMiddleware);

api.use("/auth", auth);
api.use("/tournaments", tournaments);
api.use("/team-invitations", teamInvitations);

export default api;
