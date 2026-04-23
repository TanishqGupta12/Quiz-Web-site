"use client";

import * as React from "react";
import Link from "next/link";
import axios from "axios";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Slider from "../../components/slider";

export default function Questionlist() {
  const [questions, setQuestions] = React.useState([]);
  const [message, setMessage] = React.useState("");

  const refresh = React.useCallback(async () => {
    try {
      const response = await axios.get("/api/Question");
      setQuestions(response.data.data || []);
    } catch (error) {
      setMessage("Could not load questions.");
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const handleDelete = async (id) => {
    setMessage("");
    try {
      await axios.delete(`/api/Question/${id}`);
      setMessage("Question removed.");
      refresh();
    } catch (error) {
      setMessage("Delete failed.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.body", p: { xs: 2, md: 3 } }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="flex-start">
        <Slider />
        <Sheet variant="outlined" sx={{ flex: 1, width: "100%", p: { xs: 2, sm: 3 }, borderRadius: "md" }}>
          <Stack spacing={2}>
            <Typography level="h3">Question bank</Typography>
            {message ? (
              <Typography level="body-sm" color={message.includes("Could not") || message.includes("failed") ? "danger" : "neutral"}>
                {message}
              </Typography>
            ) : null}
            {questions.length === 0 ? (
              <Typography level="body-md" sx={{ color: "text.tertiary" }}>
                No questions yet. Create one first.
              </Typography>
            ) : null}
            {questions.map((item) => (
              <Sheet key={item._id} variant="soft" sx={{ p: 2, borderRadius: "md" }}>
                <Stack spacing={1}>
                  <Typography level="title-md">{item.question}</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button component={Link} href={`/admin/controller/Questionlist/${item._id}`} size="sm" variant="soft">
                      Edit
                    </Button>
                    <Button size="sm" color="danger" variant="soft" onClick={() => handleDelete(item._id)}>
                      Delete
                    </Button>
                  </Stack>
                </Stack>
              </Sheet>
            ))}
          </Stack>
        </Sheet>
      </Stack>
    </Box>
  );
}
