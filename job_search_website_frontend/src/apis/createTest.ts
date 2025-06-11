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
      text: string
      isCorrect: boolean
    }[]
  }[]
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
      const res = await httpClient.patch<Response>(`/quiz/assignments/${quizId}/submit`, {
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
      const res = await httpClient.get<ListTestDetailRes>(`/quiz/assigned/employee`)
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
}

const createTestApi = new CreateTestApi()

export default createTestApi
