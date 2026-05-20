import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import LandingPage from "./pages/LandingPage";
import JobMatch from "./pages/JobMatch";
import Login from "./pages/Login";
import GoogleAuth from "./pages/auth/GoogleAuth";
import LinkedInAuth from "./pages/auth/LinkedInAuth";
import GitHubAuth from "./pages/auth/GitHubAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/google" element={<GoogleAuth />} />
        <Route path="/auth/linkedin" element={<LinkedInAuth />} />
        <Route path="/auth/github" element={<GitHubAuth />} />

        {/* App pages with sidebar */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/job-match" element={<JobMatch />} />
          <Route path="/builder/new" element={<ResumeBuilder />} />
          <Route path="/builder/:id" element={<ResumeBuilder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;