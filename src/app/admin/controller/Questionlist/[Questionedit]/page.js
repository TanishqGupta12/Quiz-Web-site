"use client";

import * as React from "react";
import axios from "axios";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Textarea from "@mui/joy/Textarea";
import Typography from "@mui/joy/Typography";
import Slider from "../../../components/slider";

export default function Questionedit({ params }) {
  const [question, setQuestion] = React.useState("");
  const [options, setOptions] = React.useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = React.useState("");
  const [notice, setNotice] = React.useState("");

  React.useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await axios.get(`/api/Question/${params.Questionedit}`);
        const doc = response.data.data;
        setQuestion(doc.question || "");
        const opts = doc.options || [];
        setOptions([0, 1, 2, 3].map((i) => opts[i] || ""));
        setCorrectAnswer(doc.correctAnswer || "");
      } catch (error) {
        setNotice("Could not load this question.");
      }
    };
    getQuestions();
  }, [params.Questionedit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice("");
    const updatedQuestion = {
      question,
      options,
      correctAnswer,
    };
    try {
      await axios.put(`/api/Question/${params.Questionedit}`, updatedQuestion);
      setNotice("Saved.");
    } catch (error) {
      setNotice("Update failed.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.body", p: { xs: 2, md: 3 } }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="flex-start">
        <Slider />
        <Sheet variant="outlined" sx={{ flex: 1, width: "100%", p: { xs: 2, sm: 3 }, borderRadius: "md" }}>
          <Typography level="h3" sx={{ mb: 2 }}>
            Edit question
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormControl required>
                <FormLabel>Prompt</FormLabel>
                <Textarea minRows={4} value={question} onChange={(ev) => setQuestion(ev.target.value)} />
              </FormControl>
              {options.map((option, index) => (
                <FormControl key={index} required>
                  <FormLabel>{`Option ${index + 1}`}</FormLabel>
                  <Input
                    value={option}
                    onChange={(ev) => {
                      const next = [...options];
                      next[index] = ev.target.value;
                      setOptions(next);
                    }}
                  />
                </FormControl>
              ))}
              <FormControl required>
                <FormLabel>Correct answer</FormLabel>
                <Input value={correctAnswer} onChange={(ev) => setCorrectAnswer(ev.target.value)} />
              </FormControl>
              {notice ? (
                <Typography level="body-sm" color={notice.includes("Could not") || notice.includes("failed") ? "danger" : "success"}>
                  {notice}
                </Typography>
              ) : null}
              <Button type="submit">Save changes</Button>
            </Stack>
          </form>
        </Sheet>
      </Stack>
    </Box>
  );
}
