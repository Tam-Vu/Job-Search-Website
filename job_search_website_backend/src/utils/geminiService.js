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
        Với vai trò là người đánh giá khách quan, hãy phân tích câu trả lời này cho câu hỏi sau:

        Phân tích đánh giá
        Câu hỏi: ${question}

        Trả lời: ${answer}

        Hãy đánh giá câu trả lời dựa trên các tiêu chí sau:

        1. Accuracy of information (Độ chính xác của thông tin)
        2. Completeness of response (Mức độ đầy đủ của câu trả lời)
        3. Clarity and organization (Sự rõ ràng và cách tổ chức)
        Vui lòng trả về đánh giá của bạn dưới dạng JSON với các trường sau:

        isRelevant: boolean (Đánh dấu dựa trên nội dung của câu trả lời. Nếu câu trả lời có một ý đúng trong đó, ngay cả khi các ý còn lại sai, thì vẫn là true. Nếu chỉ có một ý đúng, thì là true. Nếu không có ý nào đúng, thì là false. Ví dụ: nếu câu hỏi là "NodeJS là gì?" và câu trả lời là "NodeJS là một frontend library", thì là false mặc dù câu trả lời đề cập lại câu hỏi nhưng toàn bộ nội dung không có ý đúng nào nên hoàn toàn sai.)
        score: number (điểm từ 0-100)
        feedback: string (phản hồi mang tính xây dựng về câu trả lời)
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
