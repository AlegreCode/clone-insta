import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Settings, LogOut, LogIn, UserPlus, Camera } from 'lucide-react';
import { logout, getUserData } from '../services/supabaseService';
import supabase from '../utils/supabase';
import logo from '../assets/instaclone-logo.png';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // Para dropdown de usuario desktop
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Para menú mobile
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Get initial user
    const getInitialUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    }
    getInitialUser();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const data = await getUserData();
          setUserData(data);
        } catch (error) {
          if (error.name !== 'AuthSessionMissingError') {
            console.error('Error fetching user data:', error);
          }
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
    };

    fetchUserData();

  }, [user, userData]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const handleMobileNavigation = () => {
    setMobileMenuOpen(false);
  };

  const handleDesktopNavigation = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    if (path === '/register') {
        return isActive
            ? 'flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-800 rounded-md'
            : 'flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100';
    }
    return isActive
        ? 'flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md'
        : 'flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100';
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-6xl px-4 mx-auto">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center space-x-7">
            <div>
              <Link to="/" className="flex items-center">
                <img src={logo} alt="Instaclone Logo" className="h-12 w-auto cursor-pointer" />
              </Link>
            </div>
          </div>
          <div className="items-center hidden space-x-3 md:flex">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={toggleDropdown} className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full cursor-pointer">
                  <img src={userData?.avatar || `https://placehold.co/150x150/E0F2FE/0EA5E9/png?text=${user.user_metadata?.display_name?.charAt(0).toUpperCase() || 'U'}`} alt="Avatar" className="w-10 h-10 rounded-full" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                    <div className="py-1" role="none">
                      <div className="px-4 py-2 text-sm text-gray-700 font-medium" role="none">
                        @{userData?.username || user.user_metadata?.display_name || user.email}
                      </div>
                    </div>
                    <div className="py-1" role="none">
                      <Link to="/profile" onClick={handleDesktopNavigation} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        <User className="mr-3" size={18} />
                        Perfil
                      </Link>
                      <Link to="/settings" onClick={handleDesktopNavigation} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        <Settings className="mr-3" size={18} />
                        Ajustes
                      </Link>
                    </div>
                    <div className="py-1" role="none">
                      <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 cursor-pointer" role="menuitem">
                        <LogOut className="mr-3" size={18} />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className={getLinkClass('/login')}>
                  <LogIn className="mr-2" size={16} />
                  Login
                </Link>
                <Link to="/register" className={getLinkClass('/register')}>
                  <UserPlus className="mr-2" size={16} />
                  Register
                </Link>
              </div>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="mobile-menu-button">
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          {user ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-700 font-medium" role="none">
                @{userData?.username || user.user_metadata?.display_name || user.email}
              </div>
              <Link to="/profile" onClick={handleMobileNavigation} className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                <User className="mr-3" size={18} />
                Perfil
              </Link>
              <Link to="/settings" onClick={handleMobileNavigation} className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                <Settings className="mr-3" size={18} />
                Ajustes
              </Link>
              <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm font-medium text-left text-gray-700 rounded-md hover:bg-gray-100">
                <LogOut className="mr-3" size={18} />
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={handleMobileNavigation} className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                <LogIn className="mr-2" size={16} />
                Login
              </Link>
              <Link to="/register" onClick={handleMobileNavigation} className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                <UserPlus className="mr-2" size={16} />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;