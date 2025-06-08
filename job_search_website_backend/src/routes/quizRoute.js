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
  
  // Get detailed information about a quiz
  router.get("/:quizId", checkUserJwt, QuizController.getQuizDetails);
  
  // Assign quiz to employees
  router.post("/:quizId/assign", checkUserJwt, QuizController.assignQuiz);
  
  // Get quiz results for an employer
  router.get("/:quizId/results", checkUserJwt, QuizController.getQuizResults);
  
  // Get list of employee results for a specific quiz
  router.get("/:quizId/employee-results", checkUserJwt, QuizController.getEmployeeQuizResults);
  
  // Employee routes
  // Get all quizzes assigned to the current employee
  router.get("/assigned/employee", checkUserJwt, QuizController.getAssignedQuizzes);
  
  // Get a specific quiz assignment with questions
  router.get("/assignments/:assignmentId", checkUserJwt, QuizController.getQuizAssignment);
  
  // Submit quiz answers
  router.post("/assignments/:quizId/submit", checkUserJwt, QuizController.submitQuizAnswers);
  
  // Get a specific quiz result (for both employer and employee)
  router.get("/results/:assignmentId", checkUserJwt, QuizController.getQuizResultDetails);

  return app.use("/quiz", router);
};

module.exports = quizRoute;
