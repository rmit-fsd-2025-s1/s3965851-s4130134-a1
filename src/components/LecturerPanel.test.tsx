import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LecturerPanel from "./LecturerPanel";

// ✅ Unit tests covering five core scenarios: rendering, selection, input display, rank update, and localStorage error handling

describe("LecturerPanel Component", () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure isolated state
    localStorage.clear();
  });

  test("renders the Lecturer Review Panel heading", () => {
    // Check if the panel heading renders correctly
    render(<LecturerPanel />);
    expect(screen.getByText(/Lecturer Review Panel/i)).toBeInTheDocument();
  });

  test("allows selecting and unselecting a candidate", async () => {
    // Test the checkbox toggle functionality for candidate selection
    render(<LecturerPanel />);
    const checkboxes = await screen.findAllByLabelText(/Select Candidate/);
    const first = checkboxes[0];

    fireEvent.click(first);
    expect(first).toBeChecked();

    fireEvent.click(first);
    expect(first).not.toBeChecked();
  });

  test("shows comment and rank input when a candidate is selected", async () => {
    // Test whether Comment and Rank input fields appear upon selection
    render(<LecturerPanel />);
    const checkboxes = await screen.findAllByLabelText(/Select Candidate/);

    fireEvent.click(checkboxes[0]);

    const commentInput = await screen.findByLabelText("Comment:");
    const rankInput = await screen.findByLabelText("Rank (1-5):");

    expect(commentInput).toBeInTheDocument();
    expect(rankInput).toBeInTheDocument();
  });

  test("updates rank and stores it in localStorage", async () => {
    // Test whether rank changes are correctly stored in localStorage
    render(<LecturerPanel />);
    const checkboxes = await screen.findAllByLabelText(/Select Candidate/);

    fireEvent.click(checkboxes[0]);
    const rankInput = await screen.findByLabelText("Rank (1-5):");

    fireEvent.change(rankInput, { target: { value: "3" } });
    expect(rankInput).toHaveValue(3);

    const stored = JSON.parse(localStorage.getItem("selectedReviewData") || "[]");
    expect(stored[0].rank).toBe(3);
  });

  test("does not crash with malformed localStorage", () => {
    // Test that invalid localStorage content does not cause a crash
    localStorage.setItem("selectedReviewData", "{ invalid json }");

    expect(() => {
      render(<LecturerPanel />);
    }).not.toThrow();
  });
});
