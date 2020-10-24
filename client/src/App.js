// import logo from "./logo.svg";
import { BrowserRouter as Router, Route } from "react-router-dom";

import MenuBar from "./components/MenuBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

function App() {
    return (
        <Router>
            <MenuBar />
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/register" component={Register}></Route>
        </Router>
    );
}

export default App;
