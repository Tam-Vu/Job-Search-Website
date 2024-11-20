import { RegisterUserDTO, RegisterUser } from "@/apis/authApi"
import { httpClient } from "@/services"
import { ResSignIn, SignInPayload } from "@/type/auth"

export interface RegisterCompanyDTO {
  confirmPassword: string
  email: string
  password: string
  companyName: string
  companyDescription: string
  location: string
  website: string | undefined
  field: string
}

export interface RegisterCompnay {
  EM: string
  EC: number
  DT: {
    id: number
    role: number
    companyName: string
    companyDescription: string
    location: string
    website: string
    userId: number
  }
}

class AuthApi {
  constructor() {}

  async RegisterUser(signUpData: RegisterUserDTO) {
    try {
      const res = await httpClient.post<RegisterUser>("/register-user", signUpData)
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async RegisterCompany(signUpData: RegisterCompanyDTO) {
    try {
      const res = await httpClient.post<RegisterCompnay>("/register-employer", signUpData)
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async signIn(data: SignInPayload) {
    try {
      const res = await httpClient.post<ResSignIn>("/login", data)
      return res
    } catch (error) {
      console.log(error)
    }
  }
  async signUp() {
    try {
      const res = await httpClient.post("/auth/logout")
      return res
    } catch (error) {
      console.log(error)
    }
  }
  async signOut() {
    try {
      const res = await httpClient.delete("/auth/sign-out")
      return res
    } catch (error) {
      console.log(error)
    }
  }
  async confirmSignUp() {}
  async forgotPassword() {}
  async confirmForgotPassword() {}
  // async refreshToken() {
  //   try {
  //     const res = await httpClient.post<{ data: { accessToken: string } }>("/auth/refresh-token")
  //     return { accessToken: res.data.accessToken }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  async OAuthCallBack() {}
}
const authApi = new AuthApi()
export default authApi
