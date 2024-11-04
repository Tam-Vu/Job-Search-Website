import { routes } from "@/config"
import { Company } from "@/pages/main-layout/Company"
import { Home } from "@/pages/main-layout/Home"
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
]
const protectedRoutes = [
  {
    path: routes.Chat,
    component: <Chat></Chat>,
  },
]
export { publicRoutes, protectedRoutes }
