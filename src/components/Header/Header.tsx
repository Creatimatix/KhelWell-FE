import { AppBar, Toolbar, Typography } from '@mui/material';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => { 

    return <>
        <AppBar position="static" sx={{ bgcolor: "white" }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Link className='logo' to="/">
                        KhelWell
                    </Link>
                </Typography>
                <Link className='link' to="/turfs">
                    Turfs
                </Link>
                <Link className='link' to="/events">
                    Events
                </Link>
                <Link className='link' to="/login">
                    Login
                </Link>
                <Link className='link' to="/register">
                    Register
                </Link>
            </Toolbar>
      </AppBar>
    </>
}

export default Header;