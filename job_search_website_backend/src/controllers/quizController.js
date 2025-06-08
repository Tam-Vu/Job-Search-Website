import { response } from "express";
import quizService from "../services/quizService";

class QuizController {
  // Create a new quiz
  createQuiz = async (req, res) => {
    try {
      const { title, description } = req.body;
      const employerId = req.user.employerId;
      
      if (!title) {
        return res.status(200).json({
          EM: "Quiz title is required",
          EC: 1,
          DT: "",
        });
      }
      
      const response = await quizService.createQuiz(employerId, title, description);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: "" 
      });
    }
  };

  // Add a question to a quiz
  addQuestion = async (req, res) => {
    try {
      const { quizId } = req.params;
      const { questions } = req.body;
      
      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(200).json({
          EM: "At least one question is required",
          EC: 1,
          DT: "",
        });
      }
      
      // Validate questions
      for (const question of questions) {
        if (!question.questionText || !question.questionType) {
          return res.status(200).json({
            EM: "Question text and type are required for all questions",
            EC: 1,
            DT: "",
          });
        }
        
        if (question.questionType === 'multiple-choice' && 
            (!question.choices || question.choices.length < 2)) {
          return res.status(200).json({
            EM: "Multiple-choice questions must have at least 2 choices",
            EC: 1,
            DT: "",
          });
        }
      }
      
      const response = await quizService.addQuestions(quizId, questions);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: "" 
      });
    }
  };

  // Get all quizzes created by the current employer
  getQuizzesByEmployer = async (req, res) => {
    try {
      const employerId = req.user.employerId;
      const response = await quizService.getQuizzesByEmployer(employerId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: "" 
      });
    }
  };

  // Get detailed information about a quiz
  getQuizDetails = async (req, res) => {
    try {
      const { quizId } = req.params;
      const response = await quizService.getQuizDetails(quizId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: "" 
      });
    }
  };

  // Assign quiz to employees
  assignQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const { employeeIds } = req.body;
      
      if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
        return res.status(200).json({
          EM: "At least one employee must be selected",
          EC: 1,
          DT: "",
        });
      }
      
      const response = await quizService.assignQuiz(quizId, employeeIds);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: "" 
      });
    }
  };

  // Get all quizzes assigned to the current employee
  getAssignedQuizzes = async (req, res) => {
    try {
      const employeeId = req.user.employeeId;
      const response = await quizService.getAssignedQuizzes(employeeId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: "" 
      });
    }
  };

  // Get a specific quiz assignment with questions
  getQuizAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const employeeId = req.user.employeeId;
      const response = await quizService.getQuizAssignment(assignmentId, employeeId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: "" 
      });
    }
  };

  // Submit quiz answers
  submitQuizAnswers = async (req, res) => {
    try {
      const { quizId } = req.params;
      const { answers } = req.body;
      const employeeId = req.user.employeeId;
      
      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return res.status(200).json({
          EM: "No answers provided",
          EC: 1,
          DT: "",
        });
      }
      
      const response = await quizService.submitQuizAnswers(quizId, employeeId, answers);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: "" 
      });
    }
  };

  // Get quiz results for an employer
  getQuizResults = async (req, res) => {
    try {
      const { quizId } = req.params;
      const employerId = req.user.employerId;
      const response = await quizService.getQuizResults(quizId, employerId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: "" 
      });
    }
  };

  // Get a specific quiz result
  getQuizResultDetails = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const userRole = req.user.role;
      const userId = req.user.id;
      
      const response = await quizService.getQuizResultDetails(assignmentId, userRole, userId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: "" 
      });
    }
  };

  // Get list of employee results for a specific quiz
  getEmployeeQuizResults = async (req, res) => {
    try {
      const { quizId } = req.params;
      const employerId = req.user.id;

      // Check if the quiz exists and belongs to the employer
        const response = await quizService.getQuizDetails(quizId, employerId);
        return res.status(200).json(response);
    }
    catch (error) {
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: "" 
      });
    }
}
}

module.exports = new QuizController();
