import { httpClient } from "@/services"
import { Response } from "@/type"
import jobs, { CreateJobs } from "@/type/jobs"

interface jobRes extends Response {
  DT: jobs[]
}

interface getSingleJobRes extends Response {
  DT: jobs
}

class JobApi {
  constructor() {
    // httpClient.createAuthRefreshInterceptor(() => {
    //   this.logOut()
    //   window.location.href = AUTH_PATH_NAME.DANG_NHAP
    // })
  }

  async getAllJob() {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<jobRes>("/jobs/get-all-legal-job")
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async getJobByEmployerId(id: number) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<jobRes>(`/jobs/employer/${id}`)
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async getJobById(id: number) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<getSingleJobRes>(`/jobs/single-job/${id}`)
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async createJob(data: CreateJobs) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.post<jobRes>("/jobs/create-job", data)
      return res
    } catch (error) {
      console.log(error)
    }
  }
}

const jobApi = new JobApi()

export default jobApi
