"use client";

import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Textarea from "@mui/joy/Textarea";
import Typography from "@mui/joy/Typography";
import Slider from "../../components/slider";

export default function Create() {
  const [question, setQuestion] = React.useState("");
  const [option1, setOption1] = React.useState("");
  const [option2, setOption2] = React.useState("");
  const [option3, setOption3] = React.useState("");
  const [option4, setOption4] = React.useState("");
  const [correctAnswer, setCorrectAnswer] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);
    try {
      const options = [option1, option2, option3, option4];
      const res = await fetch("/api/Question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          options,
          correctAnswer,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("Question saved.");
      setQuestion("");
      setOption1("");
      setOption2("");
      setOption3("");
      setOption4("");
      setCorrectAnswer("");
    } catch (error) {
      setStatus("Could not save. Check the server and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.body", p: { xs: 2, md: 3 } }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="flex-start">
        <Slider />
        <Sheet variant="outlined" sx={{ flex: 1, width: "100%", p: { xs: 2, sm: 3 }, borderRadius: "md" }}>
          <Typography level="h3" sx={{ mb: 2 }}>
            New question
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormControl required>
                <FormLabel>Prompt</FormLabel>
                <Textarea
                  minRows={4}
                  value={question}
                  onChange={(ev) => setQuestion(ev.target.value)}
                  placeholder="What do you want candidates to answer?"
                />
              </FormControl>
              <FormControl required>
                <FormLabel>Option A</FormLabel>
                <Input value={option1} onChange={(ev) => setOption1(ev.target.value)} />
              </FormControl>
              <FormControl required>
                <FormLabel>Option B</FormLabel>
                <Input value={option2} onChange={(ev) => setOption2(ev.target.value)} />
              </FormControl>
              <FormControl required>
                <FormLabel>Option C</FormLabel>
                <Input value={option3} onChange={(ev) => setOption3(ev.target.value)} />
              </FormControl>
              <FormControl required>
                <FormLabel>Option D</FormLabel>
                <Input value={option4} onChange={(ev) => setOption4(ev.target.value)} />
              </FormControl>
              <FormControl required>
                <FormLabel>Correct answer</FormLabel>
                <Input
                  value={correctAnswer}
                  onChange={(ev) => setCorrectAnswer(ev.target.value)}
                  placeholder="Must match one option exactly"
                />
              </FormControl>
              {status ? (
                <Typography level="body-sm" color={status.includes("Could not") ? "danger" : "success"}>
                  {status}
                </Typography>
              ) : null}
              <Button type="submit" loading={loading}>
                Save question
              </Button>
            </Stack>
          </form>
        </Sheet>
      </Stack>
    </Box>
  );
}
