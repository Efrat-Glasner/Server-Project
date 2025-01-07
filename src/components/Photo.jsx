/* eslint-disable react/prop-types */
import { deleteRequest } from "../js/controller";
import { useState } from "react";
import { put } from "../js/controller";

function Photo({ photo, onDelete, onUpdate, showMessage }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedPhoto, setUpdatedPhoto] = useState({
    title: photo.title,
    url: photo.thumbnailUrl,
  });

  const handleDelete = async () => {
    try {
      await deleteRequest(`photos/${photo.id}`); // קריאה לפקודת DELETE
      console.log(`Photo with ID: ${photo.id} deleted!`);
      onDelete(photo.id); // קריאה למחיקת המשימה מהסטייט של Photos
    } catch (error) {
      console.error("Error deleting the photo:", error);
      showMessage("Failed to delete the photo.");
    }
  };

  const handleSave = async () => {
    if (updatedPhoto.title.trim() === "" || updatedPhoto.url.trim() === "") {
      showMessage("Both title and URL must have valid values.");
      return;
    }

    setIsEditing(false);
    try {
      const updatedData = await put(`photos/${photo.id}`, {
        ...photo,
        title: updatedPhoto.title,
        thumbnailUrl: updatedPhoto.url,
      });
      onUpdate(photo.id, updatedData);
      showMessage("Photo updated successfully!");
    } catch (error) {
      console.error("Error updating the photo:", error);
      showMessage("Failed to update the photo.");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedPhoto({
      title: photo.title,
      url: photo.thumbnailUrl,
    });
  };

  return (
    <div
      style={{
        textAlign: "center",
        margin: "10px",
        border: "1px solid gray",
        padding: "10px",
      }}
    >
      {isEditing ? (
        <>
          <input
            type="text"
            value={updatedPhoto.title}
            onChange={(e) =>
              setUpdatedPhoto({ ...updatedPhoto, title: e.target.value })
            }
            placeholder="Enter new title"
            style={{ margin: "5px", padding: "5px", width: "80%" }}
          />
          <input
            type="text"
            value={updatedPhoto.url}
            onChange={(e) =>
              setUpdatedPhoto({ ...updatedPhoto, url: e.target.value })
            }
            placeholder="Enter new image URL"
            style={{ margin: "5px", padding: "5px", width: "80%" }}
          />
          <div>
            <button onClick={handleSave} style={{ margin: "5px" }}>
              Save
            </button>
            <button onClick={handleCancel} style={{ margin: "5px" }}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <img
            src={photo.thumbnailUrl}
            alt={photo.title}
            style={{ width: "150px", height: "150px" }}
          />
          <p>{photo.title}</p>
          <button onClick={handleDelete} style={{ margin: "5px" }}>
            Delete
          </button>
          <button onClick={handleEditClick} style={{ margin: "5px" }}>
            Edit
          </button>
        </>
      )}
    </div>
  );
}

export default Photo;
