import { httpClient } from "@/services"
import { Response } from "@/type"

interface getSingleCreateTestRes extends Response {
  DT: {
    id: number
    title: string
    description: string
    employerId: number
    createdAt: string
  }
}

export interface AddQuestionDTO {
  questions: {
    questionText: string
    questionType: string
    helperText?: string
    placeholder?: string
    isRequired?: boolean
    choices?: {
      text: string
      isCorrect: boolean
      idFront: string
    }[]
  }[]
}

interface CreateTestDTO {
  title: string
  description: string
}

interface submitAnswerDTO {
  questionId: number
  choiceId?: number
  essayAnswer?: string
}

export interface TestDetail {
  id: number
  title: string
  description: string
  employerId: number
  createdAt: string
  questions: {
    id: number
    questionText: string
    questionType: string
    helperText?: string
    placeholder?: string
    isRequired?: boolean
    choices?: {
      id: number
      choiceText: string
      isCorrect: boolean
      idFront: string
    }[]
  }[]
}

export interface TestAssign {
  id: number
  quizId: number
  employeeId: number
  status: "assigned" | "in_progress" | "completed"
  dueDate: string | null
  startedAt: string | null
  completedAt: string | null
  correctAnswers: number
  totalQuestions: number
  createdAt: string
  updatedAt: string
  quiz: {
    id: number
    title: string
    description: string
    employerId: number
    createdAt: string
    updatedAt: string
    employer: {
      id: number
      companyName: string
    }
  }
}

export interface TestAssignRes extends Response {
  DT: TestAssign[]
}

export interface EmployeeRes extends Response {
  DT: {
    id: number
    fullName: string
    userId: number
    user: {
      email: string
      image: string | null
    }
  }[]
}

export interface TestDetailRes extends Response {
  DT: TestDetail
}

export interface ListTestDetailRes extends Response {
  DT: TestDetail[]
}

interface QuizAnswerResult {
  id: number
  questionText: string
  questionType: string
  helperText?: string
  placeholder?: string
  isRequired?: boolean
  choices?: {
    id: number
    choiceText: string
    isCorrect: boolean
    idFront: string
  }[]
  isCorrect: boolean
  score: number
  feedback?: string
  Answer: {
    choiceId?: number
    essayAnswer?: string
    choiceText?: string
  }
}
export interface QuizResult {
  correctAnswers: number
  totalQuestions: number
  percentageScore: number
  scoreDisplay: string
  detailedResults: QuizAnswerResult[]
}

export interface submitAnswerRes extends Response {
  DT: QuizResult
}

interface AllQuizResult {
  id: number
  quizId: number
  employeeId: number
  status: "assigned" | "in_progress" | "completed" // Enum với các giá trị có thể có
  dueDate: string | null
  startedAt: string | null
  completedAt: string | null
  correctAnswers: number
  totalQuestions: number
  createdAt: string
  updatedAt: string
  employee: {
    id: number
    fullName: string
    createdAt: string
    updatedAt: string
    userId: number
    user: {
      email: string
      fullName: string | null
      image: string | null
    }
  }
  scoreDisplay: string // Format: "X/Y"
  percentageScore: number // Từ 0 đến 100
}

export interface AllQuizResultRes extends Response {
  DT: AllQuizResult[]
}

class CreateTestApi {
  constructor() {
    // httpClient.createAuthRefreshInterceptor(() => {
    //   this.logOut()
    //   window.location.href = AUTH_PATH_NAME.DANG_NHAP
    // })
  }

  async createTest(data: CreateTestDTO) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.post<getSingleCreateTestRes>(`/quiz`, data)
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async addQuestionInTest(data: AddQuestionDTO, quizId: number) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.post<Response>(`/quiz/${quizId}/questions`, data)
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async assignTest(quizId: string, data: number[]) {
    console.log("data", data)
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.post<Response>(`/quiz/${quizId}/assign`, {
        employeeIds: data,
      })
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async submitAnswer(quizId: string, data: submitAnswerDTO[]) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.post<submitAnswerRes>(`/quiz/assignments/${quizId}/submit`, {
        answers: data,
      })
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async getMyTestAsEmployee() {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<TestAssignRes>(`/quiz/assigned/employee`)
      return res
    } catch (error) {
      console.log(error)
    }
  }
  async getMyTestAsEmployer() {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<ListTestDetailRes>(`/quiz/employer`)
      return res
    } catch (error) {
      console.log(error)
    }
  }
  async getTestDetail(quizId: string) {
    // eslint-disable-next-line no-useless-catch
    try {
      console.log("quizId", quizId)
      const res = await httpClient.get<TestDetailRes>(`/quiz/${quizId}`)
      return res
    } catch (error) {
      console.log(error)
    }
  }
  async getEmployeeToAssign() {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<EmployeeRes>(`/quiz/employees-for-assignment`)
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async getAllEmployeeResultByQuizId(quizId: string) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<AllQuizResultRes>(`/quiz/${quizId}/assignments`)
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async inviteMeeting(data: number[]) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.post<AllQuizResultRes>(`/quiz/online-interview`, {
        listOfEmployeeIds: data,
        link: "http://localhost:5173/video-call",
      })
      return res
    } catch (error) {
      console.log(error)
    }
  }
}

const createTestApi = new CreateTestApi()

export default createTestApi
