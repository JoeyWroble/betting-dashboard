import { NavLink } from 'react-router-dom';
import { HomeIcon, ChartBarIcon, BookOpenIcon } from '@heroicons/react/24/outline';

function NavBar() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] flex justify-around items-center h-16 z-50"
      style={{ backgroundColor: '#1c1c1c', borderTop: '1px solid #2a2a2a' }}
    >

      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium px-5 py-2 transition-colors ${
            isActive ? 'text-[#f5f5f5]' : 'text-[#555555]'
          }`
        }
      >
        <HomeIcon className="w-5 h-5" />
        <span>Scores</span>
      </NavLink>

      <NavLink
        to="/odds"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium px-5 py-2 transition-colors ${
            isActive ? 'text-[#f5f5f5]' : 'text-[#555555]'
          }`
        }
      >
        <ChartBarIcon className="w-5 h-5" />
        <span>Odds</span>
      </NavLink>

      <NavLink
        to="/tracker"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium px-5 py-2 transition-colors ${
            isActive ? 'text-[#f5f5f5]' : 'text-[#555555]'
          }`
        }
      >
        <BookOpenIcon className="w-5 h-5" />
        <span>Tracker</span>
      </NavLink>

    </nav>
  );
}

export default NavBar;