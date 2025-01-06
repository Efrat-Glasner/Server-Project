import { Link } from "react-router-dom";
import "../css/notFound.css"; // סגנון מותאם אישית לעמוד שגיאה

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>The page you are looking for does not exist.</p>
      <img
        src="https://files.oaiusercontent.com/file-UH7XdUyN8LLntPd9o3Nvxs?se=2025-01-06T22%3A49%3A45Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Da4ec61af-0609-4f20-bf40-b24838ce994b.webp&sig=bMP5YPagd%2BXkbOO9cQMYvogMvVxt7Tw/9EPKH%2B5eIGA%3D" // עדכן את הנתיב של התמונה
        alt="Funny error image"
        className="error-image"
      />
      <Link to="/login">Go back to Login</Link>
    </div>
  );
}

export default NotFound;
