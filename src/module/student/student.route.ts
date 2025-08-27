import { Router } from "express";
import StudentController from "./student.controller";
import { authRequired, requireRoles } from "../../middlewares/auth";

const router: Router = Router();

router.get(
  "/",
  authRequired,
  requireRoles(["admin", "teacher"]),
  StudentController.getStudents
);

router.get("/:id", StudentController.getStudentById);

router.post(
  "/",
  authRequired,
  requireRoles(["admin"]),
  StudentController.createStudent
);

export default router;
