export interface reduxState {
  state: {
    user: string
  }
}

export interface Filter {
  key: string
  name: string
}

export type Response = {
  statusCode: number
  message: string
  data: unknown
}
