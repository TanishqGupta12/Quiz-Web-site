"use client";

import * as React from "react";
import NextLink from "next/link";
import Alert from "@mui/joy/Alert";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import { api } from "@/lib/api";

export default function SuperadminPage() {
  const [configured, setConfigured] = React.useState(null);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [loginError, setLoginError] = React.useState("");
  const [loginLoading, setLoginLoading] = React.useState(false);

  const [admins, setAdmins] = React.useState([]);
  const [listError, setListError] = React.useState("");
  const [newName, setNewName] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [newRole, setNewRole] = React.useState("admin");
  const [createMessage, setCreateMessage] = React.useState("");
  const [createLoading, setCreateLoading] = React.useState(false);

  const refreshSession = React.useCallback(async () => {
    try {
      const { data } = await api.get("/api/superadmin/me");
      setConfigured(data.configured);
      setAuthenticated(Boolean(data.authenticated));
    } catch {
      setConfigured(false);
      setAuthenticated(false);
    }
  }, []);

  const loadAdmins = React.useCallback(async () => {
    setListError("");
    try {
      const { data } = await api.get("/api/superadmin/admins");
      setAdmins(data.admins || []);
    } catch (err) {
      setListError(err?.response?.data?.error || "Could not load admins.");
    }
  }, []);

  React.useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  React.useEffect(() => {
    if (authenticated) loadAdmins();
  }, [authenticated, loadAdmins]);

  const onLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await api.post("/api/superadmin/login", { email: loginEmail, password: loginPassword });
      window.location.reload();
    } catch (err) {
      setLoginError(err?.response?.data?.error || "Login failed.");
    } finally {
      setLoginLoading(false);
    }
  };

  const onLogout = async () => {
    await api.post("/api/superadmin/logout");
    setAuthenticated(false);
    setAdmins([]);
  };

  const onCreateAdmin = async (e) => {
    e.preventDefault();
    setCreateMessage("");
    setCreateLoading(true);
    try {
      await api.post("/api/superadmin/admins", {
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
      });
      setCreateMessage("Admin created. They can sign in at /admin.");
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("admin");
      await loadAdmins();
    } catch (err) {
      setCreateMessage(err?.response?.data?.error || "Could not create admin.");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
        px: 2,
        background:
          "radial-gradient(900px 500px at 0% 0%, rgba(99,102,241,0.15), transparent), var(--joy-palette-background-body)",
      }}
    >
      <Sheet variant="outlined" sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3 }, borderRadius: "md", boxShadow: "lg" }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
            <Typography level="h2">Superadmin</Typography>
            <Stack direction="row" spacing={1}>
              {authenticated ? (
                <Button variant="outlined" color="neutral" onClick={onLogout}>
                  Sign out
                </Button>
              ) : null}
              <Button component={NextLink} href="/" variant="plain">
                Home
              </Button>
            </Stack>
          </Stack>

          <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
            Superadmin is defined in <Typography component="code">.env</Typography> (not in the database). From here you create
            organizer accounts that sign in on the Admin page.
          </Typography>

          {configured === false ? (
            <Alert color="warning" variant="soft">
              Set <Typography component="code">SUPERADMIN_EMAIL</Typography>,{" "}
              <Typography component="code">SUPERADMIN_PASSWORD</Typography>, and{" "}
              <Typography component="code">ADMIN_SESSION_SECRET</Typography> (16+ characters) in{" "}
              <Typography component="code">.env</Typography>, then restart <Typography component="code">npm run dev</Typography>.
            </Alert>
          ) : null}

          {!authenticated && configured ? (
            <Sheet variant="soft" sx={{ p: 2, borderRadius: "md" }}>
              <Typography level="title-lg" sx={{ mb: 2 }}>
                Sign in as superadmin
              </Typography>
              <Typography level="body-xs" sx={{ color: "text.tertiary", mb: 1 }}>
                Use the email and password from <Typography component="code">SUPERADMIN_EMAIL</Typography> and{" "}
                <Typography component="code">SUPERADMIN_PASSWORD</Typography> in your <Typography component="code">.env</Typography> file
                (not an <Typography component="code">admins</Typography> row). DB-backed admins sign in at{" "}
                <Typography component="code">/admin</Typography>.
              </Typography>
              <form onSubmit={onLogin}>
                <Stack spacing={2}>
                  {loginError ? (
                    <Alert color="danger" variant="soft">
                      {loginError}
                    </Alert>
                  ) : null}
                  <FormControl required>
                    <FormLabel>Email</FormLabel>
                    <Input value={loginEmail} onChange={(ev) => setLoginEmail(ev.target.value)} type="email" autoComplete="username" />
                  </FormControl>
                  <FormControl required>
                    <FormLabel>Password</FormLabel>
                    <Input
                      value={loginPassword}
                      onChange={(ev) => setLoginPassword(ev.target.value)}
                      type="password"
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <Button type="submit" loading={loginLoading}>
                    Sign in
                  </Button>
                </Stack>
              </form>
            </Sheet>
          ) : null}

          {authenticated ? (
            <>
              <Divider />
              <Typography level="title-lg">Create admin</Typography>
              <form onSubmit={onCreateAdmin}>
                <Stack spacing={2}>
                  {createMessage ? (
                    <Alert color={createMessage.includes("Could not") || createMessage.includes("already") ? "danger" : "success"} variant="soft">
                      {createMessage}
                    </Alert>
                  ) : null}
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input value={newName} onChange={(ev) => setNewName(ev.target.value)} placeholder="Display name" />
                  </FormControl>
                  <FormControl required>
                    <FormLabel>Email</FormLabel>
                    <Input value={newEmail} onChange={(ev) => setNewEmail(ev.target.value)} type="email" placeholder="admin@org.com" />
                  </FormControl>
                  <FormControl required>
                    <FormLabel>Password</FormLabel>
                    <Input
                      value={newPassword}
                      onChange={(ev) => setNewPassword(ev.target.value)}
                      type="password"
                      placeholder="Min. 8 characters"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Role (stored in MongoDB)</FormLabel>
                    <Select value={newRole} onChange={(_, v) => setNewRole(v)} sx={{ minWidth: 200 }}>
                      <Option value="admin">admin</Option>
                      <Option value="superadmin">superadmin</Option>
                    </Select>
                  </FormControl>
                  <Button type="submit" loading={createLoading}>
                    Create admin
                  </Button>
                </Stack>
              </form>

              <Divider />
              <Typography level="title-lg">Admins</Typography>
              {listError ? (
                <Alert color="danger" variant="soft">
                  {listError}
                </Alert>
              ) : null}
              {admins.length === 0 ? (
                <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
                  No admins yet. Create one above.
                </Typography>
              ) : (
                <Table stripe="odd" aria-label="admins">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((a) => (
                      <tr key={a.id}>
                        <td>{a.name || "—"}</td>
                        <td>{a.email}</td>
                        <td>{a.role || "admin"}</td>
                        <td>{a.createdAt ? new Date(a.createdAt).toLocaleString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          ) : null}
        </Stack>
      </Sheet>
    </Box>
  );
}
