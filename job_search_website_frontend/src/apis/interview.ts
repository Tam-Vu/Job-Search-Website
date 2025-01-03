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

  async getCompanyById(id: number) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<getSingleCompanyRes>(`/employers/${id}`)
      return res
    } catch (error) {
      console.log(error)
    }
  }
}

const interviewApi = new InterviewApi()

export default interviewApi
