import Jobs from "./pages/Jobs/Jobs";
import Nav from "./components/Navbar/Nav.jsx";
import { Routes, Route } from "react-router";
import Home from "./pages/Home/Home.js";
import { useLoading } from "./context/LoadingContext";
import Loader from "./components/Loader/Loader";

function App() {
  const { loading } = useLoading();
  return (
    <div>
      {loading && <Loader />}
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        {/* <Route path="/apod" element={<APOD />} />
        <Route path="/earthquakes" element={<Earthquakes />} />
        <Route path="/iss" element={<ISS />} />
        <Route path="/mars" element={<Mars />} />
        <Route path="/near-earth-objects" element={<NearEarthObjects />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </div>
  );
}

export default App;
