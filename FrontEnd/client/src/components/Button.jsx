import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Button = ({ children, onClick, className, type = "button", to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`px-4 py-2 rounded-lg ${className}`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.string,
  to: PropTypes.string,
};

export default Button;
