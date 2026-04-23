"use client";

import * as React from "react";
import Link from "next/link";
import Alert from "@mui/joy/Alert";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import Divider from "@mui/joy/Divider";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { api } from "@/lib/api";

export default function ScorePage({ params }) {
  const { candidate } = params;
  const [profile, setProfile] = React.useState(null);
  const [maxQuestions, setMaxQuestions] = React.useState(0);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [userRes, qRes] = await Promise.all([
          api.get(`/api/sign/${candidate}`),
          api.get("/api/Question"),
        ]);
        if (cancelled) return;
        const user = userRes.data?.data;
        if (!user) {
          setError("We could not find this result.");
          return;
        }
        setProfile(user);
        const list = qRes.data?.data || [];
        setMaxQuestions(Array.isArray(list) ? list.length : 0);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Could not load results.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [candidate]);

  const scorePoints = Number(profile?.score || 0);
  const attemptCorrect = Number(profile?.attempt || 0);
  const maxPoints = Math.max(1, maxQuestions * 5);
  const scorePercent = Math.min(100, Math.round((scorePoints / maxPoints) * 100));
  const attemptPercent = Math.max(1, maxQuestions)
    ? Math.min(100, Math.round((attemptCorrect / maxQuestions) * 100))
    : 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        background:
          "radial-gradient(900px 480px at 10% 0%, rgba(34,197,94,0.18), transparent), var(--joy-palette-background-body)",
      }}
    >
      <Sheet variant="outlined" sx={{ width: "100%", maxWidth: 720, p: { xs: 2, sm: 3 }, borderRadius: "md", boxShadow: "lg" }}>
        <Stack spacing={2}>
          <Typography level="h3" fontWeight="lg">
            Results
          </Typography>
          {error ? (
            <Alert color="danger" variant="soft">
              {error}
            </Alert>
          ) : null}
          {!profile && !error ? (
            <Typography level="body-md">Loading…</Typography>
          ) : null}
          {profile ? (
            <>
              <Typography level="title-lg">
                {profile.Name ? `Nice work, ${profile.Name}.` : "Here is how you did."}
              </Typography>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={3}
                sx={{ alignItems: "center", justifyContent: "space-around" }}
              >
                <Stack spacing={1} alignItems="center">
                  <Typography level="body-sm" textTransform="uppercase" letterSpacing="0.08em">
                    Points
                  </Typography>
                  <CircularProgress
                    determinate
                    value={scorePercent}
                    size="lg"
                    sx={{
                      "--CircularProgress-size": "200px",
                      "--CircularProgress-trackThickness": "18px",
                      "--CircularProgress-progressThickness": "18px",
                    }}
                  >
                    <Typography level="h2">{scorePoints}</Typography>
                  </CircularProgress>
                  <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                    Out of {maxQuestions * 5} possible
                  </Typography>
                </Stack>
                <Stack spacing={1} alignItems="center">
                  <Typography level="body-sm" textTransform="uppercase" letterSpacing="0.08em">
                    Correct
                  </Typography>
                  <CircularProgress
                    determinate
                    value={attemptPercent}
                    color="success"
                    size="lg"
                    sx={{
                      "--CircularProgress-size": "200px",
                      "--CircularProgress-trackThickness": "18px",
                      "--CircularProgress-progressThickness": "18px",
                    }}
                  >
                    <Typography level="h2">{attemptCorrect}</Typography>
                  </CircularProgress>
                  <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                    Out of {maxQuestions} questions
                  </Typography>
                </Stack>
              </Stack>
            </>
          ) : null}
          <Divider />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button component={Link} href="/" fullWidth>
              Home
            </Button>
            <Button component={Link} href="/Signup" variant="soft" color="neutral" fullWidth>
              New account
            </Button>
          </Stack>
        </Stack>
      </Sheet>
    </Box>
  );
}
