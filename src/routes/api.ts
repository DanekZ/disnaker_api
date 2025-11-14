import e from "express";
import { authMiddleware } from "../middleware/auth-middleware";

export const apiRouter = e.Router();
apiRouter.use(authMiddleware);

// employee api
apiRouter.get("/api/employee", (req, res) => {
  res.json({
    message: "Employee list",
    data: [],
  });
});
