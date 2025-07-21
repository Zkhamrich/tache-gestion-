
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { CalendarProvider } from "@/contexts/CalendarContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { DivisionProvider } from "@/contexts/DivisionContext";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";

// Main Dashboard (redirects based on role)
import Dashboard from "./pages/Dashboard";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import UsersManagement from "./pages/Admin/UsersManagement";
import DivisionsManagement from "./pages/Admin/DivisionsManagement";
import SystemStats from "./pages/Admin/SystemStats";

// Governor Pages
import GovernorDashboard from "./pages/Governor/Dashboard";
import AllTasksView from "./pages/Governor/AllTasksView";
import GovernorStatsView from "./pages/Governor/StatsView";
import GovernorCalendarView from "./pages/Governor/CalendarView";

// Secretary General Pages
import SecretaryGeneralDashboard from "./pages/SecretaryGeneral/Dashboard";
import FollowUp from "./pages/SecretaryGeneral/FollowUp";
import ReadOnlyTaskDetail from "./pages/SecretaryGeneral/ReadOnlyTaskDetail";

// Personal Secretary Pages
import PersonalSecretaryDashboard from "./pages/PersonalSecretary/Dashboard";
import TaskEntryForm from "./pages/PersonalSecretary/TaskEntryForm";
import TaskEditForm from "./pages/PersonalSecretary/TaskEditForm";
import TaskList from "./pages/PersonalSecretary/TaskList";
import CalendarManagement from "./pages/PersonalSecretary/CalendarManagement";

// Other Pages
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <DivisionProvider>
          <TaskProvider>
            <CalendarProvider>
              <BrowserRouter>
                <Routes>
                  {/* Main dashboard route - redirects based on role */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/login" element={<Dashboard />} />
                  
                  {/* Admin Routes */}
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <AppLayout>
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      </AppLayout>
                    } 
                  />
                  <Route 
                    path="/admin/users" 
                    element={
                      <AppLayout>
                        <ProtectedRoute 
                          allowedRoles={['admin']}
                          requiredPermission={{ resource: 'users', action: 'read' }}
                        >
                          <UsersManagement />
                        </ProtectedRoute>
                      </AppLayout>
                    } 
                  />
                  <Route 
                    path="/admin/divisions" 
                    element={
                      <AppLayout>
                        <ProtectedRoute 
                          allowedRoles={['admin']}
                          requiredPermission={{ resource: 'divisions', action: 'read' }}
                        >
                          <DivisionsManagement />
                        </ProtectedRoute>
                      </AppLayout>
                    } 
                  />
                  <Route 
                    path="/admin/statistics" 
                    element={
                      <AppLayout>
                        <ProtectedRoute 
                          allowedRoles={['admin']}
                          requiredPermission={{ resource: 'system', action: 'read' }}
                        >
                          <SystemStats />
                        </ProtectedRoute>
                      </AppLayout>
                    } 
                  />

                  {/* Governor Routes */}
                  <Route 
                    path="/governor/dashboard" 
                    element={
                      <AppLayout>
                        <ProtectedRoute allowedRoles={['governor']}>
                          <GovernorDashboard />
                        </ProtectedRoute>
                      </AppLayout>
                    } 
                  />
                  <Route 
                    path="/governor/tasks" 
                    element={
                      <AppLayout>
                        <ProtectedRoute 
                          allowedRoles={['governor']}
                          requiredPermission={{ resource: 'tasks', action: 'read' }}
                        >
                          <AllTasksView />
                        </ProtectedRoute>
                      </AppLayout>
                    } 
                  />
                  <Route 
                    path="/governor/calendar" 
                    element={
                      <AppLayout>
                        <ProtectedRoute 
                          allowedRoles={['governor']}
                          requiredPermission={{ resource: 'calendar', action: 'read' }}
                        >
                          <GovernorCalendarView />
                        </ProtectedRoute>
                      </AppLayout>
                    } 
                  />
                  <Route 
                    path="/governor/statistics" 
                    element={
                      <AppLayout>
                        <ProtectedRoute 
                          allowedRoles={['governor']}
                          requiredPermission={{ resource: 'statistics', action: 'read' }}
                        >
                          <GovernorStatsView />
                        </ProtectedRoute>
                      </AppLayout>
                    } 
                  />

                  {/* Secretary General Routes */}
                  <Route 
                    path="/secretary-general/dashboard" 
                    element={
                      <AppLayout>
                        <ProtectedRoute allowedRoles={['secretary_general']}>
                          <SecretaryGeneralDashboard />
                        </ProtectedRoute>
                      </AppLayout>
                    } 
                  />
                  <Route 
                    path="/secretary-general/followup" 
                    element={
                      <AppLayout>
                        <ProtectedRoute 
                          allowedRoles={['secretary_general']}
                          requiredPermission={{ resource: 'followup', action: 'read' }}
                        >
                          <FollowUp />
                        </ProtectedRoute>
                      </AppLayout>
                    } 
                  />
                  <Route 
                    path="/secretary-general/tasks/:id" 
                    element={
                      <AppLayout>
                        <ProtectedRoute 
                          allowedRoles={['secretary_general']}
                          requiredPermission={{ resource: 'tasks', action: 'read' }}
                        >
                          <ReadOnlyTaskDetail />
                        </ProtectedRoute>
                      </AppLayout>
                    } 
                  />

                  {/* Personal Secretary Routes */}
                  <Route 
                    path="/personal-secretary/dashboard" 
                    element={
                      <AppLayout>
                        <ProtectedRoute allowedRoles={['personal_secretary']}>
                          <PersonalSecretaryDashboard />
                        </ProtectedRoute>
                      </AppLayout>
                    } 
                  />
                  <Route 
                    path="/personal-secretary/tasks" 
                    element={
                      <AppLayout>
                        <ProtectedRoute 
                          allowedRoles={['personal_secretary']}
                          requiredPermission={{ resource: 'tasks', action: 'read' }}
                        >
                          <TaskList />
                        </ProtectedRoute>
                      </AppLayout>
                    } 
                  />
                  <Route 
                    path="/personal-secretary/calendar" 
                    element={
                      <AppLayout>
                        <ProtectedRoute 
                          allowedRoles={['personal_secretary']}
                          requiredPermission={{ resource: 'calendar', action: 'read' }}
                        >
                          <CalendarManagement />
                        </ProtectedRoute>
                      </AppLayout>
                    } 
                  />
                  <Route 
                    path="/personal-secretary/new-task" 
                    element={
                      <AppLayout>
                        <ProtectedRoute 
                          allowedRoles={['personal_secretary']}
                          requiredPermission={{ resource: 'tasks', action: 'create' }}
                        >
                          <TaskEntryForm />
                        </ProtectedRoute>
                      </AppLayout>
                    } 
                  />
                  <Route 
                    path="/personal-secretary/tasks/:id/edit" 
                    element={
                      <AppLayout>
                        <ProtectedRoute 
                          allowedRoles={['personal_secretary']}
                          requiredPermission={{ resource: 'tasks', action: 'update' }}
                        >
                          <TaskEditForm />
                        </ProtectedRoute>
                      </AppLayout>
                    } 
                  />

                  {/* Division Head Routes */}
                  <Route 
                    path="/division-head/dashboard" 
                    element={
                      <AppLayout>
                        <ProtectedRoute allowedRoles={['division_head']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      </AppLayout>
                    } 
                  />

                  {/* Utility Routes */}
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  
                  {/* Catch-all route - must be last */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </CalendarProvider>
          </TaskProvider>
        </DivisionProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
