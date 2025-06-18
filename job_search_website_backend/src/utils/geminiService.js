const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize the API with your API key
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Evaluates an essay answer using Google's Gemini API
 * @param {string} question - The question text
 * @param {string} answer - The provided essay answer
 * @returns {Promise<Object>} Evaluation result including score and feedback
 */
const evaluateEssayAnswer = async (question, answer) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      As an objective evaluator, please analyze this answer to the following question:
      
      Question: ${question}
      
      Answer: ${answer}
      
      Evaluate the answer based on:
      1. Accuracy of information
      2. Completeness of response
      3. Clarity and organization

      Return your evaluation as JSON with the following fields:
      - isRelevant: boolean (Mark according to the content of the answer. If the answer has a correct idea in it and even though the remaining ideas are wrong, it is still true. If only one idea is correct, it is true. If no idea is correct, it is false. For example, if the question is "What is NodeJS?" and the answer is "NodeJs is a frontend library", it is false even though the answer refers back to the question but the whole content has no correct idea so it is completely wrong.)
      - score: number (score from 0-100)
      - feedback: string (constructive feedback about the answer)
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResponse = response.text();

    // Extract JSON from the response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to get proper JSON response from Gemini API');
    }

    const evaluation = JSON.parse(jsonMatch[0]);

    return {
      isCorrect: evaluation.isRelevant,
      score: evaluation.score,
      feedback: evaluation.feedback,
    };
  } catch (error) {
    console.error('Error evaluating essay with Gemini API:', error);
    return {
      isCorrect: false,
      score: 0,
      feedback: 'Error evaluating answer. Please try again later.',
    };
  }
};

module.exports = { evaluateEssayAnswer };
