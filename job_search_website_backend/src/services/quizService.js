import db from "../models/index";
import { evaluateEssayAnswer } from "../utils/geminiService";
import EmailService from "../utils/EmailService";
import { raw } from "body-parser";

class QuizService {
  // Create a new quiz
  createQuiz = async (employerId, title, description) => {
    try {
      const quiz = await db.quizzes.create({
        employerId,
        title,
        description
      });

      return {
        EM: "Quiz created successfully",
        EC: 0,
        DT: quiz,
      };
    } catch (error) {
      console.error("Error creating quiz:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  // Add a question to a quiz
  addQuestion = async (quizId, questionText, questionType, choices = []) => {
    try {
      // Check if the quiz exists
      const quiz = await db.quizzes.findByPk(quizId);
      if (!quiz) {
        return {
          EM: "Quiz not found",
          EC: 1,
          DT: "",
        };
      }

      // Create question
      const question = await db.questions.create({
        quizId,
        questionText,
        questionType
      });

      // For multiple-choice questions, add choices
      if (questionType === 'multiple-choice' && choices && choices.length > 0) {
        const choicesWithQuestionId = choices.map(choice => ({
          questionId: question.id,
          choiceText: choice.text,
          isCorrect: choice.isCorrect
        }));

        await db.choices.bulkCreate(choicesWithQuestionId);
      }

      // Fetch the created question with its choices
      const createdQuestion = await db.questions.findByPk(question.id, {
        include: [
          {
            model: db.choices,
            attributes: ['id', 'choiceText', 'isCorrect']
          }
        ]
      });

      return {
        EM: "Question added successfully",
        EC: 0,
        DT: createdQuestion,
      };
    } catch (error) {
      console.error("Error adding question:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  // Add multiple questions to a quiz
  addQuestions = async (quizId, questions) => {
    try {
      // Check if the quiz exists
      const quiz = await db.quizzes.findByPk(quizId);
      if (!quiz) {
        return {
          EM: "Quiz not found",
          EC: 1,
          DT: "",
        };
      }

      const createdQuestionIds = [];

      // Use transaction to ensure all questions are added successfully
      await db.sequelize.transaction(async (t) => {
        for (const questionData of questions) {
          // Create question
          const question = await db.questions.create({
            quizId,
            questionText: questionData.questionText,
            questionType: questionData.questionType
          }, { transaction: t });

          // For multiple-choice questions, add choices
          if (questionData.questionType === 'multiple-choice' && 
              questionData.choices && 
              questionData.choices.length > 0) {
            
            const choicesWithQuestionId = questionData.choices.map(choice => ({
              questionId: question.id,
              choiceText: choice.text,
              isCorrect: choice.isCorrect
            }));

            await db.choices.bulkCreate(choicesWithQuestionId, { transaction: t });
          }

          createdQuestionIds.push(question.id);
        }
      });

      // Fetch the complete questions with their choices after the transaction is complete
      const createdQuestions = await db.questions.findAll({
        where: {
          id: createdQuestionIds
        },
        include: [
          {
            model: db.choices,
            attributes: ['id', 'choiceText', 'isCorrect']
          }
        ],
        raw : false,
        nest : true,
        order: [['id', 'ASC']]
      });

      return {
        EM: `${createdQuestions.length} questions added successfully`,
        EC: 0,
        DT: createdQuestions,
      };
    } catch (error) {
      console.error("Error adding questions:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  // Get all quizzes created by an employer
  getQuizzesByEmployer = async (employerId) => {
    try {
      const quizzes = await db.quizzes.findAll({
        where: { employerId },
        include: [
          {
            model: db.questions,
            attributes: ['id', 'questionText', 'questionType'],
            include: [
              {
                model: db.choices,
                attributes: ['id', 'choiceText', 'isCorrect']
              }
            ]
          }
        ],
        raw: false,
        nest: true,
        order: [['createdAt', 'DESC']]
      });

      return {
        EM: "Quizzes retrieved successfully",
        EC: 0,
        DT: quizzes,
      };
    } catch (error) {
      console.error("Error retrieving quizzes:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  // Get detailed information about a quiz
  getQuizDetails = async (quizId) => {
    try {
      const quiz = await db.quizzes.findByPk(quizId, {
        include: [
          {
            model: db.questions,
            attributes: ['id', 'questionText', 'questionType'],
            include: [
              {
                model: db.choices,
                attributes: ['id', 'choiceText', 'isCorrect']
              }
            ],
            raw: false,
            nest: true
          },
          {
            model: db.employers,
            attributes: ['id', 'companyName']
          }
        ],
        raw: false,
        nest: true
      });

      if (!quiz) {
        return {
          EM: "Quiz not found",
          EC: 1,
          DT: "",
        };
      }

      return {
        EM: "Quiz details retrieved successfully",
        EC: 0,
        DT: quiz,
      };
    } catch (error) {
      console.error("Error retrieving quiz details:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  // Assign quiz to employees
  assignQuiz = async (quizId, employeeIds, dueDate = null) => {
    try {
      // Check if quiz exists
      const quiz = await db.quizzes.findByPk(quizId);
      if (!quiz) {
        return {
          EM: "Quiz not found",
          EC: 1,
          DT: "",
        };
      }
      // Create assignments
      const assignments = [];
      for (const employeeId of employeeIds) {
        // Check if employee exists
        console.log("Fetching employee with ID:", employeeId);
        const employee = await db.employees.findByPk(employeeId, {
          include: [
            {
                model: db.users,
                attributes: ['email'],
            },
        ],
        nest: true,
        raw: false
        });
        if (!employee ) {
          continue;
        }
        const existingAssignment = await db.quizAssignments.findOne({
            where: { quizId, employeeId },
            raw: false,
            nest: true
        });

        if (existingAssignment) {
          continue; // Skip if already assigned
        }

        // Create new assignment
        const assignment = await db.quizAssignments.create({
          quizId,
          employeeId,
          dueDate,
          status: 'assigned'
        });

        assignments.push(assignment);

        // Send email notification to employee
        if (employee.user && employee.user.email) {
          try {
            await EmailService.sendEmail(
              employee.user.email,
              'New Quiz Assignment',
              `You have been assigned a new quiz: "${quiz.title}". Please complete it by ${dueDate ? new Date(dueDate).toLocaleDateString() : 'as soon as possible'}.`
            );
          } catch (emailError) {
            console.error("Error sending email notification:", emailError);
          }
        }
      }

      return {
        EM: `Quiz assigned to ${assignments.length} employees`,
        EC: 0,
        DT: assignments,
      };
    } catch (error) {
      console.error("Error assigning quiz:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  // Get all quizzes assigned to an employee
  getAssignedQuizzes = async (employeeId) => {
    try {
      const assignments = await db.quizAssignments.findAll({
        where: { employeeId },
        include: [
          {
            model: db.quizzes,
            include: [
              {
                model: db.employers,
                attributes: ['id', 'companyName']
              }
            ],
            raw: false,
            nest: true
          }
        ],
        raw: false,
        nest: true,
        order: [['createdAt', 'DESC']]
      });

      return {
        EM: "Assigned quizzes retrieved successfully",
        EC: 0,
        DT: assignments,
      };
    } catch (error) {
      console.error("Error retrieving assigned quizzes:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  // Get a specific quiz assignment with questions
  getQuizAssignment = async (assignmentId, employeeId) => {
    try {
      const assignment = await db.quizAssignments.findOne({
        where: { 
          id: assignmentId,
          employeeId
        },
        include: [
          {
            model: db.quizzes,
            include: [
              {
                model: db.questions,
                attributes: ['id', 'questionText', 'questionType'],
                include: [
                  {
                    model: db.choices,
                    attributes: ['id', 'choiceText']
                  }
                ]
              },
              {
                model: db.employers,
                attributes: ['companyName']
              }
            ]
          }
        ]
      });

      if (!assignment) {
        return {
          EM: "Assignment not found or not authorized",
          EC: 1,
          DT: "",
        };
      }

      // Update assignment status if it's the first time viewing
      if (assignment.status === 'assigned') {
        assignment.status = 'in_progress';
        assignment.startedAt = new Date();
        await assignment.save();
      }

      return {
        EM: "Quiz assignment retrieved successfully",
        EC: 0,
        DT: assignment,
      };
    } catch (error) {
      console.error("Error retrieving quiz assignment:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  // Submit quiz answers
  submitQuizAnswers = async (quizId, employeeId, answers) => {
    console.log("Submitting answers for assignment ID:", assignmentId, "by employee ID:", employeeId);
    try {
      // Find the assignment
      const assignment = await db.quizAssignments.findOne({
        where: { 
          quizId,
          employeeId
        },
        include: [
          {
            model: db.quizzes,
            include: [
              {
                model: db.questions,
                include: [
                  {
                    model: db.choices
                  }
                ],
                raw: false,
                nest: true
              }
            ],
            raw: false,
            nest: true
          }
        ],
        raw: false,
        nest: true
      });

      if (!assignment) {
        return {
          EM: "Assignment not found or not authorized",
          EC: 1,
          DT: "",
        };
      }

      // Process and store answers
      let totalCorrect = 0;
      let totalQuestions = assignment.quiz.questions.length;
      
      const processedAnswers = [];

      // Use transaction to ensure all answers are saved
      await db.sequelize.transaction(async (t) => {
        for (const answer of answers) {
          const question = assignment.quiz.questions.find(q => q.id === answer.questionId);
          if (!question) continue;

          if (question.questionType === 'multiple-choice') {
            // For multiple-choice questions
            const selectedChoice = question.choices.find(c => c.id === answer.choiceId);
            if (!selectedChoice) continue;

            const isCorrect = selectedChoice.isCorrect;
            const score = isCorrect ? 100 : 0;

            await db.quizAnswers.create({
              quizAssignmentId: assignmentId,
              questionId: question.id,
              choiceId: selectedChoice.id,
              isCorrect,
              score
            }, { transaction: t });

            if (isCorrect) {
              totalCorrect++;
            }
            
            processedAnswers.push({
              questionId: question.id,
              isCorrect,
              score
            });
          } else if (question.questionType === 'essay') {
            // For essay questions, use Gemini API
            const evaluation = await evaluateEssayAnswer(
              question.questionText,
              answer.essayAnswer
            );

            // Store both the answer and the Gemini evaluation
            await db.quizAnswers.create({
              quizAssignmentId: assignmentId,
              questionId: question.id,
              essayAnswer: answer.essayAnswer,
              isCorrect: evaluation.isCorrect,
              score: evaluation.score,
              feedback: evaluation.feedback
            }, { transaction: t });

            if (evaluation.isCorrect) {
              totalCorrect++;
            }
            
            processedAnswers.push({
              questionId: question.id,
              isCorrect: evaluation.isCorrect,
              score: evaluation.score,
              feedback: evaluation.feedback
            });
          }
        }

        // Calculate percentage score
        const percentageScore = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

        // Update assignment status
        assignment.status = 'completed';
        assignment.completedAt = new Date();
        await assignment.save({ transaction: t });
      });

      return {
        EM: "Quiz submitted successfully",
        EC: 0,
        DT: {
          correctAnswers: totalCorrect,
          totalQuestions: totalQuestions,
          percentageScore: (totalCorrect / totalQuestions) * 100,
          answers: processedAnswers
        },
      };
    } catch (error) {
      console.error("Error submitting quiz answers:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  // Get quiz results for an employer
  getQuizResults = async (quizId, employerId) => {
    try {
      // Check if the quiz belongs to the employer
      const quiz = await db.quizzes.findOne({
        where: {
          id: quizId,
          employerId
        }
      });

      if (!quiz) {
        return {
          EM: "Quiz not found or not authorized",
          EC: 1,
          DT: "",
        };
      }

      // Get all assignments for this quiz
      const assignments = await db.quizAssignments.findAll({
        where: { quizId },
        include: [
          {
            model: db.employees,
            include: [
              {
                model: db.users,
                attributes: ['email', 'fullName', 'image']
              }
            ],
            raw: false,
            nest: true
          },
          {
            model: db.quizAnswers,
            include: [
              {
                model: db.questions,
                attributes: ['questionText', 'questionType']
              },
              {
                model: db.choices,
                attributes: ['choiceText']
              }
            ],
            raw: false,
            nest: true
          }
        ],
        order: [['completedAt', 'DESC']]
      });

      // Process assignments to include score calculations
      const results = assignments.map(assignment => {
        const plainAssignment = assignment.get({ plain: true });
        
        // Calculate total correct answers and completion percentage
        if (plainAssignment.quizAnswers && plainAssignment.quizAnswers.length > 0) {
          const correctAnswers = plainAssignment.quizAnswers.filter(answer => answer.isCorrect).length;
          const totalQuestions = plainAssignment.quizAnswers.length;
          plainAssignment.correctAnswers = correctAnswers;
          plainAssignment.totalQuestions = totalQuestions;
          plainAssignment.percentageScore = (correctAnswers / totalQuestions) * 100;
          plainAssignment.scoreDisplay = `${correctAnswers}/${totalQuestions}`;
        } else {
          plainAssignment.correctAnswers = 0;
          plainAssignment.totalQuestions = 0;
          plainAssignment.percentageScore = 0;
          plainAssignment.scoreDisplay = "0/0";
        }
        
        return plainAssignment;
      });

      return {
        EM: "Quiz results retrieved successfully",
        EC: 0,
        DT: results,
      };
    } catch (error) {
      console.error("Error retrieving quiz results:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  // Get a specific quiz result
  getQuizResultDetails = async (assignmentId, userRole, userId) => {
    try {
      let assignment;
      
      if (userRole === 'employer') {
        // Employer viewing a result - check if they own the quiz
        assignment = await db.quizAssignments.findByPk(assignmentId, {
          include: [
            {
              model: db.quizzes,
              where: { employerId: userId },
              include: [
                { model: db.employers, attributes: ['companyName'] }
              ],
                raw: false,
                nest: true
            },
            {
              model: db.employees,
              include: [
                { model: db.users, attributes: ['fullName', 'email', 'image'] }
              ],
                raw: false,
                nest: true
            },
            {
              model: db.quizAnswers,
              include: [
                { model: db.questions, attributes: ['questionText', 'questionType'] },
                { model: db.choices, attributes: ['choiceText'] }
              ],
                raw: false,
                nest: true
            }
          ]
        });
      } else {
        // Employee viewing their own result
        const employee = await db.employees.findOne({
          where: { userId }
        });

        if (!employee) {
          return {
            EM: "Employee profile not found",
            EC: 1,
            DT: "",
          };
        }

        assignment = await db.quizAssignments.findOne({
          where: {
            id: assignmentId,
            employeeId: employee.id
          },
          include: [
            {
              model: db.quizzes,
              include: [
                { model: db.employers, attributes: ['companyName'] }
              ],
                raw: false,
                nest: true
            },
            {
              model: db.quizAnswers,
              include: [
                { model: db.questions, attributes: ['questionText', 'questionType'] },
                { model: db.choices, attributes: ['choiceText'] }
              ],
                raw: false,
                nest: true
            }
          ],
            raw: false,
            nest: true
        });
      }

      if (!assignment) {
        return {
          EM: "Quiz result not found or not authorized",
          EC: 1,
          DT: "",
        };
      }

      // Calculate score and format results
      const plainAssignment = assignment.get({ plain: true });
      
      if (plainAssignment.quizAnswers && plainAssignment.quizAnswers.length > 0) {
        const correctAnswers = plainAssignment.quizAnswers.filter(answer => answer.isCorrect).length;
        const totalQuestions = plainAssignment.quizAnswers.length;
        plainAssignment.correctAnswers = correctAnswers;
        plainAssignment.totalQuestions = totalQuestions;
        plainAssignment.percentageScore = (correctAnswers / totalQuestions) * 100;
        plainAssignment.scoreDisplay = `${correctAnswers}/${totalQuestions}`;
        
        // Include Gemini feedback for essay questions
        plainAssignment.quizAnswers = plainAssignment.quizAnswers.map(answer => {
          if (answer.essayAnswer) {
            answer.displayScore = answer.isCorrect ? "Correct" : "Incorrect";
            // Feedback from Gemini is already stored in the database
          } else {
            answer.displayScore = answer.isCorrect ? "Correct" : "Incorrect";
          }
          return answer;
        });
      } else {
        plainAssignment.correctAnswers = 0;
        plainAssignment.totalQuestions = 0;
        plainAssignment.percentageScore = 0;
        plainAssignment.scoreDisplay = "0/0";
      }

      return {
        EM: "Quiz result details retrieved successfully",
        EC: 0,
        DT: plainAssignment,
      };
    } catch (error) {
      console.error("Error retrieving quiz result details:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  getEmployeeQuizResults = async (quizId, employerId) => {
    try {
    const quiz = await db.Quiz.findOne({
        where: {
          id: quizId,
          employerId: employerId
        }
    });

    if (!quiz) {
    return {
        EM: "Quiz not found or you don't have permission to access it",
        EC: -1,
        DT: []
    };
    }

      // Find all assignments for this quiz with their results
    const quizAssignments = await db.QuizAssignment.findAll({
    where: {
        quizId: quizId
    },
    include: [
        {
        model: db.User,
        as: 'employee',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'avatar']
        },
        {
        model: db.QuizResult,
        as: 'quizResult',
        attributes: ['id', 'totalScore', 'submittedAt', 'status']
        }
    ],
    raw: false,
    nest: true,
    order: [
        ['createdAt', 'DESC']
    ]
    });

      return{
        EM: "Get employee quiz results successfully",
        EC: 0,
        DT: quizAssignments
      };
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        EM: "Error from server",
        EC: -1,
        DT: error.message
      });
    }
  };
}

module.exports = new QuizService();
