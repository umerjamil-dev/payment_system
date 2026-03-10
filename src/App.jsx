import { Router } from "./Router"
import { CRMProvider } from "./Context/CRMContext"
import { AuthProvider } from "./Context/AuthContext"

const App = () => {
  return (
    <AuthProvider>
      <CRMProvider>
        <Router />
      </CRMProvider>
    </AuthProvider>
  )
}
export default App