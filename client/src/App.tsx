import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Announcements from "./pages/Announcements";
import Templates from "./pages/Templates";
import Submit from "./pages/Submit";
import Submissions from "./pages/Submissions";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminConfig from "./pages/admin/AdminConfig";
import AdminLogs from "./pages/admin/AdminLogs";

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* Dashboard utilisateur */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/annonces" component={Announcements} />
      <Route path="/dashboard/annonces/nouveau" component={Announcements} />
      <Route path="/dashboard/templates" component={Templates} />
      <Route path="/dashboard/templates/nouveau" component={Templates} />
      <Route path="/dashboard/deposer" component={Submit} />
      <Route path="/dashboard/soumissions" component={Submissions} />

      {/* Admin */}
      <Route path="/admin/utilisateurs" component={AdminUsers} />
      <Route path="/admin/configuration" component={AdminConfig} />
      <Route path="/admin/logs" component={AdminLogs} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
