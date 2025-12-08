// "use client";

// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// interface User {
//   id: number;
//   username: string;
//   role: string;
// }

// export default function DashboardPage() {
//   const router = useRouter();
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     const storedUsername = localStorage.getItem("username");

//     if (token && storedUsername) {
//       let role = "applicant"; // default role
//       const lower = storedUsername.toLowerCase();
//       if (lower.includes("admin")) role = "admin";
//       else if (lower.includes("donor")) role = "donor";
//       else if (lower.includes("reviewer")) role = "reviewer";
//       // note: student maps to applicant by default

//       setUser({
//         id: 0,
//         username: storedUsername,
//         role,
//       });
//     } else {
//       router.push("/");
//     }
//   }, [router]);

//   if (!user) {
//     return <p className="text-center mt-8">Loading...</p>;
//   }

//   const { role: currentRole } = user;

//   const getWelcomeMessage = () => {
//     switch (currentRole) {
//       case "admin":
//         return "Welcome, Admin. Here is your dashboard.";
//       case "donor":
//         return "Welcome, Donor. Here is your scholarship dashboard.";
//       case "reviewer":
//         return "Welcome, Reviewer. Here is your review dashboard.";
//       case "applicant":
//       default:
//         return "Welcome, Applicant. Here is your application dashboard.";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       {/* Top Red Bar */}
//       <header className="bg-gradient-to-r from-[#AB0520] to-[#9B051F] text-white py-3 px-4 shadow-md">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <img
//               src="/images/ua-logo.png"
//               alt="UA Logo"
//               className="h-10 w-auto"
//             />
//             <h1 className="text-xl font-bold">UASAMS</h1>
//           </div>
//           <nav className="flex items-center space-x-4">
//             <button
//               className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
//               onClick={() => {
//                 localStorage.removeItem("authToken");
//                 localStorage.removeItem("userRole");
//                 localStorage.removeItem("username");
//                 setUser(null);
//                 router.push("/");
//               }}
//             >
//               Sign Out
//             </button>
//           </nav>
//         </div>
//       </header>

//       {/* Welcome Section */}
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-semibold">Your Dashboard</h2>
//         <p className="text-sm text-gray-500">{getWelcomeMessage()}</p>
//       </div>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         {/* ADMIN WIDGETS */}
//         {currentRole === "admin" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
//             {/* Pending Role Requests */}
//             <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//               <h3 className="text-lg font-bold mb-4">Pending Role Requests</h3>
//               <p className="text-gray-700">
//                 Review pending role requests from users.
//               </p>
//               <button
//                 className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                 onClick={() => router.push("/admin/role-requests")}
//               >
//                 Review Requests
//               </button>
//             </div>
//             {/* User Management */}
//             <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//               <h3 className="text-lg font-bold mb-4">User Management</h3>
//               <p className="text-gray-700">
//                 Manage user accounts and unlock users.
//               </p>
//               <button
//                 className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                 onClick={() => router.push("/users")}
//               >
//                 Manage Users
//               </button>
//             </div>
//             {/* Scholarship Management */}
//             <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//               <h3 className="text-lg font-bold mb-4">Scholarship Management</h3>
//               <p className="text-gray-700">
//                 Manage and update scholarship details.
//               </p>
//               <button
//                 className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                 onClick={() => router.push("/admin/scholarships")}
//               >
//                 Manage Scholarships
//               </button>
//             </div>
//             {/* Application Management */}
//             <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//               <h3 className="text-lg font-bold mb-4">Application Management</h3>
//               <p className="text-gray-700">
//                 Review and manage submitted applications.
//               </p>
//               <button
//                 className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                 onClick={() => router.push("/admin/applicationmanagement")}
//               >
//                 Manage Applications
//               </button>
//             </div>
//           </div>
//         )}

//         {/* DONOR WIDGETS */}
//         {currentRole === "donor" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
//             {/* My Scholarships Overview */}
//             <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//               <h3 className="text-lg font-bold mb-4">
//                 My Scholarships Overview
//               </h3>
//               <p className="text-gray-700">
//                 Overview of your active scholarships.
//               </p>
//               <button
//                 className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                 onClick={() => router.push("/donor/scholarships")}
//               >
//                 View Scholarships
//               </button>
//             </div>
//             {/* Application Snapshot */}
//             <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//               <h3 className="text-lg font-bold mb-4">Application Snapshot</h3>
//               <p className="text-gray-700">Snapshot of recent applications.</p>
//               <button
//                 className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                 onClick={() => router.push("/donor/applications")}
//               >
//                 View Applications
//               </button>
//             </div>
//             {/* Donation Impact */}
//             <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//               <h3 className="text-lg font-bold mb-4">Donation Impact Report</h3>
//               <p className="text-gray-700">
//                 Impact of your donations on recipients.
//               </p>
//             </div>
//             {/* Feedback Inbox */}
//             <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//               <h3 className="text-lg font-bold mb-4">Feedback Inbox</h3>
//               <p className="text-gray-700">
//                 View feedback regarding your scholarships.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* APPLICANT WIDGETS */}
//         {currentRole === "applicant" && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {/* All Scholarships */}
//               <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//                 <h3 className="text-lg font-bold mb-4">All Scholarships</h3>
//                 <p className="text-gray-700">
//                   Countdown to next application deadline.
//                 </p>
//                 <button
//                   className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                   onClick={() => router.push("/scholarships")}
//                 >
//                   View Details
//                 </button>
//               </div>
//               {/* Matched Scholarships */}
//               <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//                 <h3 className="text-lg font-bold mb-4">Matched Scholarships</h3>
//                 <p className="text-gray-700">
//                   Track progress of your applications.
//                 </p>
//                 <button
//                   className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                   onClick={() => router.push("/MatchedApplications")}
//                 >
//                   View Details
//                 </button>
//               </div>
//               {/* Document Checklist */}
//               <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//                 <h3 className="text-lg font-bold mb-4">
//                   Document Checklist & Upload
//                 </h3>
//                 <p className="text-gray-700">Track uploaded documents.</p>
//                 <button
//                   className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                   onClick={() => router.push("/UploadDocument")}
//                 >
//                   View Documents
//                 </button>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 gap-8 mt-8">
//               {/* My Applications */}
//               <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72 max-w-md mx-auto">
//                 <h3 className="text-lg font-bold mb-4">My Applications</h3>
//                 <p className="text-gray-700">
//                   View your submitted application history.
//                 </p>
//                 <button
//                   className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                   onClick={() => router.push("/MyApplications")}
//                 >
//                   View History
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </main>
//     </div>
//   );
// }

// "use client";

// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { Bell } from "lucide-react";

// interface User {
//   id: number;
//   username: string;
//   role: string;
// }

// export default function DashboardPage() {
//   const router = useRouter();
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     const storedUsername = localStorage.getItem("username");

//     if (token && storedUsername) {
//       let role = "applicant"; // default role
//       const lower = storedUsername.toLowerCase();
//       if (lower.includes("admin")) role = "admin";
//       else if (lower.includes("donor")) role = "donor";
//       else if (lower.includes("reviewer")) role = "reviewer";

//       setUser({
//         id: 0,
//         username: storedUsername,
//         role,
//       });
//     } else {
//       router.push("/");
//     }
//   }, [router]);

//   if (!user) {
//     return <p className="text-center mt-8">Loading...</p>;
//   }

//   const { role: currentRole } = user;

//   const getWelcomeMessage = () => {
//     switch (currentRole) {
//       case "admin":
//         return "Welcome, Admin. Here is your dashboard.";
//       case "donor":
//         return "Welcome, Donor. Here is your scholarship dashboard.";
//       case "reviewer":
//         return "Welcome, Reviewer. Here is your review dashboard.";
//       case "applicant":
//       default:
//         return "Welcome, Applicant. Here is your application dashboard.";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       {/* Top Red Bar */}
//       <header className="bg-gradient-to-r from-[#AB0520] to-[#9B051F] text-white py-3 px-4 shadow-md">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <img
//               src="/images/ua-logo.png"
//               alt="UA Logo"
//               className="h-10 w-auto"
//             />
//             <h1 className="text-xl font-bold">UASAMS</h1>
//           </div>
//           <nav className="flex items-center space-x-4">
//             {/* Notification Bell for all users */}
//             <button
//               className="relative p-1 hover:text-gray-200 transition"
//               onClick={() => router.push("/notifications")}
//             >
//               <Bell size={24} />
//               <span className="absolute top-0 right-0 inline-flex w-2 h-2 bg-red-500 rounded-full" />
//             </button>
//             {/* Reports button */}
//             <button
//               className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
//               onClick={() => router.push("/reports")}
//             >
//               Reports
//             </button>
//             {/* Sign Out */}
//             <button
//               className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
//               onClick={() => {
//                 localStorage.removeItem("authToken");
//                 localStorage.removeItem("userRole");
//                 localStorage.removeItem("username");
//                 setUser(null);
//                 router.push("/");
//               }}
//             >
//               Sign Out
//             </button>
//           </nav>
//         </div>
//       </header>

//       {/* Welcome Section */}
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-semibold">Your Dashboard</h2>
//         <p className="text-sm text-gray-500">{getWelcomeMessage()}</p>
//       </div>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         {/* ADMIN WIDGETS */}
//         {currentRole === "admin" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
//             {/* Pending Role Requests */}
//             <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//               <h3 className="text-lg font-bold mb-4">Pending Role Requests</h3>
//               <p className="text-gray-700">
//                 Review pending role requests from users.
//               </p>
//               <button
//                 className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                 onClick={() => router.push("/admin/role-requests")}
//               >
//                 Review Requests
//               </button>
//             </div>
//             {/* User Management */}
//             <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//               <h3 className="text-lg font-bold mb-4">User Management</h3>
//               <p className="text-gray-700">
//                 Manage user accounts and unlock users.
//               </p>
//               <button
//                 className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                 onClick={() => router.push("/users")}
//               >
//                 Manage Users
//               </button>
//             </div>
//             {/* Scholarship Management */}
//             <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//               <h3 className="text-lg font-bold mb-4">Scholarship Management</h3>
//               <p className="text-gray-700">
//                 Manage and update scholarship details.
//               </p>
//               <button
//                 className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                 onClick={() => router.push("/admin/scholarships")}
//               >
//                 Manage Scholarships
//               </button>
//             </div>
//             {/* Application Management */}
//             <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//               <h3 className="text-lg font-bold mb-4">Application Management</h3>
//               <p className="text-gray-700">
//                 Review and manage submitted applications.
//               </p>
//               <button
//                 className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                 onClick={() => router.push("/admin/applicationmanagement")}
//               >
//                 Manage Applications
//               </button>
//             </div>
//           </div>
//         )}

//         {/* DONOR WIDGETS */}
//         {currentRole === "donor" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
//             {/* My Scholarships Overview */}
//             <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//               <h3 className="text-lg font-bold mb-4">
//                 My Scholarships Overview
//               </h3>
//               <p className="text-gray-700">
//                 Overview of your active scholarships.
//               </p>
//               <button
//                 className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                 onClick={() => router.push("/donor/scholarships")}
//               >
//                 View Scholarships
//               </button>
//             </div>
//             {/* Application Snapshot */}
//             <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//               <h3 className="text-lg font-bold mb-4">Application Snapshot</h3>
//               <p className="text-gray-700">Snapshot of recent applications.</p>
//               <button
//                 className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                 onClick={() => router.push("/donor/applications")}
//               >
//                 View Applications
//               </button>
//             </div>
//             {/* Donation Impact */}
//             <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//               <h3 className="text-lg font-bold mb-4">Donation Impact Report</h3>
//               <p className="text-gray-700">
//                 Impact of your donations on recipients.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* APPLICANT WIDGETS */}
//         {currentRole === "applicant" && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {/* All Scholarships */}
//               <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//                 <h3 className="text-lg font-bold mb-4">All Scholarships</h3>
//                 <p className="text-gray-700">
//                   Countdown to next application deadline.
//                 </p>
//                 <button
//                   className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                   onClick={() => router.push("/scholarships")}
//                 >
//                   View Details
//                 </button>
//               </div>
//               {/* Matched Scholarships */}
//               <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//                 <h3 className="text-lg font-bold mb-4">Matched Scholarships</h3>
//                 <p className="text-gray-700">
//                   Track progress of your applications.
//                 </p>
//                 <button
//                   className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                   onClick={() => router.push("/MatchedApplications")}
//                 >
//                   View Details
//                 </button>
//               </div>
//               {/* Document Checklist */}
//               <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72">
//                 <h3 className="text-lg font-bold mb-4">
//                   Document Checklist & Upload
//                 </h3>
//                 <p className="text-gray-700">Track uploaded documents.</p>
//                 <button
//                   className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                   onClick={() => router.push("/UploadDocument")}
//                 >
//                   View Documents
//                 </button>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 gap-8 mt-8">
//               {/* My Applications */}
//               <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-72 max-w-md mx-auto">
//                 <h3 className="text-lg font-bold mb-4">My Applications</h3>
//                 <p className="text-gray-700">
//                   View your submitted application history.
//                 </p>
//                 <button
//                   className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 transition mt-4"
//                   onClick={() => router.push("/MyApplications")}
//                 >
//                   View History
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </main>
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";

interface User {
  id: number;
  username: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const navRef = useRef<HTMLDivElement>(null);

  // Load user & initialize notifications
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUsername = localStorage.getItem("username");
    if (token && storedUsername) {
      let role = "applicant";
      const lower = storedUsername.toLowerCase();
      if (lower.includes("admin")) role = "admin";
      else if (lower.includes("donor")) role = "donor";
      else if (lower.includes("reviewer")) role = "reviewer";

      setUser({ id: 0, username: storedUsername, role });
      // set initial notes
      const initial = (() => {
        switch (role) {
          case "admin":
            return [
              'User "jdoe" requested reviewer role.',
              "Monthly user report is available.",
              'Scholarship "Excellence" ends today.',
            ];
          case "donor":
            return [
              '3 new applications for "STEM Innovators".',
              'Reminder: Review "Future Leaders" by May 5.',
            ];
          case "reviewer":
            return [
              "5 applications awaiting your review.",
              "Review criteria updated today.",
              "Team meeting at 3 PM in Room 210.",
            ];
          default:
            return [
              'Your application for "Excellence Award" was received.',
              'Upload transcript for "Future Scholarships".',
              'Deadline: "Innovation Grant" on June 1.',
            ];
        }
      })();
      setNotes(initial);
    } else {
      router.push("/");
    }
  }, [router]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return <p className="text-center mt-8">Loading...</p>;

  const { role: currentRole } = user;

  const getWelcomeMessage = () => {
    switch (currentRole) {
      case "admin":
        return "Welcome, Admin. Here is your dashboard.";
      case "donor":
        return "Welcome, Donor. Here is your scholarship dashboard.";
      case "reviewer":
        return "Welcome, Reviewer. Here is your review dashboard.";
      default:
        return "Welcome, Applicant. Here is your application dashboard.";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-gradient-to-r from-[#AB0520] to-[#9B051F] text-white py-3 px-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/images/ua-logo.png" alt="UA Logo" className="h-10" />
            <h1 className="text-xl font-bold">UASAMS</h1>
          </div>
          <nav className="flex items-center space-x-4 relative" ref={navRef}>
            {/* Notification Bell */}
            <button
              className="relative p-1 hover:text-gray-200 transition"
              onClick={() => setShowNotifications((v) => !v)}
            >
              <Bell size={24} />
              {notes.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            {showNotifications && notes.length > 0 && (
              <div className="absolute right-0 top-12 w-80 bg-white text-black shadow-lg rounded-lg overflow-hidden z-20">
                <div className="bg-[#AB0520] text-white px-4 py-2 font-semibold">
                  Notifications
                </div>
                <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                  {notes.map((msg, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        // remove this notification
                        setNotes((ns) => ns.filter((_, idx) => idx !== i));
                      }}
                    >
                      {msg}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Reports */}
            <button
              className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
              onClick={() => router.push("/reports")}
            >
              Reports
            </button>
            {/* Sign Out */}
            <button
              className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
              onClick={() => {
                localStorage.removeItem("authToken");
                localStorage.removeItem("username");
                setUser(null);
                router.push("/");
              }}
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      {/* Welcome */}
      <div className="text-center my-8">
        <h2 className="text-2xl font-semibold">Your Dashboard</h2>
        <p className="text-gray-500">{getWelcomeMessage()}</p>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-6">
        {/* ADMIN WIDGETS */}
        {currentRole === "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6 text-center min-h-72">
              <h3 className="text-lg font-bold mb-4">Pending Role Requests</h3>
              <p className="text-gray-700">Review pending role requests.</p>
              <button
                className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 mt-4"
                onClick={() => router.push("/admin/role-requests")}
              >
                Review Requests
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center min-h-72">
              <h3 className="text-lg font-bold mb-4">User Management</h3>
              <p className="text-gray-700">Manage user accounts.</p>
              <button
                className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 mt-4"
                onClick={() => router.push("/users")}
              >
                Manage Users
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center min-h-72">
              <h3 className="text-lg font-bold mb-4">Scholarship Management</h3>
              <p className="text-gray-700">Manage scholarships.</p>
              <button
                className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 mt-4"
                onClick={() => router.push("/admin/scholarships")}
              >
                Manage Scholarships
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center min-h-72">
              <h3 className="text-lg font-bold mb-4">Application Management</h3>
              <p className="text-gray-700">Review applications.</p>
              <button
                className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 mt-4"
                onClick={() => router.push("/admin/applicationmanagement")}
              >
                Manage Applications
              </button>
            </div>
          </div>
        )}

        {/* DONOR WIDGETS (2 only, resized) */}
        {currentRole === "donor" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6 text-center min-h-72">
              <h3 className="text-lg font-bold mb-4">My Scholarships</h3>
              <p className="text-gray-700">Overview of your scholarships.</p>
              <button
                className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 mt-4"
                onClick={() => router.push("/donor/scholarships")}
              >
                View Scholarships
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center min-h-72">
              <h3 className="text-lg font-bold mb-4">Application Snapshot</h3>
              <p className="text-gray-700">Recent application stats.</p>
              <button
                className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 mt-4"
                onClick={() => router.push("/donor/applications")}
              >
                View Applications
              </button>
            </div>
          </div>
        )}

        {/* APPLICANT WIDGETS */}
        {currentRole === "applicant" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow p-6 text-center min-h-72">
                <h3 className="text-lg font-bold mb-4">All Scholarships</h3>
                <p className="text-gray-700">Browse available scholarships.</p>
                <button
                  className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 mt-4"
                  onClick={() => router.push("/scholarships")}
                >
                  View Details
                </button>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center min-h-72">
                <h3 className="text-lg font-bold mb-4">Matched Scholarships</h3>
                <p className="text-gray-700">Your best matches.</p>
                <button
                  className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 mt-4"
                  onClick={() => router.push("/MatchedApplications")}
                >
                  View Matches
                </button>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center min-h-72">
                <h3 className="text-lg font-bold mb-4">Document Checklist</h3>
                <p className="text-gray-700">Upload and track documents.</p>
                <button
                  className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 mt-4"
                  onClick={() => router.push("/UploadDocument")}
                >
                  View Documents
                </button>
              </div>
            </div>
            <div className="mt-8 max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <h3 className="text-lg font-bold mb-4">My Applications</h3>
                <p className="text-gray-700">Your submission history.</p>
                <button
                  className="bg-[#0C234B] text-white py-2 px-4 rounded hover:bg-blue-900 mt-4"
                  onClick={() => router.push("/MyApplications")}
                >
                  View History
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
