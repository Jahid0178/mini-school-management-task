import { Request, Response } from "express";
import prisma from "../../prisma/client";

const createClass = async (req: Request, res: Response) => {
  try {
    const { name, section } = req.body;

    if (!name || !section) {
      return res.status(400).json({
        message: "Name and section are required",
      });
    }

    const existingClass = await prisma.class.findFirst({
      where: {
        name,
        section,
      },
    });

    if (existingClass) {
      return res.status(400).json({
        message: "Class with this name and section already exists",
      });
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        section,
      },
      include: {
        students: true,
      },
    });

    return res.status(201).json({
      status: 201,
      message: "Class created successfully",
      success: true,
      data: newClass,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const enrollStudent = async (req: Request, res: Response) => {
  try {
    const { id: classId } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        message: "Student ID is required",
      });
    }

    const [classExist, student] = await Promise.all([
      prisma.class.findUnique({
        where: {
          id: classId!,
        },
      }),
      prisma.student.findUnique({
        where: {
          id: studentId,
        },
      }),
    ]);

    if (!classExist) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const enrolledStudent = await prisma.class.update({
      where: {
        id: classId!,
      },
      data: {
        students: {
          connect: {
            id: studentId,
          },
        },
      },
      include: {
        students: true,
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Student enrolled successfully",
      success: true,
      data: enrolledStudent,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getClassStudents = async (req: Request, res: Response) => {
  try {
    const { id: classId } = req.params;
    const classes = await prisma.class.findMany({
      where: {
        id: classId!,
      },
      include: {
        students: true,
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Classes retrieved successfully",
      success: true,
      data: classes,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const ClassController = {
  createClass,
  enrollStudent,
  getClassStudents,
};

export default ClassController;
