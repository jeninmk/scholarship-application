"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const greekLifeOptions = [
  "Alpha Chi Omega",
  "Alpha Delta Pi",
  "Alpha Epsilon Phi",
  "Alpha Gamma Rho",
  "Alpha Kappa Alpha Sorority, Inc.",
  "Alpha Phi",
  "Alpha Phi Alpha Fraternity, Inc.",
  "Alpha Phi Gamma Sorority, Inc.",
  "Alpha Sigma Alpha",
  "Beta Theta Pi",
  "Chi Omega",
  "Delta Chi",
  "Delta Gamma",
  "Delta Kappa Epsilon",
  "Delta Lambda Phi Social Fraternity",
  "Delta Sigma Phi",
  "Delta Sigma Theta Sorority, Inc.",
  "Delta Tau Delta",
  "Gamma Alpha Omega Sorority, Inc.",
  "Gamma Phi Beta",
  "Gamma Rho Lambda National Sorority",
  "Kappa Alpha Order",
  "Kappa Alpha Psi Fraternity, Inc.",
  "Kappa Alpha Theta",
  "Kappa Delta Chi Sorority, Inc.",
  "Kappa Kappa Gamma",
  "Kappa Sigma",
  "Lambda Sigma Upsilon Latino Fraternity, Inc.",
  "Lambda Theta Alpha Latin Sorority, Inc.",
  "Lambda Theta Phi Latin Fraternity, Inc.",
  "Omega Delta Phi Fraternity, Inc.",
  "Omega Psi Phi Fraternity, Inc.",
  "Phi Beta Sigma Fraternity, Inc.",
  "Phi Delta Theta",
  "Phi Gamma Delta",
  "Phi Sigma Rho",
  "Pi Beta Phi",
];

const clubOptions = {
  "STEM-Focused Clubs": [
    "Engineers Without Borders",
    "M.E.Ch.A",
    "The Microbiology Club",
    "Student Optics Chapter",
    "Women in Medicine and Science",
  ],
  "Athletes & Adventurers": [
    "Arizona Club Golf",
    "Arizona Cycling",
    "Elevation Ski and Snowboard Club",
    "Men's Ultimate Frisbee",
    "Ramblers Hiking Club",
  ],
  "Professional Development": [
    "American Marketing Association",
    "Arizona Model United Nations",
    "Google Developer Student Club",
    "PULSE Cat Pre-Health Ambassadors",
    "Pre-Pharmacy Club",
  ],
  "Special Interest Clubs": [
    "Arizona Esports and Gaming",
    "Arizona SkyCats Skydiving Club",
    "Comedy Corner",
    "Financial Freedom Club",
    "Wildcat Formula Racing",
  ],
  "Health & Wellness": [
    "Arizona Global Health Project",
    "Arizona MEDLIFE",
    "Healthy and Active Minds Society",
    "Meditation Cats",
    "Veggie Cats",
  ],
  "Creative Clubs": [
    "Arizona Swing Cats",
    "Art ClayWorks",
    "Black N' Blue Hip Hop Crew",
    "Photography Club",
    "University Filmmakers Organization",
  ],
};

export default function StudentInfo() {
  const router = useRouter();

  const [student, setStudent] = useState({
    college: "",
    year: "freshman",
    gpa: "",
    major: "",
    greekAffiliation: "",
    clubs: "",
  });

  useEffect(() => {
    const storedStudentInfo = localStorage.getItem("studentInfo");
    if (storedStudentInfo) {
      setStudent(JSON.parse(storedStudentInfo));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("studentInfo", JSON.stringify(student)); // Store student info
    router.push("/scholarships"); // Redirect to scholarships page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-[#1e5288] mb-6">
        Enter Your Student Information
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-96"
      >
        <label className="block mb-2 text-gray-700">
          College:
          <input
            type="text"
            name="college"
            value={student.college}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </label>

        <label className="block mb-2 text-gray-700">
          Year:
          <select
            name="year"
            value={student.year}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="freshman">Freshman</option>
            <option value="sophomore">Sophomore</option>
            <option value="junior">Junior</option>
            <option value="senior">Senior</option>
          </select>
        </label>

        <label className="block mb-2 text-gray-700">
          GPA:
          <input
            type="number"
            step="0.01"
            name="gpa"
            value={student.gpa}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </label>

        <label className="block mb-2 text-gray-700">
          Major:
          <input
            type="text"
            name="major"
            value={student.major}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </label>

        <label className="block mb-4 text-gray-700">
          Greek Affiliation:
          <select
            name="greekAffiliation"
            value={student.greekAffiliation}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="">None</option>
            {greekLifeOptions.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>
        </label>

        <label className="block mb-4 text-gray-700">
          Clubs:
          <select
            name="clubs"
            value={student.clubs}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="">Select a Club</option>
            {Object.entries(clubOptions).map(([category, clubs]) => (
              <optgroup key={category} label={category}>
                {clubs.map((club) => (
                  <option key={club} value={club}>
                    {club}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="w-full bg-[#1e5288] text-white p-2 rounded hover:bg-[#143a63]"
        >
          Submit & Find Scholarships
        </button>
      </form>
    </div>
  );
}
