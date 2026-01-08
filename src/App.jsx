import {Routes, Route} from "react-router-dom";
import Home from "./Home.jsx";
import Answer from "./Answer.jsx";
import NotFound from "./NotFound.jsx";
import Matrix from "./components/MatrixBackground.jsx";
import Firework from "./components/Firework.jsx";
import "./App.css"

export default function App() {
    return (<Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/answer" element={<Answer/>}/>
            <Route path="*" element={<NotFound/>}/>
            <Route path="/firework" element={<Firework/>}/>
            <Route path="/matrix" element={<Matrix/>}/>
        </Routes>);
}