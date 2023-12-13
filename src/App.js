import './App.css';
import { Route, BrowserRouter as Router, Routes, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/landing';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Footer from './components/footer';
import Dashboard from './components/dashboard/Dashboard';
import About from './components/About';
import Task from './components/dashboard/Task';

function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <Routes>
        <Route exact path='/' element={<Landing />} />
        <Route exact path='/about' element={<About />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/register' element={<Register />} />
        <Route exact path='/dashboard' element={<Dashboard />} />
        <Route exact path='/dashboard/about' element={<About />} />
        <Route path="/dashboard/task/:id" element={<Task />} />
      </Routes>
      <Footer></Footer>
    </Router>
  );
}

export default App;
