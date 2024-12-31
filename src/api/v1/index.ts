import { Router } from "express";
import swaggerUi from "swagger-ui-express";

import tournaments from "./tournaments/tournaments.routes";
import teamInvitations from "./teamInvitations/teamInvitations.routes";
import { authMiddleware } from "../../middleware/auth.middleware";
import { auth } from "./auth/auth.routes";
import tournamentTeamsRoutes from "./tournamentTeams/tournamentTeams.routes";
import userRoutes from "./user/user.routes";
import yaml from "js-yaml";
import { readFileSync } from "fs";

const api = Router();

const apiDocs = yaml.load(readFileSync("openapi.yaml", "utf8")) as Record<
  string,
  unknown
>;

api.use("/docs", swaggerUi.serve);
api.get("/docs", swaggerUi.setup(apiDocs));
api.use("/auth", auth);

api.use(authMiddleware);

api.use("/tournaments", tournaments);
api.use("/team-invitations", teamInvitations);
api.use("/tournament-teams", tournamentTeamsRoutes);
api.use("/users", userRoutes);

export default api;
