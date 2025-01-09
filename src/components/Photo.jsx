/* eslint-disable react/prop-types */
import { useState } from "react";
import { put } from "../js/controller";
import "../css/photo.css"; // חיבור לקובץ העיצוב
import Delete from "./Delete";
function Photo({ photo, onDelete, onUpdate, showMessage }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedPhoto, setUpdatedPhoto] = useState({
    title: photo.title,
    url: photo.thumbnailUrl,
  });

  // const handleDelete = async () => {
  //   try {
  //     await deleteRequest(`photos/${photo.id}`);
  //     onDelete(photo.id);
  //   } catch (error) {
  //     console.error("Error deleting the photo:", error);
  //     showMessage("Failed to delete the photo.");
  //   }
  // };

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
    <div className="photo-card">
      {isEditing ? (
        <>
          <input
            type="text"
            value={updatedPhoto.title}
            onChange={(e) =>
              setUpdatedPhoto({ ...updatedPhoto, title: e.target.value })
            }
            placeholder="Enter new title"
            className="photo-input"
          />
          <input
            type="text"
            value={updatedPhoto.url}
            onChange={(e) =>
              setUpdatedPhoto({ ...updatedPhoto, url: e.target.value })
            }
            placeholder="Enter new image URL"
            className="photo-input"
          />
          <div className="photo-buttons">
            <button onClick={handleSave} className="photo-button save">
              Save
            </button>
            <button onClick={handleCancel} className="photo-button cancel">
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <img src={photo.thumbnailUrl} alt={photo.title} className="photo-img" />
          <p className="photo-title">{photo.title}</p>
          <div className="photo-buttons">
            {/* <button onClick={handleDelete} className="photo-button delete">
              Delete
            </button> */}
            <Delete type={"photos"} id={photo.id} onDelete={onDelete} activity={false}></Delete>
            <button onClick={handleEditClick} className="photo-button edit">
              Edit
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Photo;
