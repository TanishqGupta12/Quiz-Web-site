import * as React from "react";
import Link from "next/link";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import AdminLoginForm from "./components/AdminLoginForm";

export default function AdminPage() {
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
          "radial-gradient(900px 500px at 0% 0%, rgba(14,165,233,0.2), transparent), var(--joy-palette-background-body)",
      }}
    >
      <Sheet variant="outlined" sx={{ width: "100%", maxWidth: 440, p: { xs: 2, sm: 3 }, borderRadius: "md", boxShadow: "lg" }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography level="h3" fontWeight="lg">
              Admin
            </Typography>
            <Button component={Link} href="/" variant="plain" size="sm">
              Home
            </Button>
          </Stack>
          <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
            Sign in with an organizer account created in the superadmin dashboard.
          </Typography>
          <AdminLoginForm />
        </Stack>
      </Sheet>
    </Box>
  );
}
