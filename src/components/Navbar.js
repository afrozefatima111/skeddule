import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate, useLocation  } from 'react-router-dom';

function Header() {

  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  const isDashboardPage = location.pathname.startsWith('/dashboard');

  useEffect(() => {
    if (!user && isDashboardPage) {
      const username = localStorage.getItem('username');
      setUser(username);
    }
  }, [user, isDashboardPage]); 
  
 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    navigate("/");
  };

  return (
    <Navbar expand="lg" bg="dark " data-bs-theme="dark" >
      <Container>
        <Navbar.Brand>
          <Link className="nav-link active text-light" aria-current="page" to={user ? '/dashboard' : '/'} style={{ textDecoration: 'none' }}>Skeddule</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className=" ml-auto text-light">
            <Nav.Link>
              <Link className="nav-link active text-light" aria-current="page" to={user ? '/dashboard' : '/'} style={{ textDecoration: 'none' }}>Home</Link>
            </Nav.Link>
            <Nav.Link>
              <Link className="nav-link active text-light" aria-current="page" to={user ? '/dashboard/about' : '/about'} style={{ textDecoration: 'none' }}>About</Link>
            </Nav.Link>
            {user ? ( 
              <Nav.Link>
                <button className="btn btn-link text-light" onClick={handleLogout}>Logout</button>
              </Nav.Link>
            ) : (
              <>
                <Nav.Link>
                  <Link className="nav-link active text-light" aria-current="page" to='/login' style={{ textDecoration: 'none' }}>Login</Link>
                </Nav.Link>
                <Nav.Link>
                  <Link className="nav-link active text-light" aria-current="page" to='/register' style={{ textDecoration: 'none' }}>Register</Link>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;