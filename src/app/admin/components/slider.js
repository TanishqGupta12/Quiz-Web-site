"use client";

import * as React from "react";
import NextLink from "next/link";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import JoyLink from "@mui/joy/Link";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { api } from "@/lib/api";

const items = [
  { href: "/", label: "Home" },
  { href: "/admin/controller/Questioncreate", label: "Create question" },
  { href: "/admin/controller/Questionlist", label: "Question bank" },
  { href: "/admin/controller/candatelist", label: "Candidates" },
  { href: "/superadmin", label: "Superadmin" },
];

export default function Slider() {
  const [loggingOut, setLoggingOut] = React.useState(false);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await api.post("/api/admin/logout");
    } catch {
      /* still leave session UI */
    } finally {
      window.location.assign("/admin");
    }
  };

  return (
    <Sheet
      variant="soft"
      sx={{
        width: { xs: "100%", md: 240 },
        flexShrink: 0,
        borderRadius: { xs: "md", md: "md" },
        p: 2,
        height: "fit-content",
      }}
    >
      <Typography level="title-sm" sx={{ mb: 1 }}>
        Organizer
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Stack spacing={0.5}>
        {items.map((item) => (
          <JoyLink
            key={item.href}
            component={NextLink}
            href={item.href}
            level="body-sm"
            underline="none"
            sx={{
              px: 1,
              py: 0.75,
              borderRadius: "sm",
              fontWeight: "md",
              "&:hover": { bgcolor: "background.level1" },
            }}
          >
            {item.label}
          </JoyLink>
        ))}
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Button
        fullWidth
        variant="outlined"
        color="danger"
        size="sm"
        loading={loggingOut}
        onClick={logout}
      >
        Log out
      </Button>
    </Sheet>
  );
}
