import { NavLink, useNavigate } from "react-router-dom"
import { FaSearch } from "react-icons/fa"
import { FaLaptopCode } from "react-icons/fa"
import { FaLaptop } from "react-icons/fa6"
import { HiOutlineBuildingOffice2 } from "react-icons/hi2"
import { GiStarFormation } from "react-icons/gi"
import { BsFileEarmarkPerson } from "react-icons/bs"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "./shared/navigationMenu"
import ShiningButton from "./shared/shiningButton"
import ArrowButton from "./shared/arrowButton"
import HrButton from "./shared/hrButton"
// import NotificationButton from "./shared/notificationButton"
import { useAuth } from "@/hooks/useAuth"
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/shared/dropdown-menu"
import { Button } from "@/components/shared/Button"
import DefaultUser from "@/assets/DefaultUser.png"
import { LogOut, User } from "lucide-react"
import { routes } from "@/config"
import { useQuery } from "@tanstack/react-query"
import { authApi } from "@/apis"
import S from "./styles.module.css"

export const Navbar = () => {
  const navigate = useNavigate()
  const { isLoggedIn, logOut } = useAuth()
  const id = localStorage.getItem("id")
  const role = localStorage.getItem("role")
  const isUser = id && role === "user"
  const isEmployer = id && role === "employer"

  const getMe = useQuery({
    queryKey: ["getMe"],
    queryFn: () => authApi.currentUser(),
    enabled: isLoggedIn,
  })

  console.log("getMe", getMe.data)

  return (
    <nav className="flex w-full items-center justify-between bg-white px-6 py-[14px]">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-semibold text-black">Việc làm</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="flex h-auto w-[400px] flex-col gap-2 bg-white p-4">
                <NavLink key={0} to="/">
                  <div className="flex w-full items-center rounded-md bg-navContentBg px-[14px] py-[15px] text-sm">
                    <FaSearch size={16} className="text-navTitle" />
                    <span className="ml-4 font-medium text-black hover:text-navTitle">Việc làm phù hợp</span>
                  </div>
                </NavLink>
                <NavLink key={1} to="#">
                  <div className="flex w-full items-center rounded-md bg-navContentBg px-[14px] py-[15px] text-sm">
                    <FaLaptopCode size={20} className="text-navTitle" />
                    <span className="ml-4 font-medium text-black hover:text-navTitle">Việc làm senior</span>
                  </div>
                </NavLink>
                <NavLink key={2} to="#">
                  <div className="flex w-full items-center rounded-md bg-navContentBg px-[14px] py-[15px] text-sm">
                    <FaLaptop size={20} className="text-navTitle" />
                    <span className="ml-4 font-medium text-black hover:text-navTitle">Việc làm IT</span>
                  </div>
                </NavLink>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {!isEmployer && <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-semibold text-black">Hồ sơ & CV</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="flex h-auto w-[400px] flex-col gap-2 bg-white p-4">
                <NavLink key={3} to="/manage-resume">
                  <div className="flex w-full items-center rounded-md bg-navContentBg px-[14px] py-[15px] text-sm">
                    <BsFileEarmarkPerson size={20} className="text-navTitle" />
                    <span className="ml-4 font-medium text-black hover:text-navTitle">Quản lý CV</span>
                  </div>
                </NavLink>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-semibold text-black">Công ty</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="flex h-auto w-[400px] flex-col gap-2 bg-white p-4">
                <NavLink key={6} to="#">
                  <div className="flex w-full items-center rounded-md bg-navContentBg px-[14px] py-[15px] text-sm">
                    <HiOutlineBuildingOffice2 size={20} className="text-navTitle" />
                    <span className="ml-4 font-medium text-black hover:text-navTitle">Danh sách công ty</span>
                  </div>
                </NavLink>
                <NavLink key={7} to="#">
                  <div className="flex w-full items-center rounded-md bg-navContentBg px-[14px] py-[15px] text-sm">
                    <GiStarFormation size={20} className="text-navTitle" />
                    <span className="ml-4 font-medium text-black hover:text-navTitle">Top công ty</span>
                  </div>
                </NavLink>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {!isLoggedIn && (
        <div className="flex items-center gap-2">
          <ArrowButton onClick={() => navigate("/login")} text={"Đăng nhập"} />
          <ShiningButton onClick={() => navigate("/register-user")} label={"Đăng ký"} />
          <HrButton onClick={() => navigate("/register-employer")} label={"Đăng tuyển và tìm hồ sơ"} />
        </div>
      )}
      {isLoggedIn && isUser && !getMe.isLoading && getMe.data?.DT.role === "user" && (
        <div className="flex items-center gap-2">
          {/* <NotificationButton /> */}
          <span className="text-black font-semibold text-base">Chào mừng ứng viên: <span className="font-normal text-navTitle">{getMe.data.DT.employee.fullName}</span></span>
          <DropdownMenu>
            <DropdownMenuTrigger className="m-0 rounded-full border-0 bg-white p-0 outline-none hover:border-0">
              <Button variant="secondary" size="sm" className="m-0 overflow-hidden rounded-full p-0">
                <img className="h-full w-full object-cover" src={getMe.data?.DT.image ?? DefaultUser} />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-black" align="end">
              <DropdownMenuLabel className="flex flex-row items-center">
                <div className="mr-2 aspect-square h-7 w-7 overflow-hidden rounded-full">
                  <img className="h-full w-full object-cover" src={getMe.data?.DT.image ?? DefaultUser} />
                </div>
                <span>{getMe.data?.DT.employee.fullName || ""}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(routes.AccountProfile)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Tài khoản của tôi</span>
                </DropdownMenuItem>
              </>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={logOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {isLoggedIn && isEmployer && !getMe.isLoading && getMe.data?.DT.role === "employer" && (
        <div className="flex items-center gap-2">
          {/* <NotificationButton /> */}
          <span className="text-black font-semibold text-base">Chào mừng nhà tuyển dụng: <span className="font-normal text-navTitle">{getMe.data.DT.email}</span></span>
          <Button className={`${S.animateBtn} rounded-md bg-navTitle text-white font-semibold text-sm`}>Tới trang quản lý</Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="m-0 rounded-full border-0 bg-white p-0 outline-none hover:border-0">
              <Button variant="secondary" size="sm" className="m-0 overflow-hidden rounded-full p-0">
                <img className="h-full w-full object-cover" src={getMe.data?.DT.image ?? DefaultUser} />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-black" align="end">
              <DropdownMenuLabel className="flex flex-row items-center">
                <div className="mr-2 aspect-square h-7 w-7 overflow-hidden rounded-full">
                  <img className="h-full w-full object-cover" src={getMe.data?.DT.image ?? DefaultUser} />
                </div>
                <span>{getMe.data?.DT.employer.companyName || ""}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(routes.AccountProfile)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Tài khoản của tôi</span>
                </DropdownMenuItem>
              </>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={logOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </nav>
  )
}
