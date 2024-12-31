export interface reduxState {
  state: {
    user: string
  }
}

export interface FilterWithKeyAndName {
  key: string
  name: string
}

export interface Filter {
  key: string
  label: string
  value: number
}

export type Response = {
  EM: string
  EC: number
}

export interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  animate: boolean
}
