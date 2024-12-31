import { AuthorizedEmployer } from "@/components/Layout/Components/Authenticate/authenticate"
import { routes } from "@/config"
import { LoginForm } from "@/pages/auth-layout/LoginUser"
import { SignupForm } from "@/pages/auth-layout/Register"
import { RegisterCompanyForm } from "@/pages/auth-layout/RegisterCompany"
import { Company } from "@/pages/main-layout/Company"
import { Home } from "@/pages/main-layout/Home"
import { Job } from "@/pages/main-layout/Job"
import { ManageResume } from "@/pages/main-layout/Resume"
import { ResumeById } from "@/pages/main-layout/Resume/ResumeCard/resumeById"
import { RecruiterHome } from "@/pages/protected-route/Home"
import { Recruitment } from "@/pages/protected-route/Recruitment"
import { RecruitById } from "@/pages/protected-route/Recruitment/RecruitById"
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
    path: routes.ManageResume,
    component: <ManageResume></ManageResume>,
  },
  {
    path: routes.ManageResumeId,
    component: <ResumeById></ResumeById>,
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
  {
    path: routes.RecruitById,
    component: (
      <AuthorizedEmployer>
        <RecruitById></RecruitById>
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
