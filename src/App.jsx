import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Answer from "./Answer.jsx";
import "./App.css"

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/answer" element={<Answer />} />
        </Routes>
    );
}
