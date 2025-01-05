/* eslint-disable react/prop-types */
import { deleteRequest } from "../js/controller";
function Photo({ photo, onDelete, onUpdate,showMessage }) {
     const handleDelete = async () => {
      try {
        await deleteRequest(`photos/${photo.id}`); // קריאה לפקודת DELETE
        console.log(`Photo with ID: ${photo.id} deleted!`);
        onDelete(photo.id); // קריאה למחיקת המשימה מהסטייט של Photos
      } catch (error) {
        console.error("Error deleting the todo:", error);
        showMessage("Failed to delete the task.");
      }
    };
    function handleUpdate() {
        onUpdate()
    }

    return (
        <div style={{ textAlign: "center", margin: "10px", border: "1px solid gray", padding: "10px" }}>
            <img src={photo.thumbnailUrl} alt={photo.title} style={{ width: "150px", height: "150px" }} />
            <p>{photo.title}</p>
            <button onClick={handleDelete} style={{ margin: "5px" }}>Delete</button>
            <button onClick={handleUpdate} style={{ margin: "5px" }}>Update</button>
        </div>
    );
}

export default Photo;
