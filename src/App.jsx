import {Route, Routes} from "react-router-dom";
import Home from "./components/Home/Home.jsx";
import Code from "./components/Code/Code.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import Matrix from "../unused/Matrix.jsx";
import Clock from "./components/Clock/Clock.jsx";
import "./App.css"

export default function App() {
    return (<Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/code" element={<Code/>}/>
        <Route path="*" element={<NotFound/>}/>
        <Route path="/gameid" element={<Matrix/>}/>
        <Route path="/clock" element={
            <Clock/>
        }/>
    </Routes>);
}