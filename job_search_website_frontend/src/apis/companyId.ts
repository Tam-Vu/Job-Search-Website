import { httpClient } from "@/services"
import { Response } from "@/type"
import company from "@/type/company"

interface companyRes extends Response {
  DT: company[]
}

interface getSingleCompanyRes extends Response {
  DT: company
}

class CompanyApi {
  constructor() {
    // httpClient.createAuthRefreshInterceptor(() => {
    //   this.logOut()
    //   window.location.href = AUTH_PATH_NAME.DANG_NHAP
    // })
  }

  async getAllCompany() {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<companyRes>("/employers")
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

const companyApi = new CompanyApi()

export default companyApi
