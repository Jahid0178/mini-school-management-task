import { Router } from "express";
import ClassController from "./class.controller";
import { authRequired, requireRoles } from "../../middlewares/auth";

const router: Router = Router();

// Create new class
router.post(
  "/",
  authRequired,
  requireRoles(["admin"]),
  ClassController.createClass
);

router.post(
  "/:id/enroll",
  authRequired,
  requireRoles(["admin", "teacher"]),
  ClassController.enrollStudent
);
router.get("/:id/students", authRequired, ClassController.getClassStudents);

export default router;
