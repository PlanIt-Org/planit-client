// src/pages/QuestionnairePage.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Title,
  Button,
  Stack,
  Progress,
  Text,
  TextInput,
  Checkbox,
  Paper,
  Radio,
  Group,
  Chip,
  LoadingOverlay,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiClient from "../api/axios";

/**
 * Renders a single question based on its component type and options.
 * Returns a tile, radio, or checkbox based on the question.
 */
function renderQuestion({ question, value, onChange }) {
  switch (question.component) {
    case "TextInput":
      return (
        <TextInput
          value={value || ""}
          onChange={(e) => onChange(e.currentTarget.value)}
          required={question.required}
        />
      );
    case "Checkbox.Group":
      return (
        <Stack>
          <Group>
            {question.options.map((opt) => (
              <Checkbox
                key={opt.value}
                label={opt.label}
                value={opt.value}
                checked={
                  Array.isArray(value) ? value.includes(opt.value) : false
                }
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    onChange([...(value || []), opt.value]);
                  } else {
                    onChange((value || []).filter((v) => v !== opt.value));
                  }
                }}
              />
            ))}
          </Group>
        </Stack>
      );
    case "Radio.Group":
      return (
        <Radio.Group value={value || ""} onChange={onChange}>
          <Group>
            {question.options.map((opt) => (
              <Radio key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Group>
        </Radio.Group>
      );
    case "Chip.Group":
      return (
        <Chip.Group
          multiple={question.props?.multiple}
          value={value || (question.props?.multiple ? [] : "")}
          onChange={onChange}
        >
          <Group>
            {question.options.map((opt) => (
              <Chip key={opt.value} value={opt.value}>
                {opt.label}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
      );
    default:
      return null;
  }
}

const QuestionnairePage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const questionnaireSteps = [
    {
      id: "welcome",
      type: "welcome",
      title: "WELCOME",
      content: "Welcome to our questionnaire! Let's get started.",
    },
    {
      id: "essentials",
      type: "question",
      title: "ABOUT YOU",
      questions: [
        {
          id: "age",
          prompt: "What is your age?",
          component: "TextInput",
          required: true,
        },
        {
          id: "dietary",
          prompt: "Do you have any dietary preferences or restrictions?",
          component: "Chip.Group",
          props: { multiple: true },
          options: [
            { value: "none", label: "None" },
            { value: "vegetarian", label: "Vegetarian" },
            { value: "vegan", label: "Vegan" },
            { value: "gluten-free", label: "Gluten-Free" },
            { value: "halal", label: "Halal" },
            { value: "kosher", label: "Kosher" },
            { value: "pescatarian", label: "Pescatarian" },
            { value: "other", label: "Other", showTextInput: true },
          ],
        },
        {
          id: "location",
          prompt: "What city or area are you located in?",
          // TODO: CONNECT TO GOOGLE MAPS API
          component: "TextInput",
          required: true,
        },
      ],
    },
    {
      id: "activities",
      type: "question",
      title: "ACTIVITIES",
      questions: [
        {
          id: "activityType",
          prompt: "What kind of activities are you interested in?",
          component: "Chip.Group",
          props: { multiple: true },
          options: [
            { value: "cafes", label: "Cafes & Coffee Shops" },
            { value: "dining", label: "Restaurants & Dining" },
            { value: "nightlife", label: "Bars & Nightlife" },
            { value: "live-music", label: "Live Music & Concerts" },
            { value: "theater-arts", label: "Theaters & Performing Arts" },
            { value: "museums-galleries", label: "Museums & Art Galleries" },
            { value: "outdoor", label: "Outdoor Activities & Parks" },
            { value: "sports-recreation", label: "Sports & Recreation" },
            { value: "shopping", label: "Shopping" },
            { value: "family-friendly", label: "Family-Friendly Attractions" },
            { value: "unique-trendy", label: "Unique & Trendy Spots" },
          ],
        },
        {
          id: "budget",
          prompt: "What's your typical budget?",
          component: "Chip.Group",
          props: { multiple: false },
          options: [
            { value: "1", label: "$" },
            { value: "2", label: "$$" },
            { value: "3", label: "$$$" },
            { value: "4", label: "$$$$" },
          ],
        },
      ],
    },
    {
      id: "planningStyle",
      type: "question",
      title: "PLANNING STYLE",
      questions: [
        {
          id: "tripLength",
          prompt: "What are you planning?",
          component: "Radio.Group",
          options: [
            { value: "quick-hangouts", label: "Quick Hangouts" },
            { value: "day-trips", label: "Day Trips" },
          ],
        },
        {
          id: "planningRole",
          prompt: "What's your planning style?",
          component: "Radio.Group",
          options: [
            {
              value: "planner",
              label: "The main planner who creates the itinerary",
            },
            {
              value: "collaborator",
              label: "A collaborator who likes to suggest ideas",
            },
            {
              value: "invitee",
              label: "Mostly an invitee who just wants to show up",
            },
          ],
        },
      ],
    },
    {
      id: "personal",
      type: "question",
      title: "PERSONAL (OPTIONAL)",
      questions: [
        {
          id: "eventAudience",
          prompt: "Who do you typically plan events for?",
          component: "Chip.Group",
          options: [
            { value: "family", label: "Family" },
            { value: "friends", label: "Friends" },
            { value: "partner", label: "Partner/Significant Other" },
            { value: "colleagues", label: "Work Colleagues" },
            { value: "solo", label: "Solo" },
          ],
        },
        {
          id: "lifestyle",
          prompt: "Which of these best describe your lifestyle choices?",
          component: "Chip.Group",
          props: { multiple: true },
          options: [
            { value: "active", label: "Active" },
            { value: "relaxed", label: "Relaxed" },
            { value: "adventurous", label: "Adventurous" },
            { value: "cultural", label: "Cultural" },
            { value: "social", label: "Social" },
            { value: "family-oriented", label: "Family-Oriented" },
            { value: "night-owl", label: "Night Owl" },
            { value: "early-bird", label: "Early Bird" },
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const { data } = await apiClient.get("/users/preferences");
        if (data) {
          const structuredAnswers = {
            essentials: {
              age: data.age,
              dietary: data.dietaryRestrictions,
              location: data.location,
            },
            activities: {
              activityType: data.activityPreferences,
              budget: data.budget,
            },
            planningStyle: {
              tripLength: data.typicalTripLength,
              planningRole: data.planningRole,
            },
            personal: {
              eventAudience: data.typicalAudience,
              lifestyle: data.lifestyleChoices,
            },
          };
          setAnswers(structuredAnswers);
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("Failed to fetch existing preferences:", error);
        }
        // It's okay if it's a 404, it just means the user is new.
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const totalSteps = questionnaireSteps.length;
  const progress = (currentStep / totalSteps) * 100;

  /**
   * Flattens the nested answers object into a single-level object
   * suitable for the API endpoint.
   */
  const flattenAnswers = (answersToFlatten) => {
    return Object.values(answersToFlatten).reduce(
      (acc, current) => ({ ...acc, ...current }),
      {}
    );
  };

  /**
   * Submits the user's preferences to the backend.
   * Navigates to the home page on success.
   */
  const submitPreferences = async () => {
    setIsSubmitting(true);
    const payload = flattenAnswers(answers);
    console.log("Preparing to submit preferences. Payload:", payload);

    try {
      console.log("Sending PUT request to /api/users/preferences...");
      const response = await apiClient.put("/users/preferences", payload);
      console.log("Request sent. Awaiting response...");
      console.log(
        "Preferences saved successfully. Response data:",
        response.data
      );
      navigate("/home");
    } catch (error) {
      console.error("Failed to save preferences. Error object:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }
      alert("There was an error saving your preferences. Please try again.");
    } finally {
      setIsSubmitting(false);
      console.log("submitPreferences finished. isSubmitting set to false.");
    }
  };

  /**
   * Advances the questionnaire to the next step, or logs answers if finished.
   */
  const handleContinue = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Questionnaire completed!", answers);
      submitPreferences();
    }
  };

  /**
   * Navigates to the previous step.
   */
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Updates the answers object for a specific question in the current step.
   * @param {string} questionId
   * @param {any} value
   */
  const handleQuestionChange = (questionId, value) => {
    const stepId = questionnaireSteps[currentStep].id;
    setAnswers((prev) => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        [questionId]: value,
      },
    }));
  };

  /**
   * Checks if all required questions in the current step are answered.
   */
  const isContinueDisabled = () => {
    const step = questionnaireSteps[currentStep];
    if (step.type === "welcome") return false;
    if (!step.questions) return false;
    // all required except personal step
    if (step.id === "personal") return false;
    return step.questions.some((q) => {
      const val = answers[step.id]?.[q.id];
      if (
        q.component === "Checkbox.Group" ||
        (q.component === "Chip.Group" && q.props?.multiple)
      ) {
        return !val || val.length === 0;
      }
      return !val;
    });
  };

  /**
   * Renders the content for the current step.
   */
  const renderStepContent = () => {
    const step = questionnaireSteps[currentStep];
    if (step.type === "welcome") {
      return (
        <Stack align="center" spacing="xl">
          <Title order={1} size="3rem" ta="center">
            {step.title}
          </Title>
          <Text size="lg" ta="center" c="dimmed">
            {step.content}
          </Text>
          <Button
            variant="outline"
            color="gray"
            size="md"
            onClick={() => navigate("/home")}
            style={{ alignSelf: "center" }}
          >
            Skip Questionnaire
          </Button>
        </Stack>
      );
    }
    if (step.type === "question" && step.questions) {
      return (
        <Stack
          align="center"
          spacing="xl"
          style={{ width: "100%", maxWidth: 600, position: "relative" }}
        >
          {/* Save & Exit button*/}
          <Button
            variant="subtle"
            color="gray"
            size="xs"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 2,
            }}
            onClick={submitPreferences}
            disabled={isSubmitting}
          >
            Save & Exit
          </Button>
          <Title order={2} size="2rem" ta="center">
            {step.title}
          </Title>
          {step.questions.map((q) => (
            <Paper key={q.id} p="md" withBorder style={{ width: "100%" }}>
              <Text fw={500} mb="sm">
                {q.prompt}
              </Text>
              {renderQuestion({
                question: q,
                value: answers[step.id]?.[q.id],
                onChange: (val) => handleQuestionChange(q.id, val),
              })}
            </Paper>
          ))}
        </Stack>
      );
    }
    return null;
  };

  /**
   * Returns the text for the continue button.
   */
  const getContinueButtonText = () => {
    if (currentStep === totalSteps - 1) {
      return "FINISH";
    }
    return "CONTINUE";
  };

  /**
   * Renders the questionnaire page.
   */
  return (
    <Container
      size="sm"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <LoadingOverlay visible={isSubmitting || isLoading} overlayBlur={2} />
      {/* Progress Bar */}
      <Progress
        value={progress}
        color="blue"
        size="md"
        style={{ width: "100%", marginBottom: "40px" }}
      />
      <Text size="md" ta="center" c="dimmed">
        Step {currentStep + 1} out of {totalSteps}
      </Text>

      {/* Step Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "32px",
          pointerEvents: "none",
          zIndex: 100,
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              size="lg"
              style={{ minWidth: "120px" }}
              disabled={isSubmitting}
            >
              BACK
            </Button>
          )}
        </div>
        <div style={{ pointerEvents: "auto" }}>
          <Button
            size="lg"
            onClick={handleContinue}
            style={{ minWidth: "200px" }}
            disabled={isContinueDisabled() || isSubmitting}
          >
            {getContinueButtonText()}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default QuestionnairePage;
