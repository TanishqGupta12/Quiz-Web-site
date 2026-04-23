"use client";

import * as React from "react";
import Link from "next/link";
import Alert from "@mui/joy/Alert";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import LinearProgress from "@mui/joy/LinearProgress";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { api } from "@/lib/api";

const QUIZ_DURATION_SEC = 120;

export default function CandidateTest({ params }) {
  const candidate = params?.candidate ?? "";

  const [questions, setQuestions] = React.useState([]);
  const [questionsReady, setQuestionsReady] = React.useState(false);
  const [userAnswers, setUserAnswers] = React.useState([]);
  const [remainingTime, setRemainingTime] = React.useState(QUIZ_DURATION_SEC);
  const [loadError, setLoadError] = React.useState("");
  const [submitError, setSubmitError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const inFlightRef = React.useRef(false);
  const timerExpiredRef = React.useRef(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/api/Question");
        if (!cancelled) {
          const list = Array.isArray(data.data) ? data.data : [];
          setQuestions(list);
          setUserAnswers(Array(list.length).fill(""));
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err?.response?.data?.error || err?.response?.data?.message || err?.message || "Could not load questions."
          );
        }
      } finally {
        if (!cancelled) setQuestionsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!questions.length) return undefined;
    setRemainingTime(QUIZ_DURATION_SEC);
    const id = window.setInterval(() => {
      setRemainingTime((t) => Math.max(0, t - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [questions.length]);

  const calculateScore = React.useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setSubmitting(true);
    setSubmitError("");

    let calculatedScore = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] && userAnswers[index] === question.correctAnswer) {
        calculatedScore += 1;
      }
    });
    const attempt = calculatedScore;
    const score = calculatedScore * 5;

    try {
      const { data } = await api.put(`/api/sign/${candidate}`, { attempt, score });
      const rawId = data.data?._id;
      const id =
        typeof rawId === "string"
          ? rawId
          : rawId && typeof rawId === "object" && "$oid" in rawId
            ? rawId.$oid
            : rawId != null
              ? String(rawId)
              : "";
      if (data.Success && id) {
        window.location.assign(`/Signup/Score/${id}`);
        return;
      }
      setSubmitError("Could not save your results.");
    } catch (err) {
      setSubmitError(err?.message || "Could not save your results.");
    } finally {
      inFlightRef.current = false;
      setSubmitting(false);
    }
  }, [candidate, questions, userAnswers]);

  React.useEffect(() => {
    if (!questions.length || remainingTime > 0) return;
    if (timerExpiredRef.current) return;
    timerExpiredRef.current = true;
    calculateScore();
  }, [calculateScore, questions.length, remainingTime]);

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setUserAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = selectedOption;
      return next;
    });
  };

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const answeredCount = userAnswers.filter(Boolean).length;
  const progress = questions.length ? answeredCount / questions.length : 0;
  const timeRatio = QUIZ_DURATION_SEC ? remainingTime / QUIZ_DURATION_SEC : 0;
  const urgent = remainingTime > 0 && remainingTime <= 20;

  if (!candidate) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
        <Alert color="danger" variant="soft">
          Missing candidate id. Go back to <Link href="/">home</Link> and sign in again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 3,
        px: { xs: 1.5, sm: 3 },
        background: "var(--joy-palette-background-body)",
      }}
    >
      <Stack spacing={2} sx={{ maxWidth: 900, mx: "auto" }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} alignItems={{ sm: "center" }}>
          <div>
            <Typography level="h3" fontWeight="lg">
              Quiz
            </Typography>
            <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
              Answer every question, then submit. Auto-submit runs at 0:00.
            </Typography>
          </div>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip variant="soft" color={urgent ? "danger" : "primary"} size="lg">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </Chip>
            <Button component={Link} href="/" variant="outlined" color="neutral" size="sm">
              Exit
            </Button>
          </Stack>
        </Stack>

        <Sheet variant="soft" sx={{ p: 2, borderRadius: "md" }}>
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography level="title-sm">Progress</Typography>
              <Typography level="body-sm">
                {answeredCount}/{questions.length || 0} answered
              </Typography>
            </Stack>
            <LinearProgress determinate value={100 * progress} />
            <LinearProgress determinate value={100 * timeRatio} color={urgent ? "danger" : "neutral"} />
          </Stack>
        </Sheet>

        {loadError ? (
          <Alert color="danger" variant="soft">
            {loadError}
          </Alert>
        ) : null}
        {submitError ? (
          <Alert color="danger" variant="soft">
            {submitError}
          </Alert>
        ) : null}

        {!questionsReady ? (
          <Typography level="body-md">Loading questions…</Typography>
        ) : null}
        {questionsReady && !questions.length && !loadError ? (
          <Alert color="warning" variant="soft">
            No questions in the database yet. Ask an organizer to add them (Admin → Create question), then refresh this
            page.
          </Alert>
        ) : null}

        {questions.map((question, index) => (
          <Sheet key={question._id || index} variant="outlined" sx={{ p: 2, borderRadius: "md" }}>
            <Stack spacing={1.5}>
              <Typography level="title-md">
                {index + 1}. {question.question}
              </Typography>
              <RadioGroup
                name={`q-${index}`}
                value={userAnswers[index] || ""}
                onChange={(ev) => handleAnswerSelect(index, ev.target.value)}
              >
                <Stack spacing={1}>
                  {question.options?.map((option) => (
                    <Radio key={option} value={option} label={option} size="lg" variant="outlined" />
                  ))}
                </Stack>
              </RadioGroup>
            </Stack>
          </Sheet>
        ))}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="flex-end">
          <Button
            size="lg"
            loading={submitting}
            disabled={!questions.length}
            onClick={() => {
              calculateScore();
            }}
          >
            Submit answers
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
