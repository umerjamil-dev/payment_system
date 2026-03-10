import { Router } from "./Router"
import { CRMProvider } from "./Context/CRMContext"
import { AuthProvider } from "./Context/AuthContext"
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <AuthProvider>
      <CRMProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Router />
      </CRMProvider>
    </AuthProvider>
  )
}
export default App