import {Routes, Route} from "react-router-dom";
import Home from "./Home.jsx";
import Answer from "./Answer.jsx";
import Birthday from "./Birthday.jsx";
import NotFound from "./NotFound.jsx";
import "./App.css"

export default function App() {
    return (<Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/answer" element={<Answer/>}/>
            <Route path="/hbd" element={<Birthday/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>);
}
