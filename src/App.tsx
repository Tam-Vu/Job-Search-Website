import { BrowserRouter, Routes, Route } from "react-router-dom"
import { protectedRoutes, publicRoutes, authRoutes } from "./routes/index"
import { DefaultLayout } from "./components/Layout"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Fragment } from "react/jsx-runtime"
import ProtectedLayout from "./components/Layout/ProtectedLayout"
import { ToastContainer } from "react-toastify"
const queryClient = new QueryClient()
import "react-toastify/dist/ReactToastify.min.css"
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div id="App">
          <Routes>
            {authRoutes.map((route, index) => {
              const Page = route.component
              const Layout = Fragment
              return <Route key={index} path={route.path} element={<Layout>{Page}</Layout>} />
            })}
            {publicRoutes.map((route, index) => {
              const Page = route.component
              const Layout = DefaultLayout
              return <Route key={index} path={route.path} element={<Layout>{Page}</Layout>} />
            })}
            {protectedRoutes.map((route, index) => {
              const Page = route.component
              const Layout = ProtectedLayout
              // if (route.path === "/profile" || route.path === "/login") {
              //   Layout = ProfileLayout
              // } else if (route.layout) {
              //   Layout = route.layout
              // } else if (route.layout === null) {
              //   Layout = Fragment
              // }
              return <Route key={index} path={route.path} element={<Layout>{Page}</Layout>} />
            })}
          </Routes>
        </div>
      </BrowserRouter>
      <ToastContainer />
    </QueryClientProvider>
  )
}

export default App
