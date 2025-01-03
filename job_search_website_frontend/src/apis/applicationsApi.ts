import { httpClient } from "@/services"
import { Response } from "@/type"
import { UpdateData } from "./resume"

interface createApplicationRes extends Response {
  DT: ""
}

interface applicationResume extends UpdateData {
  resumeSkills: number[]
  experience: string
  employee: {
    id: number
    fullName: string
    userId: number
    user: {
      email: string
      image: string
    }
  }
}

export interface getApplicationByJobIdRes extends Response {
  DT: {
    id: number
    resumeId: number
    jobId: number
    status: string
    resume: applicationResume
  }[]
}

export interface getApplicationByJob {
  id: number
  resumeId: number
  jobId: number
  status: string
  resume: applicationResume
}

export interface getApplicationAcceptedByJobId {
  DT: {
    id: number
    resumeId: number
    jobId: number
    status: string
    resume: applicationResume
    job: {
      title: string
      id: number
      employer: {
        id: number
        companyName: string
        field: string
      }
    }
  }[]
}

export interface getApplicationAcceptedByJobIdRes {
  id: number
  resumeId: number
  jobId: number
  status: string
  resume: applicationResume
  job: {
    title: string
    id: number
    employer: {
      id: number
      companyName: string
      field: string
    }
  }
}

class ApplicationApi {
  constructor() {
    // httpClient.createAuthRefreshInterceptor(() => {
    //   this.logOut()
    //   window.location.href = AUTH_PATH_NAME.DANG_NHAP
    // })
  }

  async createApplication(resumeId: number, id: number) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.post<createApplicationRes>(`/applications/apply/${id}`, { resumeId })
      return res
    } catch (error) {
      console.log(error)
    }
  }
  async getApplicationByJobId(id: number) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<getApplicationByJobIdRes>(`/applications/${id}`)
      return res
    } catch (error) {
      console.log(error)
    }
  }
  async getAllApplicationAccepted() {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<getApplicationAcceptedByJobId>(`/applications/accepted`)
      return res
    } catch (error) {
      console.log(error)
    }
  }
  async getMyApplication() {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<getApplicationAcceptedByJobId>(`/applications/my-applications`)
      return res
    } catch (error) {
      console.log(error)
    }
  }
  async approveApplication(id: number) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.patch<createApplicationRes>(`/applications/approve/${id}`)
      return res
    } catch (error) {
      console.log(error)
    }
  }
  async rejectApplication(id: number) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.patch<createApplicationRes>(`/applications/reject/${id}`)
      return res
    } catch (error) {
      console.log(error)
    }
  }
}

const applicationApi = new ApplicationApi()

export default applicationApi
