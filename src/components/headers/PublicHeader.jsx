import React from 'react'
import Logo from '@/components/Logo.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { WrapperContainer } from '../containers/Container.jsx';

const PublicHeader = () => {
    const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#f0ede6]/90 backdrop-blur-sm border-b border-black/[0.06]">
      <WrapperContainer>
        <nav className="flex items-center justify-between py-3.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Logo/>
          </Link>

          <button
            onClick={() => navigate("/auth?type=login")}
            className="text-[13px] font-medium text-[#1a1814] bg-transparent border border-black/15 rounded-full px-4 py-1.5 cursor-pointer hover:bg-black/[0.06] hover:border-black/25 transition-all"
          >
            Log in
          </button>
        </nav>
      </WrapperContainer>
    </header>
  );
}

export default PublicHeader;