import { Route, Routes } from "react-router-dom";
import "./App.css";

import Dashboard from "./Dashboard";
import Login from "./Login";
import Asset from "./Asset";
import Inventory from "./Inventory";
import Profile from "./Profile";
import Ticket from "./Ticket";
import LogDashboard from "./LogDashboard";
import TechDash from "./TechDashBoard";
import EmpProfile from "./EmpProfile";
import ReportIssue from "./ReportIssue";
import TechProfile from "./TechProfile";
import TechTickets from "./TechTickets";



function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="logdash" element={<LogDashboard/>}/>
      <Route path="/" element={<Login />} />
      <Route path="/asset" element={<Asset />} />
      <Route path="/invent" element={<Inventory />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/ticket" element={<Ticket />} />
      <Route path="/techdash" element={<TechDash/>}/>
      <Route path="/Emppro" element={<EmpProfile/>}/>
      <Route path="/report" element={<ReportIssue/>}/>
      <Route path="/techpro" element={<TechProfile/>}/>
      <Route path="/techtick" element={<TechTickets/>}/>
      
    </Routes>
  );
}

export default App;
