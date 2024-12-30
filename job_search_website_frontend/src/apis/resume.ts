import { httpClient } from "@/services"
import { Response } from "@/type"
import { Resume } from "@/type/resume"

interface ResumeCreate {
  name: string
  field: string
}

interface ResumeGet extends Response {
  DT: Resume[]
}

interface ResumeByIdGet extends Response {
  DT: Resume
}

interface experienceDetail {
  companyName: string
  startMonth: number
  startYear: number
  endMonth: number
  endYear: number
  description: string
}

interface educationDetail {
  university: string
  startYear: number
  endYear: number
  degree: string
}

export interface UpdateData {
  name: string
  description: string
  skills: number[]
  experienceDetails: experienceDetail[]
  educations: educationDetail[]
}

interface Skill {
  id: number
  name: string
}

interface SkillGet extends Response {
  DT: Skill[]
}

interface getUpdateData extends Response {
  DT: UpdateData
}

class ResumeApi {
  constructor() {
    // httpClient.createAuthRefreshInterceptor(() => {
    //   this.logOut()
    //   window.location.href = AUTH_PATH_NAME.DANG_NHAP
    // })
  }

  async createResume(data: ResumeCreate) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.post<Response>("/resume/create-resume", data)
      return res
    } catch (error) {
      console.log(error)
    }
  }
  async getResumeByEmployee() {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<ResumeGet>("/resumes/all-my-resume")
      return res
    } catch (error) {
      console.log(error)
    }
  }
  async getResumeById(id: string) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<ResumeByIdGet>(`/resumes/details/${id}`)
      return res
    } catch (error) {
      console.log(error)
    }
  }
  async getAllSKill() {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<SkillGet>("skills/get-all-skills")
      return res
    } catch (error) {
      console.log(error)
    }
  }
  async updateResume(data: UpdateData, id: string) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.put<getUpdateData>(`/resumes/update/${id}`, data)
      return res
    } catch (error) {
      console.log(error)
    }
  }
}

const resumeApi = new ResumeApi()

export default resumeApi
