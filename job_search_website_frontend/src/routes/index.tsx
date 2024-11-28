import { AuthorizedEmployer } from "@/components/Layout/Components/Authenticate/authenticate"
import { routes } from "@/config"
import { LoginForm } from "@/pages/auth-layout/LoginUser"
import { SignupForm } from "@/pages/auth-layout/Register"
import { RegisterCompanyForm } from "@/pages/auth-layout/RegisterCompany"
import { Company } from "@/pages/main-layout/Company"
import { Home } from "@/pages/main-layout/Home"
import { Job } from "@/pages/main-layout/Job"
import { FindJob } from "@/pages/main-layout/Job/FindJob/findJob"
import { RecruiterHome } from "@/pages/protected-route/Home"
import { Recruitment } from "@/pages/protected-route/Recruitment"
const publicRoutes = [
  {
    path: routes.Home,
    component: <Home></Home>,
  },
  {
    path: routes.Company,
    component: <Company></Company>,
  },
  {
    path: routes.Job,
    component: <Job></Job>,
  },
  {
    path: routes.FindJob,
    component: <FindJob></FindJob>,
  },
]
const protectedRoutes = [
  {
    path: routes.RecruiterHome,
    component: (
      <AuthorizedEmployer>
        <RecruiterHome></RecruiterHome>
      </AuthorizedEmployer>
    ),
  },
  {
    path: routes.RecruitManagement,
    component: (
      <AuthorizedEmployer>
        <Recruitment></Recruitment>
      </AuthorizedEmployer>
    ),
  },
]
const authRoutes = [
  {
    path: routes.RegisterForUser,
    component: <SignupForm></SignupForm>,
  },
  {
    path: routes.login,
    component: <LoginForm></LoginForm>,
  },
  {
    path: routes.RegisterForCompany,
    component: <RegisterCompanyForm></RegisterCompanyForm>,
  },
]
export { publicRoutes, protectedRoutes, authRoutes }
