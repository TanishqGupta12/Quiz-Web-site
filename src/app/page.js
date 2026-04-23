"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Alert from "@mui/joy/Alert";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { api } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/sign", { email, password });
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
        window.location.assign(`/Signup/Test/${id}`);
        return;
      }
      setError(data.error || "Could not sign in. Check your details and try again.");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

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
          "radial-gradient(1200px 600px at 20% -10%, rgba(99,102,241,0.35), transparent), radial-gradient(900px 500px at 110% 10%, rgba(14,165,233,0.25), transparent), var(--joy-palette-background-body)",
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: "md",
          p: { xs: 2, sm: 3 },
          boxShadow: "lg",
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography level="h3" fontWeight="lg">
              Quiz
            </Typography>
            <Button component={Link} href="/admin" variant="plain" size="sm">
              Admin
            </Button>
          </Stack>
          <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
            Quiz takers: use emails stored in MongoDB <strong>signs</strong>. Organizers: open{" "}
            <Link href="/admin">/admin</Link> or <Link href="/superadmin">/superadmin</Link> (not this form).
          </Typography>
          {error ? (
            <Alert color="danger" variant="soft">
              {error}
            </Alert>
          ) : null}
          <form onSubmit={submit}>
            <Stack spacing={2}>
              <FormControl required>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </FormControl>
              <FormControl required>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </FormControl>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button type="submit" loading={loading} fullWidth>
                  Continue to quiz
                </Button>
                <Button
                  type="button"
                  variant="soft"
                  color="neutral"
                  fullWidth
                  onClick={() => router.push("/Signup")}
                >
                  Sign up
                </Button>
              </Stack>
            </Stack>
          </form>
          <Divider />
          <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
            Timed assessments. Submit early or we will submit when the timer ends.
          </Typography>
        </Stack>
      </Sheet>
    </Box>
  );
}
