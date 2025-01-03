import { httpClient } from "@/services"
import { Response } from "@/type"
import { User } from "@/type/auth"

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

export interface getMeRes extends Response {
  DT: User
}

interface UpdateUser {
  file: File | null
  email: string
  fullName: string
  image: string | null
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

  async currentUser() {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await httpClient.get<getMeRes>("/user/me")
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async updateUser(data: UpdateUser) {
    // eslint-disable-next-line no-useless-catch
    const formData = new FormData()
    if (data.file) formData.append("file", data.file)
    formData.append("email", data.email)
    formData.append("fullName", data.fullName)
    if (data.image) formData.append("image", data.image)
    try {
      const res = await httpClient.put<getMeRes>("/user/update-user", formData)
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
