import * as React from "react";
import Link from "next/link";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import SignupForm from "./components/SignupForm";

export default function Signup() {
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
          "radial-gradient(1000px 500px at 10% 0%, rgba(236,72,153,0.2), transparent), radial-gradient(900px 500px at 100% 20%, rgba(99,102,241,0.22), transparent), var(--joy-palette-background-body)",
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 440,
          borderRadius: "md",
          p: { xs: 2, sm: 3 },
          boxShadow: "lg",
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography level="h3" fontWeight="lg">
              Create account
            </Typography>
            <Button component={Link} href="/" variant="plain" size="sm">
              Back
            </Button>
          </Stack>
          <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
            After signing up you will go straight into the timed quiz.
          </Typography>
          <SignupForm />
        </Stack>
      </Sheet>
    </Box>
  );
}
