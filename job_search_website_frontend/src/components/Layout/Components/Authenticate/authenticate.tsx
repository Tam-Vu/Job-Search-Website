import { Navigate } from "react-router-dom"

export const AuthorizedEmployer = function ({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("accessToken")
  const role = localStorage.getItem("role")
  if (role !== "employer") {
    return <Navigate to={"/login"} replace={true}></Navigate>
  } else if (token && role == "employer") return children
}

// export const LoggedAdmin = function ({ children }) {
//   const token = localStorage.getItem("accessToken")
//   const role = localStorage.getItem("role")
//   if (token && role === "ADMIN") {
//     return <Navigate to={"/"} replace={true}></Navigate>
//   } else if (token && role === "Administrator") {
//     return <Navigate to={"/Administrator-notification"} replace={true}></Navigate>
//   }
//   return children
// }
