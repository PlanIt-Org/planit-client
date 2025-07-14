import { useState } from "react";
import "./App.css";
import { AppShell } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import QuestionnairePage from "./pages/QuestionnairePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import TripPlannerPage from "./pages/TripPlannerPage";
import TripSummaryPage from "./pages/TripSummaryPage";
import NotFoundPage from "./pages/NotFoundPage";


function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/questionnaire" element={<QuestionnairePage />} />
            <Route path="/tripplanner" element={<TripPlannerPage />} />
            <Route path="/tripsummary" element={<TripSummaryPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
