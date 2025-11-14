import e from "express";

export const apiRouter = e.Router();

// employee api
apiRouter.get("/api/employee", (req, res) => {
  res.json({
    message: "Employee list",
    data: [],
  });
});
