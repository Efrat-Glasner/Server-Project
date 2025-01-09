/* eslint-disable react/prop-types */
import { deleteRequest } from "../js/controller";

function Delete({ type, id, setDetails, activity,showMessage ,setSelectedItem}) {
    const handleDelete = async () => {
        try {
            await deleteRequest(`${type}/${id}`); // קריאה לפקודת DELETE
            if(setSelectedItem)
                setSelectedItem(null);
            setDetails((prev) => prev.filter((item) => item.id !== id));
            showMessage(`The ${type} was deleted successfully!`);
        } catch (error) {
            console.error("Error deleting the todo:", error);
        }
    };

    return <button onClick={handleDelete} disabled={activity}>Delete</button>
}
export default Delete;
