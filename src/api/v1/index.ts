import { Router } from "express";
import tournaments from "./tournaments/tournaments.routes";
import teamInvitations from "./teamInvitations/teamInvitations.routes";
import { authMiddleware } from "../../middleware/auth.middleware";
import { auth } from "./auth/auth.rotes";
import responseMiddleware from "../../middleware/response.middleware";

const api = Router();

api.use("/auth", auth);

api.use(authMiddleware);

api.use("/tournaments", tournaments);
api.use("/team-invitations", teamInvitations);

api.use(responseMiddleware);

export default api;
