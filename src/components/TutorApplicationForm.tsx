import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TutorApplicationForm = () => {
  const navigate = useNavigate();

  // State variables to track user inputs
  const [name, setName] = useState(""); // Name of the applicant
  const [roles, setRoles] = useState<string[]>([]); // Selected roles
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]); // Selected courses
  const [availability, setAvailability] = useState(""); // Availability option
  const [skills, setSkills] = useState(""); // Skills input
  const [credentials, setCredentials] = useState(""); // Academic credentials

  // List of available courses to choose from
  const courseList = ["COSC2758", "COSC2531", "COSC2761"];

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: ensure all fields are filled
    if (!name || roles.length === 0 || selectedCourses.length === 0 || !availability || !skills || !credentials) {
      alert("Please fill in all fields.");
      return;
    }

    // Create a data object to store in localStorage
    const formData = {
      name,
      roles,
      selectedCourses,
      availability,
      skills,
      credentials,
    };

    // Save form data and navigate to the review panel
    localStorage.setItem("tutorApplication", JSON.stringify(formData));
    alert("Application submitted!");
    navigate("/panel"); // Navigate to lecturer review panel
  };

  // Handler to toggle checkbox selections for roles and courses
  const handleCheckboxChange = (
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value)); // Remove if already selected
    } else {
      setList([...list, value]); // Add to selection
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 border rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Tutor Application Form</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input field for applicant name */}
        <div>
          <label className="block font-semibold mb-1">Your Name:</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g. Zehua Liu"
          />
        </div>

        {/* Role selection checkboxes */}
        <div>
          <label className="block font-semibold mb-1">Select Roles:</label>
          <div className="flex gap-4">
            {["Tutor", "Lab Assistant"].map(role => (
              <label key={role}>
                <input
                  type="checkbox"
                  checked={roles.includes(role)}
                  onChange={() => handleCheckboxChange(role, roles, setRoles)}
                  className="mr-1"
                />
                {role}
              </label>
            ))}
          </div>
        </div>

        {/* Course selection checkboxes */}
        <div>
          <label className="block font-semibold mb-1">Select Courses:</label>
          <div className="flex flex-wrap gap-4">
            {courseList.map(course => (
              <label key={course}>
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course)}
                  onChange={() => handleCheckboxChange(course, selectedCourses, setSelectedCourses)}
                  className="mr-1"
                />
                {course}
              </label>
            ))}
          </div>
        </div>

        {/* Availability dropdown */}
        <div>
          <label className="block font-semibold mb-1">Availability:</label>
          <select
            value={availability}
            onChange={e => setAvailability(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select --</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Casual">Casual</option>
          </select>
        </div>

        {/* Skills input */}
        <div>
          <label className="block font-semibold mb-1">Skills:</label>
          <textarea
            value={skills}
            onChange={e => setSkills(e.target.value)}
            className="w-full border p-2 rounded"
            rows={2}
            placeholder="e.g. React, TypeScript, Java"
          />
        </div>

        {/* Academic credentials input */}
        <div>
          <label className="block font-semibold mb-1">Academic Credentials:</label>
          <textarea
            value={credentials}
            onChange={e => setCredentials(e.target.value)}
            className="w-full border p-2 rounded"
            rows={2}
            placeholder="e.g. Master of IT at RMIT"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default TutorApplicationForm;
