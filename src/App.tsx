import "./App.css";
import "./responsive.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MenuList from "./pages/MenuList";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuList />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
