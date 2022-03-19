import styled, { keyframes } from 'styled-components';

interface WrapperProps {
  sticky?: boolean;
  isScrolled?: boolean;
}

export const Wrapper = styled.header<WrapperProps>`
  position: ${(props) =>
    props.sticky ? 'fixed' : props.isScrolled ? 'fixed' : 'relative'};
  padding: ${(props) => (props.isScrolled ? '15px 25px' : '25px 35px')};
  background: ${(props) => (props.isScrolled ? '#ffffff' : 'transparent')};
  box-shadow: ${(props) =>
    props.isScrolled ? '0px 2px 4px rgba(0, 0, 0, 0.05)' : 'none'};
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px) {
    padding: 15px 25px;
  }
`;

export const Brand = styled.div`
  display: inline-flex;
`;

const NavItemInAnim = keyframes`
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
`;

const NavItemOutAnim = keyframes`
  0% {
    left: 0;
    width: 100%;
  }
  100% {
    left: 100%;
    width: 0;
  }
`;

export const Navigation = styled.ul`
  margin-left: auto;

  &:hover li.main-nav-item.active:not(:hover)::after {
    background: transparent;
  }

  li.main-nav-item {
    position: relative;

    &.active {
      color: rgb(55, 65, 81);
    }
  }
`;

export const MobileNavigation = styled.div``;

export const MobileNavigationToggle = styled.button`
  margin-left: 10px;
`;

interface IMobileNavigationMenuProps {
  isOpen?: boolean;
}

export const MobileNavigationMenu = styled.ul<IMobileNavigationMenuProps>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #ffffff;
  max-height: ${(props) => (props.isOpen ? '200px' : '0')};
  overflow: hidden;
  border-bottom: 1px solid #e6e6e6;
  border-bottom-color: ${(props) => (props.isOpen ? '#e6e6e6' : 'transparent')};
  transition: all 0.3s ease-in-out;
`;

export default {
  Wrapper,
  Brand,
  Navigation,
  MobileNavigation,
  MobileNavigationToggle,
  MobileNavigationMenu,
};
