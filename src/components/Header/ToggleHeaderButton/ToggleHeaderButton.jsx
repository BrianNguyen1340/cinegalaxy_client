/* eslint-disable react/prop-types */
import { Menu, X } from 'lucide-react'

const ToggleHeaderButton = ({
  onClick,
  style,
  isMenuMobileOpen,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${!isMenuMobileOpen && 'rotate-180'} h-7 w-fit cursor-pointer bg-white transition duration-300 1001px:hidden`}
      style={style}
    >
      {isMenuMobileOpen ? (
        <X size={30} strokeWidth={2.5} />
      ) : (
        <Menu size={30} strokeWidth={2.5} />
      )}
    </button>
  )
}

export default ToggleHeaderButton
