import React from "react";
import { UserProfile } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <UserProfile
        afterSignOutUrl="/questionnaire"
        afterPrimaryButtonClick={() => navigate("/questionnaire")}
      />
    </div>
  );
};

export default ProfilePage;
