import { routes } from "@/config"
import { Company } from "@/pages/main-layout/Company"
import { Home } from "@/pages/main-layout/Home"
import { Job } from "@/pages/main-layout/Job"
import { Chat } from "@/pages/protected-route/chat"
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
]
const protectedRoutes = [
  {
    path: routes.Chat,
    component: <Chat></Chat>,
  },
]
export { publicRoutes, protectedRoutes }
