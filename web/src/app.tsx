import { ListRoutes } from "./routes";
import { ThemeProvider } from "@/components/ui/theme-provider"
import { BrowserRouter } from "react-router-dom";

export default function App() {
  return (
    <main>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <ListRoutes/>
        </BrowserRouter>
      </ThemeProvider>
    </main>
  )
}