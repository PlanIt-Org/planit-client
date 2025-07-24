// src/App.jsx
import { useState, useEffect } from "react";
import "./App.css";
import { Navigate, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
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
  const [locations, setLocations] = useState([]); // TODO: change this later. teporarily storing the locations
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [currTripId, setCurrTripId] = useState(null);

  const { session } = useAuth();
  const location = useLocation();

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session);
  //   });
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //   });
  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, []);
  // // Debugging statement to check if user is logged in
  // useEffect(() => {
  //   console.log("Current session:", session);
  // }, [session]);

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
        <Route
          path="/register"
          element={session ? <Navigate to="/home" /> : <RegisterPage />}
        />
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
                setCurrTripId={setCurrTripId}
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
              <ProfilePage
                user={session?.user}
                setCurrTripId={setCurrTripId}
                setLocations={setLocations}
              />
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
          path="/tripplanner"
          element={
            <ProtectedRoute>
              <TripPlannerPage
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                locations={locations}
                setLocations={setLocations}
                setSelectedPlace={setSelectedPlace}
                selectedPlace={selectedPlace}
                currTripId={currTripId}
                setCurrTripId={setCurrTripId}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tripsummary/:tripId"
          element={
            <ProtectedRoute>
              <TripSummaryPage
                locations={locations}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                setLocations={setLocations}
                setSelectedPlace={setSelectedPlace}
                selectedPlace={selectedPlace}
                setCurrTripId={setCurrTripId}
                currTripId={currTripId}
                userId={session?.user?.id}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute>
              <RegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tripfilter"
          element={
            <ProtectedRoute>
              <TripFilterPage
                setCurrTripId={setCurrTripId}
                setLocations={setLocations}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/discover"
          element={
            <ProtectedRoute>
              <DiscoverTripsPage
                setCurrTripId={setCurrTripId}
                setLocations={setLocations}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedTripsPage
                setCurrTripId={setCurrTripId}
                setLocations={setLocations}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
