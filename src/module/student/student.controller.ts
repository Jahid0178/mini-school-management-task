import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../prisma/client";
import config from "../../config";

const getStudents = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || config.PAGINATION_LIMIT;
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        skip,
        take: limit,
        include: {
          class: true,
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      }),
      prisma.student.count(),
    ]);

    return res.status(200).json({
      status: 200,
      message: "Students fetched successfully",
      success: true,
      data: students,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      success: false,
    });
  }
};

const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, age, classId } = req.body;

    if (classId) {
      const existingClass = await prisma.class.findUnique({
        where: { id: classId },
      });

      if (!existingClass) {
        return res.status(400).json({
          status: 400,
          message: "Class not found",
          success: false,
        });
      }
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: `${name.toLowerCase().replace(/\s/g, "_")}@student.com`,
        password: bcrypt.hashSync("student123", 10),
        role: "student",
      },
    });

    const studentData = {
      name,
      age,
      classId: classId,
      userId: user.id,
    };

    if (classId) {
      studentData.classId = classId;
    }

    const createStudent = await prisma.student.create({
      data: studentData,
      include: {
        class: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!createStudent)
      return res.status(400).json({
        status: 400,
        message: "Student creation failed",
        success: false,
      });

    return res.status(201).json({
      status: 201,
      message: "Student created successfully",
      success: true,
      data: createStudent,
    });
  } catch (error: unknown) {
    console.error("create student error", error);
  }
};

const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({
        status: 400,
        message: "Please provide student id",
        success: false,
      });

    const student = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    if (!student)
      return res.status(404).json({
        status: 404,
        message: "Student not found",
        success: false,
      });

    return res.status(200).json({
      status: 200,
      message: "Student fetched successfully",
      success: true,
      data: student,
    });
  } catch (error: unknown) {
    console.error("get student by id error", error);
  }
};

const StudentController = {
  getStudents,
  createStudent,
  getStudentById,
};

export default StudentController;
