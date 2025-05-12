import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterLoginForm from './LoginPage';
import HomePage from './HomePage';

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<RegisterLoginForm />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes