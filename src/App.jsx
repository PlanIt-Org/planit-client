// src/App.jsx
import { useState, useEffect } from "react";
import "./App.css";
import { Navigate, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth.js";
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
import { supabase } from "./supabaseClient";
import { useLocation } from "react-router";

const ProtectedRoute = ({ children }) => {
  const { session } = useAuth();
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App({ isMapsApiLoaded }) {
  const [selectedCity, setSelectedCity] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [ownTrip, setOwnTrip] = useState(true);
  const { session } = useAuth();
  const location = useLocation();

  return (
    <>
      <Notifications position="bottom-center" zIndex={2077} />
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={session ? <Navigate to="/home" /> : <LoginPage />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
        {/* --- PROTECTED ROUTES --- */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                isMapsApiLoaded={isMapsApiLoaded}
                setLocations={setLocations}
                user={session?.user?.id}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage user={session?.user} setLocations={setLocations} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questionnaire"
          element={
            // <ProtectedRoute>
            <QuestionnairePage />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/tripplanner/:id"
          element={
            <ProtectedRoute>
              <TripPlannerPage
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                locations={locations}
                setLocations={setLocations}
                setSelectedPlace={setSelectedPlace}
                selectedPlace={selectedPlace}
                ownTrip={ownTrip}
                setOwnTrip={setOwnTrip}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tripsummary/:id"
          element={
            <ProtectedRoute>
              <TripSummaryPage
                locations={locations}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                setLocations={setLocations}
                setSelectedPlace={setSelectedPlace}
                selectedPlace={selectedPlace}
                userId={session?.user?.id}
                ownTrip={ownTrip}
                setOwnTrip={setOwnTrip}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tripfilter/:tripId"
          element={
            <ProtectedRoute>
              <TripFilterPage setLocations={setLocations} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/discover"
          element={
            <ProtectedRoute>
              <DiscoverTripsPage setLocations={setLocations} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedTripsPage setLocations={setLocations} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
