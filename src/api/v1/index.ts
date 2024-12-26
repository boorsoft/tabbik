import { Router } from "express";
import tournaments from "./tournaments/tournaments.routes";
import teamInvitations from "./teamInvitations/teamInvitations.routes";
import { authMiddleware } from "../../middleware/auth.middleware";
import { auth } from "./auth/auth.routes";
import tournamentTeamsRoutes from "./tournamentTeams/tournamentTeams.routes";
import userRoutes from "./user/user.routes";

const api = Router();

api.use("/auth", auth);

api.use(authMiddleware);

api.use("/tournaments", tournaments);
api.use("/team-invitations", teamInvitations);
api.use("/tournament-teams", tournamentTeamsRoutes);
api.use("/users", userRoutes);

export default api;
