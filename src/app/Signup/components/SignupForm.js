"use client";

import * as React from "react";
import Alert from "@mui/joy/Alert";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { api } from "@/lib/api";

export default function SignupForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/sign", {
        Name: name,
        email,
        password,
      });
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
      setError(data.error || "Sign up did not complete. Try a different email.");
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
    <form onSubmit={onSubmit}>
      <Stack spacing={2}>
        {error ? (
          <Alert color="danger" variant="soft">
            {error}
          </Alert>
        ) : null}
        <FormControl required>
          <FormLabel>Display name</FormLabel>
          <Input value={name} onChange={(ev) => setName(ev.target.value)} placeholder="Alex" />
        </FormControl>
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
            placeholder="Choose a password"
            autoComplete="new-password"
          />
        </FormControl>
        <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
          You will have two minutes once the quiz starts. You can submit early.
        </Typography>
        <Button type="submit" loading={loading} size="lg">
          Start quiz
        </Button>
      </Stack>
    </form>
  );
}
