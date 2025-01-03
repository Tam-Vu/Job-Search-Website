import { Response } from "./index"
export interface SignInPayload {
  email: string
  password: string
}
export interface ResSignIn extends Response {
  EM: string
  EC: number
  DT: string
}

export interface User {
  id: number
  email: string
  image: string | null
  role: string
  employer: {
    id: number
    companyName: string
    companyDescription: string
    location: string
    website: string
    status: string
    field: string
    userId: number
  }
  employee: {
    id: number
    fullName: string
    userId: number
  }
}
