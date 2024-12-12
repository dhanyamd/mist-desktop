import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import './App.css'
import { Toaster } from "sonner"
import ControlLayer from "./layouts/ControlLayer"

const client = new QueryClient()

function App() {
  return <QueryClientProvider client={client}>
    <ControlLayer>
      <AuthButton/>
    </ControlLayer>
  <Toaster/>
  </QueryClientProvider>
}
export default App