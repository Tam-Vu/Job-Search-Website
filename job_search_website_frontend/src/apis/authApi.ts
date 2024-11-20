import { httpClient } from "@/services"

interface Login {
  EM: string
  EC: number
  DT: {
    payload: {
      id: number
      username: string
    }
    token: string
  }
}

export interface RegisterUser {
  EM: string
  EC: number
  DT: {
    id: number
    role: number
  }
}

export interface RegisterUserDTO {
  email: string
  fullname: string
  password: string
  confirmPassword: string
}

class AuthApi {
  constructor() {
    // httpClient.createAuthRefreshInterceptor(() => {
    //   this.logOut()
    //   window.location.href = AUTH_PATH_NAME.DANG_NHAP
    // })
  }

  async RegisterUser(signUpData: RegisterUserDTO) {
    try {
      const res = await httpClient.post<RegisterUser>("/register-user", {
        signUpData,
      })
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async logIn(username: string) {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.post<Login>("/login", {
        username,
      })
      console.log("LoginRes", res)
      localStorage.setItem("userId", res.DT.payload.id.toString())
      localStorage.setItem("username", res.DT.payload.username)
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async logOut() {
    try {
      await httpClient.post("/auth/logout")
    } catch (error) {
      console.log(error)
    }
  }
}

const authApi = new AuthApi()

export default authApi
