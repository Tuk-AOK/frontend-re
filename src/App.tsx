import React from "react";
import MainPage from "./pages/mainPage";
import ProjectPage from "./pages/projectPage";
import UploadPage from "./pages/uploadPage";
import LogHistoryPage from "./pages/logHistoryPage";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage/>} />
      <Route path="/project" element={<ProjectPage/>} />
      <Route path="/upload" element={<UploadPage/>} />
      <Route path="/loghistory" element={<LogHistoryPage/>} />
    </Routes> 
  </BrowserRouter>
  
  );
}

export default App;
