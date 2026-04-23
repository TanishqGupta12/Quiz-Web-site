"use client";

import * as React from "react";
import Alert from "@mui/joy/Alert";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import NextLink from "next/link";
import JoyLink from "@mui/joy/Link";
import { api } from "@/lib/api";

export default function AdminLoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/admin/login", { email, password });
      // Full navigation so the httpOnly session cookie is always sent on the next load (avoids RSC/client race with router.push).
      window.location.assign("/admin/controller/Questioncreate");
    } catch (err) {
      setError(err?.response?.data?.error || "Sign in failed. Use an account created in Superadmin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
        Use an email that exists in MongoDB <strong>admins</strong> (e.g. seed <Typography component="code">admin@demo.quiz</Typography> or{" "}
        <Typography component="code">superadmin@demo.quiz</Typography>). Quiz candidates use the{" "}
        <JoyLink component={NextLink} href="/" level="body-sm">
          home
        </JoyLink>{" "}
        form instead. Create accounts:{" "}
        <JoyLink component={NextLink} href="/superadmin" level="body-sm">
          superadmin
        </JoyLink>
        .
      </Typography>
      {error ? (
        <Alert color="danger" variant="soft">
          {error}
        </Alert>
      ) : null}
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <FormControl required>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} autoComplete="username" />
          </FormControl>
          <FormControl required>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(ev) => setPassword(ev.target.value)} autoComplete="current-password" />
          </FormControl>
          <Button type="submit" size="lg" loading={loading}>
            Continue to dashboard
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
