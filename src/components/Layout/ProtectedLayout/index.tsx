import { Sidebar, SidebarBody, SidebarLink } from "@/components/shared/ui/Sidebar"
import { useState } from "react"
import { FiMessageSquare } from "react-icons/fi"
import { LogOut } from "lucide-react"
import LOGO from "@/assets/Logo.svg"
import { routes } from "@/config"
import { Calendar, File } from "lucide-react"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  const links = [
    {
      label: "Quan ly tin tuyen dung",
      href: routes.RecruitManagement,
      icon: <FiMessageSquare className="text-headerIcon h-5 w-5 flex-shrink-0 dark:text-neutral-200" />,
    },
    {
      label: "Quan ly hồ sơ",
      href: routes.Interview,
      icon: <File className="text-headerIcon h-5 w-5 flex-shrink-0 dark:text-neutral-200" />,
    },
    {
      label: "Quan ly lịch phỏng vấn",
      href: routes.ManageInterview,
      icon: <Calendar className="text-headerIcon h-5 w-5 flex-shrink-0 dark:text-neutral-200" />,
    },
    {
      label: "Dang xuat",
      href: "#",
      icon: <LogOut className="text-headerIcon h-5 w-5 flex-shrink-0 dark:text-neutral-200" />,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex h-full max-w-screen-2xl">
        <div className="min-h-max">
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="h-full gap-10 bg-white shadow-sideBar">
              <div className={`flex flex-1 flex-col overflow-y-auto overflow-x-hidden`}>
                {open ? (
                  <div className="flex flex-shrink-0 items-center">
                    <span className="text-headerIcon text-nowrap text-2xl font-bold text-navTitle">
                      Job Search Website
                    </span>
                  </div>
                ) : (
                  <div className="flex min-h-[32px] items-center">
                    <img src={LOGO} className="h-7 w-7 flex-shrink-0 rounded-full object-cover" />
                  </div>
                )}
                <div className="mt-11 flex flex-1 flex-col gap-2">
                  {links.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                  ))}
                </div>
              </div>
            </SidebarBody>
          </Sidebar>
        </div>
        <div className="flex h-full flex-1 px-[53px] py-4">{children}</div>
      </div>
    </div>
  )
}
