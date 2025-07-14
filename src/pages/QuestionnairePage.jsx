import React, { useState } from "react";
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
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

/**
 * Renders a single question based on its component type and options.
 * Returns a tile, radio, or checkbox based on the question.
 */
function renderQuestion({ question, value, onChange }) {
  switch (question.component) {
    case "TextInput":
      return (
        <TextInput
          label={question.prompt}
          value={value || ""}
          onChange={(e) => onChange(e.currentTarget.value)}
          required={question.required}
        />
      );
    case "Checkbox.Group":
      return (
        <Stack>
          <Text fw={500}>{question.prompt}</Text>
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
        <Radio.Group
          label={question.prompt}
          value={value || ""}
          onChange={onChange}
        >
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
  const navigate = useNavigate();

  const questionnaireSteps = [
    {
      id: "welcome",
      type: "welcome",
      title: "WELCOME",
      content: "Welcome to our questionnaire! Let's get started.",
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
          component: "Checkbox.Group",
          options: [
            { value: "family", label: "Family" },
            { value: "friends", label: "Friends" },
            { value: "partner", label: "Partner/Significant Other" },
            { value: "colleagues", label: "Work Colleagues" },
            { value: "solo", label: "Solo" },
          ],
        },
      ],
    },
  ];

  const totalSteps = questionnaireSteps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  /**
   * Advances the questionnaire to the next step, or logs answers if finished.
   */
  const handleContinue = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Questionnaire completed!", answers);
      navigate("/home");
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
        </Stack>
      );
    }
    if (step.type === "question" && step.questions) {
      return (
        <Stack
          align="center"
          spacing="xl"
          style={{ width: "100%", maxWidth: 600 }}
        >
          <Title order={2} size="2rem" ta="center">
            {step.title}
          </Title>
          {step.questions.map((q) => (
            <Paper key={q.id} p="md" withBorder style={{ width: "100%" }}>
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
      {/* Progress Bar */}
      <Progress
        value={progress}
        color="gray"
        size="md"
        style={{ width: "100%", marginBottom: "40px" }}
      />

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
      <Stack direction="row" spacing="md" style={{ marginTop: "40px" }}>
        {currentStep > 0 && (
          <Button variant="outline" onClick={handleBack}>
            BACK
          </Button>
        )}
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={isContinueDisabled()}
          style={{ minWidth: "200px" }}
        >
          {getContinueButtonText()}
        </Button>
      </Stack>
    </Container>
  );
};

export default QuestionnairePage;
