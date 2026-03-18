import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResumeBuilder from "./pages/ResumeBuilder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ResumeBuilder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;