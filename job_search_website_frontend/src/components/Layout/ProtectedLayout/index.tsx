import { Sidebar, SidebarBody, SidebarLink } from "@/components/shared/ui/Sidebar"
import { useState } from "react"
import { MdOutlineMonitor } from "react-icons/md"
import { FiMessageSquare, FiBarChart } from "react-icons/fi"
import { BiHelpCircle } from "react-icons/bi"
import LOGO from "@/assets/Logo.svg"
import { routes } from "@/config"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  const links = [
    {
      label: "Trang chu",
      href: "#",
      icon: <MdOutlineMonitor className="text-headerIcon h-5 w-5 flex-shrink-0 dark:text-neutral-200" />,
    },
    {
      label: "Quan ly tin tuyen dung",
      href: routes.RecruitManagement,
      icon: <FiMessageSquare className="text-headerIcon h-5 w-5 flex-shrink-0 dark:text-neutral-200" />,
    },
    {
      label: "Quan ly ho so",
      href: "#",
      icon: <FiBarChart className="text-headerIcon h-5 w-5 flex-shrink-0 dark:text-neutral-200" />,
    },
    {
      label: "Dang xuat",
      href: "#",
      icon: <BiHelpCircle className="text-headerIcon h-5 w-5 flex-shrink-0 dark:text-neutral-200" />,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex h-screen max-w-screen-2xl flex-row">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10 bg-white shadow-sideBar">
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
        <div className="flex flex-1 px-[53px] py-4">{children}</div>
      </div>
    </div>
  )
}
