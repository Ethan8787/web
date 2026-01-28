import {Routes, Route} from "react-router-dom";
import Home from "./Home.jsx";
import Code from "./Code.jsx";
import NotFound from "./NotFound.jsx";
import Matrix from "./components/MatrixBackground.jsx";
import Clock from "./components/Clock.jsx";
import "./App.css"

export default function App() {
    return (<Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/code" element={<Code/>}/>
            <Route path="*" element={<NotFound/>}/>
            <Route path="/matrix" element={<Matrix/>}/>
            <Route path="/clock" element={
                <Clock/>
            }/>
        </Routes>);
}