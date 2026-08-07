import Jobs from "./pages/Jobs/Jobs";
import Job from "./pages/Job/Job.js";
import Nav from "./components/Navbar/Nav.jsx";
import { Routes, Route } from "react-router";
import Home from "./pages/Home/Home.js";
import { useLoading } from "./context/LoadingContext";
import Loader from "./components/Loader/Loader";
import "./styles/global.css";
import Companies from "./pages/Companies/Companies.js";
import Login from "./pages/Login/Login.js";
import { useAuth } from "./context/AuthContext.js";

const App = (): React.JSX.Element => {
  const { user } = useAuth();
  const { loading } = useLoading();

  if (!user) {
    return <Login />;
  }
  return (
    <div>
      {loading && <Loader />}
      <Nav />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<Job />} />
          <Route path="/companies" element={<Companies />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
