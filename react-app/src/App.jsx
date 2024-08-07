import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./Components/Nav";
import Dashboard from "./Components/Dashboard";
import ListOfTasks from "./Components/ListOfTasks";
import MyProfile from "./Components/MyProfile";

const App = () => {
  return (
    <Router>
      <div className="flex">
        <Nav />
        <div className="flex-grow">
        <Routes>
          {/* add routes to pages */}
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/ListOfTasks" element={<ListOfTasks />} />
          <Route path="/MyProfile" element={<MyProfile />} />
        
        </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;