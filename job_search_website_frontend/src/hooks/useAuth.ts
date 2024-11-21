import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect } from "react"
// import { toast } from "react-toastify"
import { create } from "zustand"
import { queryKeys } from "@/config"
import { jwtDecode } from "jwt-decode"
import { httpClient } from "../services"
import authApi from "@/services/auth.service"

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken: string) => set({ accessToken }),
}))

// Define the state type for the store
type AuthState = {
  accessToken: string | null
  setAccessToken: (accessToken: string) => void
}

export function useAuth() {
  const accessToken = useAuthStore((state: AuthState) => state.accessToken)
  const setAccessToken = useAuthStore((state: AuthState) => state.setAccessToken)

  const queryClient = useQueryClient()

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken") ?? "")
  }, [setAccessToken])
  /* eslint-disable no-extra-boolean-cast */
  useEffect(() => {
    console.log("CHAYVAOUSEFFECTSTORAG", accessToken)
    if (!!accessToken) {
      console.log("CHAYVAOACCESSTOKEN")
      httpClient.setAuthHeader(accessToken)
      localStorage.setItem("accessToken", accessToken)
    }
  }, [accessToken])

  const logIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const loginData = {
        email: email,
        password: password,
      }
      const res = await authApi.signIn(loginData)
      const accessToken = res?.DT ?? ""
      if (accessToken !== "") {
        const decodeToken = jwtDecode<{ payload: { id: number; role: string; employerId?: number } }>(accessToken)
        httpClient.setAuthHeader(accessToken)
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("role", decodeToken.payload.role)
        localStorage.setItem("id", decodeToken.payload.id.toString())
        if (decodeToken.payload.employerId) {
          localStorage.setItem("employerId", decodeToken.payload.employerId.toString())
        }
        setAccessToken(accessToken)
        return res?.EC
      }
      return res?.EC
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const logOut = useCallback(() => {
    console.log("VAOLOGOUT")
    try {
      authApi.signOut()
    } catch (error) {
      localStorage.removeItem("accessToken")
      queryClient.cancelQueries({ queryKey: queryKeys.me.gen(accessToken || "") })
      httpClient.removeAuthHeader()
      setAccessToken("")
    } finally {
      localStorage.removeItem("accessToken")
      localStorage.clear()
      queryClient.cancelQueries({ queryKey: queryKeys.me.gen(accessToken || "") })
      httpClient.removeAuthHeader()
      setAccessToken("")
    }
  }, [accessToken, queryClient, setAccessToken])

  // useEffect(() => {
  //   httpClient.createAuthRefreshInterceptor(
  //     (accessToken) => {
  //       localStorage.setItem("accessToken", accessToken)
  //       httpClient.setAuthHeader(accessToken)
  //       setAccessToken(accessToken)
  //     },
  //     () => {
  //       logOut()
  //       toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại")
  //     },
  //   )
  // }, [logOut, setAccessToken])

  return {
    isLoggedIn: !!accessToken,
    accessToken,
    logIn,
    logOut,
  }
}
