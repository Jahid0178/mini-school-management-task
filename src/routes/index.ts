import { Router } from "express";
import authRoute from "../module/auth/auth.route";
import studentRoute from "../module/student/student.route";
import classRoute from "../module/class/class.route";

const router: Router = Router();

const apiRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/students",
    route: studentRoute,
  },
  {
    path: "/classes",
    route: classRoute,
  },
];

apiRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
