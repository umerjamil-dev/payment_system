import { Router } from "./Router"
import { CRMProvider } from "./Context/CRMContext"

const App = () => {
  return (
    <CRMProvider>
      <Router />
    </CRMProvider>
  )
}
export default App