import React from "react";
import { useState } from "react";

// Interface defining the structure of each applicant
interface Applicant {
  name: string;
  course: string;
  availability: string;
  skills: string;
}

// Sample data for demonstration
const fakeData: Applicant[] = [
  { name: "Alice", course: "COSC2758", availability: "Part-time", skills: "React, CSS" },
  { name: "Bob", course: "COSC2531", availability: "Full-time", skills: "Java, Spring" },
  { name: "Charlie", course: "COSC2761", availability: "Casual", skills: "Python, Django" },
];

const ApplicantList = () => {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [list, setList] = useState<Applicant[]>(fakeData);

  // Filter applicants based on search query across multiple fields
  const filteredList = list.filter((item) =>
    [item.name, item.course, item.availability, item.skills]
      .some(field => field.toLowerCase().includes(query.toLowerCase()))
  );

  // Sort applicants based on selected field
  const sortedList = [...filteredList].sort((a, b) => {
    if (!sortBy) return 0;
    return a[sortBy as keyof Applicant].localeCompare(b[sortBy as keyof Applicant]);
  });

  return (
    <div className="p-6 max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">List of Applicants</h2>

      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by course / name / availability / skills..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded flex-grow"
        />

        <select
          className="border p-2 rounded w-48"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">-- Sort By --</option>
          <option value="course">Course Name</option>
          <option value="availability">Availability</option>
        </select>
      </div>

      {/* Render applicant list */}
      <ul className="space-y-3">
        {sortedList.map((item, idx) => (
          <li key={idx} className="border p-4 rounded shadow">
            <strong>{item.name}</strong> - {item.course} - {item.availability}<br />
            <em>Skills: {item.skills}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicantList;
