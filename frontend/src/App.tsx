import Jobs from "./pages/Jobs/Jobs";
import Nav from "./components/Navbar/Nav.jsx";
import { Routes, Route } from "react-router";
import Home from "./pages/Home/Home.js";
import { useLoading } from "./context/LoadingContext";
import Loader from "./components/Loader/Loader";
import "./styles/global.css";

function App() {
  const { loading } = useLoading();
  return (
    <div>
      {loading && <Loader />}
      <Nav />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
