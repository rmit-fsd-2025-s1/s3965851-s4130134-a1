import React, { useEffect, useState } from "react";

// Interface defining structure for each applicant
interface Applicant {
  name: string;
  course: string;
  availability: string;
  skills: string;
  credentials: string;
}

// Interface for selected applicant data
interface Selected {
  name: string;
  comment: string;
  rank: number;
  unselected?: boolean;
}

// Hook to calculate visual status (Most/Least/Unchosen) based on selection ranks
const useSelectionStats = (applicants: Applicant[], selected: Selected[]) => {
  const selectedWithRank = selected
    .filter(sel => !sel.unselected)
    .map(sel => ({ name: sel.name, rank: sel.rank }));

  const ranks = selectedWithRank.map(s => s.rank);

  // No selected candidates: everyone is unchosen
  if (ranks.length === 0) {
    return applicants.map(app => ({ ...app, isMostChosen: false, isLeastChosen: false, isUnchosen: true }));
  }

  const minRank = Math.min(...ranks);
  const maxRank = Math.max(...ranks);

  // Group names by rank to handle multiple selections with same value
  const rankGroups = selectedWithRank.reduce<Record<number, string[]>>((acc, sel) => {
    if (!acc[sel.rank]) acc[sel.rank] = [];
    acc[sel.rank].push(sel.name);
    return acc;
  }, {});

  return applicants.map(app => {
    const selectedInfo = selectedWithRank.find(s => s.name === app.name);
    const totalSelected = selectedWithRank.length;

    let isMostChosen = false;
    let isLeastChosen = false;

    // Decision logic for ranking labels
    if (selectedInfo) {
      if (totalSelected === 1) {
        isMostChosen = true;
      } else if (totalSelected === 2 && selectedInfo.rank === minRank) {
        isMostChosen = true;
      } else if (totalSelected === 3) {
        if (selectedInfo.rank === minRank) {
          isMostChosen = true;
        } else if (rankGroups[selectedInfo.rank].length === 2 && selectedInfo.rank === maxRank) {
          isLeastChosen = true;
        }
      }
    }

    return {
      ...app,
      isMostChosen,
      isLeastChosen,
      isUnchosen: !selectedInfo
    };
  });
};

const LecturerPanel = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selected, setSelected] = useState<Selected[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load fake + real applicant data from localStorage
  useEffect(() => {
    if (applicants.length > 0) return;

    const stored = localStorage.getItem("tutorApplication");
    const baseApplicants: Applicant[] = [];

    if (stored) {
      const data = JSON.parse(stored);
      baseApplicants.push({
        name: data.name?.trim() || "Test User",
        course: data.selectedCourses.join(", "),
        availability: data.availability,
        skills: data.skills,
        credentials: data.credentials
      });
    }

    // Hardcoded demo applicants for testing
    baseApplicants.push(
      {
        name: "Leo Wang",
        course: "COSC2761",
        availability: "Full-time",
        skills: "Java, Spring Boot",
        credentials: "Bachelor of CS"
      },
      {
        name: "Jess Smith",
        course: "COSC2531",
        availability: "Casual",
        skills: "Python, Django",
        credentials: "PhD in AI"
      }
    );

    setApplicants(baseApplicants);
  }, [applicants]);

  // Load previous review data if available
  useEffect(() => {
    const storedReview = localStorage.getItem("selectedReviewData");
    if (storedReview) {
      try {
        const parsed = JSON.parse(storedReview);
        if (Array.isArray(parsed)) {
          setSelected(parsed);
        }
      } catch (err) {
        console.error("Error loading review data");
      }
    }
    setInitialized(true);
  }, []);

  // Persist review data when state changes
  useEffect(() => {
    if (initialized) {
      localStorage.setItem("selectedReviewData", JSON.stringify(selected));
    }
  }, [selected, initialized]);

  // Toggle selection status and reset inputs if unselected
  const toggleSelect = (name: string) => {
    setSelected(prev => {
      const found = prev.find(sel => sel.name === name);
      if (found) {
        return prev.map(sel =>
          sel.name === name
            ? { ...sel, unselected: !sel.unselected, comment: "", rank: 1 }
            : sel
        );
      } else {
        return [...prev, { name, comment: "", rank: 1, unselected: false }];
      }
    });
  };

  // Update individual fields for comment and rank
  const updateComment = (name: string, comment: string) => {
    setSelected(prev =>
      prev.map(sel => (sel.name === name ? { ...sel, comment } : sel))
    );
  };

  const updateRank = (name: string, rank: number) => {
    setSelected(prev =>
      prev.map(sel => (sel.name === name ? { ...sel, rank } : sel))
    );
  };

  const applicantStats = useSelectionStats(applicants, selected);

  return (
    <div className="p-6 max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Lecturer Review Panel
      </h2>

      {applicantStats.length === 0 ? (
        <p className="text-center text-gray-600">No applicant data found.</p>
      ) : (
        <ul className="space-y-4">
          {applicantStats.map((app, idx) => {
            const selData = selected.find(sel => sel.name === app.name);
            const isSelected = selData && !selData.unselected;

            return (
              <li
                key={idx}
                className={`border p-4 rounded shadow relative ${
                  app.isMostChosen
                    ? "border-green-600 bg-green-50"
                    : app.isLeastChosen
                    ? "border-yellow-500 bg-yellow-50"
                    : app.isUnchosen
                    ? "border-gray-400 bg-gray-100"
                    : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-lg">
                    {app.name} {isSelected && <span className="text-green-600">✅</span>}
                  </p>
                  {isSelected && selData && (
                    <span className="text-sm font-bold text-white bg-blue-500 px-2 py-1 rounded">
                      Rank: {selData.rank}
                    </span>
                  )}
                </div>

                <p className="text-sm"><strong>Course:</strong> {app.course}</p>
                <p className="text-sm">
                  <strong>Availability:</strong>{" "}
                  <span className="inline-block px-2 py-0.5 rounded text-white text-xs bg-yellow-500">
                    {app.availability}
                  </span>
                </p>

                <p className="text-sm">
                  <strong>Skills:</strong>{" "}
                  {app.skills.split(",").map((s, i) => (
                    <span
                      key={i}
                      className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded mr-1"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </p>

                <p className="text-sm"><strong>Credentials:</strong> {app.credentials}</p>

                <div className="text-sm mt-2">
                  {app.isMostChosen && (
                    <span className="text-green-700 font-bold">🔥 Most Chosen</span>
                  )}
                  {app.isLeastChosen && (
                    <span className="text-yellow-700 font-bold">⚠️ Least Chosen</span>
                  )}
                  {app.isUnchosen && (
                    <span className="text-gray-700 italic">Not Selected</span>
                  )}
                </div>

                <div className="mt-3">
                  <label className="mr-4">
                    <input
                      type="checkbox"
                      checked={!!isSelected}
                      onChange={() => toggleSelect(app.name)}
                    /> Select Candidate
                  </label>
                </div>

                {isSelected && selData && (
                  <div className="mt-3 space-y-2">
                    <div>
                      <label htmlFor={`comment-${app.name}`} className="block font-semibold mb-1">
                        Comment:
                      </label>
                      <textarea
                        id={`comment-${app.name}`}
                        className="w-full border p-2 rounded"
                        value={selData.comment}
                        onChange={(e) => updateComment(app.name, e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor={`rank-${app.name}`} className="block font-semibold mb-1">
                        Rank (1-5):
                      </label>
                      <input
                        id={`rank-${app.name}`}
                        type="number"
                        min={1}
                        max={5}
                        className="border p-2 rounded w-24"
                        value={selData.rank}
                        onChange={(e) => updateRank(app.name, parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LecturerPanel;
export { useSelectionStats };
