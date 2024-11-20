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
