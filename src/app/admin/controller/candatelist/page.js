"use client";

import * as React from "react";
import axios from "axios";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import Slider from "../../components/slider";

export default function Candidatelist() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await axios.get("/api/sign");
        if (!cancelled) setRows(response.data.data || []);
      } catch (error) {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.body", p: { xs: 2, md: 3 } }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="flex-start">
        <Slider />
        <Sheet variant="outlined" sx={{ flex: 1, width: "100%", p: { xs: 2, sm: 3 }, borderRadius: "md", overflow: "auto" }}>
          <Typography level="h3" sx={{ mb: 2 }}>
            Candidates
          </Typography>
          {loading ? (
            <Typography level="body-md">Loading…</Typography>
          ) : rows.length === 0 ? (
            <Typography level="body-md" sx={{ color: "text.tertiary" }}>
              No candidates yet.
            </Typography>
          ) : (
            <Table aria-label="candidates" stripe="odd" hoverRow>
              <thead>
                <tr>
                  <th style={{ width: "22%" }}>Name</th>
                  <th style={{ width: "38%" }}>Email</th>
                  <th style={{ width: "20%" }}>Score</th>
                  <th style={{ width: "20%" }}>Correct</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr key={item._id}>
                    <td>{item.Name || "—"}</td>
                    <td>{item.email}</td>
                    <td>{item.score}</td>
                    <td>{item.attempt}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Sheet>
      </Stack>
    </Box>
  );
}
