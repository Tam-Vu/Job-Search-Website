import { httpClient } from "@/services"
import { Response } from "@/type"

interface createApplicationRes extends Response {
  DT: ""
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
}

const applicationApi = new ApplicationApi()

export default applicationApi
