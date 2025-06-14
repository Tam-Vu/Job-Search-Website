import { Root } from "@radix-ui/react-separator"

import { FormElements } from "@/type/designer"

import SidebarButtonElement from "./SidebarButtonElement"

const FormElementsSidebar = () => {
  return (
    <div>
      <p className="text-black">Giữ và kéo các thành phần</p>
      <Root className="my-2" />
      <div className="grid grid-cols-1 place-items-center gap-6 md:grid-cols-2">
        <p className="col-span-1 my-2 place-self-start text-sm text-black md:col-span-2">Thành phần cơ bản</p>
        <SidebarButtonElement formElement={FormElements.TitleField} />
        <SidebarButtonElement formElement={FormElements.TextField} />
        <SidebarButtonElement formElement={FormElements.DateField} />
        <p className="col-span-1 my-2 place-self-start text-sm text-black md:col-span-2">Thành phần khác</p>
        <SidebarButtonElement formElement={FormElements.CheckBoxField} />
        <SidebarButtonElement formElement={FormElements.SelectField} />
        <SidebarButtonElement formElement={FormElements.RadioGroupField} />
      </div>
    </div>
  )
}

export default FormElementsSidebar
