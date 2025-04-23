import useDesigner from "@/hooks/useDesigner"

import FormElementsSidebar from "./FormElements"
import PropertiesFormSidebar from "./PropertiesFormSidebar"

const DesignerSidebar = () => {
  const { selectedElement } = useDesigner()
  return (
    <aside className="flex h-full w-[400px] max-w-[400px] flex-grow flex-col gap-2 overflow-y-auto border-l-2 border-muted bg-background p-4 opacity-90">
      {!selectedElement && <FormElementsSidebar />}
      {selectedElement && <PropertiesFormSidebar />}
    </aside>
  )
}

export default DesignerSidebar
