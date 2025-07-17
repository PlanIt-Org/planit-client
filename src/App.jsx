// src/App.jsx
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
import TripFilterPage from "./pages/TripFilterPage";
import DiscoverTripsPage from "./pages/DiscoverTripsPage";
import SavedTripsPage from "./pages/SavedTripsPage";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

function App({isMapsApiLoaded}) {

  const [selectedCity, setSelectedCity] = useState("");


  return (
    <>
      <Notifications position="bottom-center" zIndex={2077} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage selectedCity={selectedCity} setSelectedCity={setSelectedCity} isMapsApiLoaded={isMapsApiLoaded}/>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        <Route path="/tripplanner" element={<TripPlannerPage selectedCity={selectedCity} setSelectedCity={setSelectedCity}/>} />
        <Route path="/tripsummary" element={<TripSummaryPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tripfilter" element={<TripFilterPage />} />
        <Route path="/discover" element={<DiscoverTripsPage />} />
        <Route path="/saved" element={<SavedTripsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
