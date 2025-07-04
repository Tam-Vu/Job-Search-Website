import { httpClient } from "@/services"

interface User {
  EM: string
  EC: number
  DT: {
    id: string
    username: string
  }[]
}
interface Employer {
  EM: string
  EC: number
  DT: {
    id: string
    companyName: string
    userId: number
  }[]
}

class UserApi {
  constructor() {
    // httpClient.createAuthRefreshInterceptor(() => {
    //   this.logOut()
    //   window.location.href = AUTH_PATH_NAME.DANG_NHAP
    // })
  }

  async getAllUser() {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<User>("/user")
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async getAllEmployer() {
    try {
      const res = await httpClient.get<Employer>("/employers")
      return res
    } catch (error) {
      console.log(error)
    }
  }
}

const userApi = new UserApi()

export default userApi
