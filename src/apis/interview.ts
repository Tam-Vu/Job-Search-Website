import { httpClient } from "@/services"
import { Response } from "@/type"
import company from "@/type/company"

interface getSingleCompanyRes extends Response {
  DT: company
}

interface ApplicationDTO {
  location: string
  date: string
  time: string
}

export interface Interview {
  id: number
  location: string
  date: string
  time: string
  status: string
  applicationId: number
  application: {
    id: number
    job: {
      id: number
      title: string
    }
    resume: {
      id: number
      name: string
      employee: {
        fullName: string
      }
    }
  }
}

interface getMyInterView extends Response {
  DT: Interview[]
}

class InterviewApi {
  constructor() {
    // httpClient.createAuthRefreshInterceptor(() => {
    //   this.logOut()
    //   window.location.href = AUTH_PATH_NAME.DANG_NHAP
    // })
  }

  async createInterview(data: ApplicationDTO, applicationId: number) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.post<getSingleCompanyRes>(`/interview-schedule/create/${applicationId}`, data)
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async getMyInterview() {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<getMyInterView>(`/interview-schedule/my-interview-recuiter`)
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async completeInterview(id: string) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.patch<getMyInterView>(`/interview-schedule/complete/${id}`)
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async cancelInterview(id: string) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.patch<getMyInterView>(`/interview-schedule/cancel/${id}`)
      return res
    } catch (error) {
      console.log(error)
    }
  }
}

const interviewApi = new InterviewApi()

export default interviewApi
