import express from "express";
import { checkUserJwt } from "../middlewares/jwtService";
import QuizController from "../controllers/quizController";

const router = express.Router();

const quizRoute = (app) => {
  // Employer routes
  // Create a new quiz
  router.post("/", checkUserJwt, QuizController.createQuiz);
  
  // Add multiple questions to a quiz
  router.post("/:quizId/questions", checkUserJwt, QuizController.addQuestion);
  
  // Get all quizzes created by the current employer
  router.get("/employer", checkUserJwt, QuizController.getQuizzesByEmployer);
  
  router.get("/employees-for-assignment", checkUserJwt, QuizController.getAllEmployeesForAssignment);
  // Get detailed information about a quiz
  
  // Get employees who can be assigned to any quiz (general list)
  
  // Assign quiz to employees
  router.post("/:quizId/assign", checkUserJwt, QuizController.assignQuiz);
  
  // Get quiz results for an employer
  router.get("/:quizId/results", checkUserJwt, QuizController.getQuizResults);
  
  // Get list of employee results for a specific quiz
  router.get("/:quizId/employee-results", checkUserJwt, QuizController.getEmployeeQuizResults);
  
  // Get all assignments for a specific quiz (for employer)
  router.get("/:quizId/assignments", checkUserJwt, QuizController.getQuizAssignmentsByQuizId);
  
  // Employee routes
  // Get all quizzes assigned to the current employee
  router.get("/assigned/employee", checkUserJwt, QuizController.getAssignedQuizzes);
  
  // Get a specific quiz assignment with questions
  router.get("/assignments/:assignmentId", checkUserJwt, QuizController.getQuizAssignment);
  
  // Submit quiz answers
  router.post("/assignments/:quizId/submit", checkUserJwt, QuizController.submitQuizAnswers);
  
  router.get("/my-answers/:quizId", checkUserJwt, QuizController.getEmployeeQuizAnswers);
  
  // Employer route - Get detailed answers from a specific assignment
  router.get("/detailed-answers/:assignmentId", checkUserJwt, QuizController.getDetailedQuizAnswers);

  // Get a specific quiz result (for both employer and employee)
  router.get("/results/:assignmentId", checkUserJwt, QuizController.getQuizResultDetails);
  router.get("/:quizId", checkUserJwt, QuizController.getQuizDetails);

  return app.use("/quiz", router);
};

module.exports = quizRoute;
