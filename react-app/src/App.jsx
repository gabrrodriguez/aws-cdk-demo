
// import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
// import SupervisorNav from "./Components/Navigation/SupervisorNav/SupervisorNav";
// import SupervisorDashboard from "./Components/SupervisorDashboard";
// import TechnicianNav from "./Pages/TechnicianDashboard/TechnicianNav";
// import TechnicianDashboard from "./Pages/TechnicianDashboard/TechnicianDashboard";
// import ListOfTasks from "./Pages/ListOfTasks/ListOfTasks";
// import MyProfile from "./Components/MyProfile";

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <div className="bg-gray-200 flex justify-center items-center h-screen">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <Link to="/SupervisorDashboard">
//                   <div className="bg-gray-800 text-white rounded-lg p-8 flex flex-col items-center">
//                     <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded">
//                       Supervisor View
//                     </button>
//                   </div>
//                 </Link>
//                 <Link to="/TechnicianDashboard">
//                   <div className="bg-gray-800 text-white rounded-lg p-8 flex flex-col items-center">
//                     <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded">
//                       Technician View
//                     </button>
//                   </div>
//                 </Link>
//               </div>
//             </div>
//           }
//         />
//         <Route
//           path="/SupervisorDashboard"
//           element={
//             <div className="flex">
//               <SupervisorNav />
//               <div className="flex-grow">
//                 <SupervisorDashboard />
//               </div>
//             </div>
//           }
//         />
//         <Route path="/TechnicianDashboard" element={<TechnicianNav />}>
//           <Route index element={<TechnicianDashboard />} />
//           <Route path="ListOfTasks" element={<ListOfTasks />} />
//           <Route path="MyProfile" element={<MyProfile />} />
//           <Route path="logout" element={<Navigate to="/" replace />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// };

// export default App;




import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import TechnicianLayout from "./Layouts/TechnicianLayout.jsx";
import SupervisorLayout from "./Layouts/SupervisorLayout";
import TechnicianDashboard from "./Pages/TechnicianDashboard/TechnicianDashboard";
import ListOfTasks from "./Pages/ListOfTasks/ListOfTasks";
import MyProfile from "./Pages/MyProfile/MyProfile";
import SupervisorDashboard from "./pages/SupervisorDashboard/SupervisorDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="bg-gray-200 flex justify-center items-center h-screen">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Link to="/SupervisorDashboard">
                   <div className="bg-gray-800 text-white rounded-lg p-8 flex flex-col items-center">
                     <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded">
                       Supervisor View
                     </button>
                   </div>
                 </Link>
                 <Link to="/Technician">
                   <div className="bg-gray-800 text-white rounded-lg p-8 flex flex-col items-center">
                     <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded">
                       Technician View
                     </button>
                   </div>
                 </Link>
               </div>
            </div>
          }
        />
        <Route path="/technician" element={<TechnicianLayout />}>
          <Route index element={<TechnicianDashboard />} />
          <Route path="tasks" element={<ListOfTasks />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="logout" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="/supervisor" element={<SupervisorLayout />}>
          <Route index element={<SupervisorDashboard />} />
          {/* Add additional supervisor routes here */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;