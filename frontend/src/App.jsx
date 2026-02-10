import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Page1 from "./pages/Page1";
import Register from "./pages/register";
import Note from "./pages/์Note";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/note/:id" element={<Note />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home/:id" element={<Home />} />
        <Route path="/page1/:id" element={<Page1 />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
