import { Link } from "react-router-dom";
import "../css/notFound.css"; // סגנון מותאם אישית לעמוד שגיאה

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/login">Go back to Login</Link>
    </div>
  );
}

export default NotFound;
