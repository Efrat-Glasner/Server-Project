/* eslint-disable react/prop-types */
import { deleteRequest } from "../js/controller";
function Delete({ type, id, onDelete, activity }) {
    const handleDelete = async () => {
        try {
            await deleteRequest(`${type}/${id}`); // קריאה לפקודת DELETE
            onDelete(id); // קריאה למחיקת המשימה מהסטייט של Todos
        } catch (error) {
            console.error("Error deleting the todo:", error);
        }
    };
    return <button onClick={handleDelete} disabled={activity}>Delete</button>
}
export default Delete