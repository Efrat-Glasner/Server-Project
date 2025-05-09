/* eslint-disable react/prop-types */
import { useState } from "react";
import { put } from "../js/controller";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTimes, faCheck  } from '@fortawesome/free-solid-svg-icons';

function Edit({ type, item, inputs, setDetails, showMessage, setSelectedItem, activity }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(() => {
        const initialData = {};
        inputs.forEach((input) => {
            initialData[input] = item[input];
        });
        return initialData;
    }); 
      
    const handleSave = async () => {
        try {
            const updatedItem = await put(`${type}/${item.id}`, { ...item, ...editedData });
            setDetails((prev) =>
                prev.map((prevItem) => (prevItem.id === item.id ? updatedItem : prevItem))
            );
            if (setSelectedItem) {
                setSelectedItem(updatedItem);
            }
            showMessage(`The ${type} was updated successfully!`);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating the item:", error);
            showMessage("Failed to update the item.");
        }
    };

    return (
        <div>
            {isEditing ? (
                <div className="edit-form">
                    {inputs.map((input) => (
                        <div key={input} className="edit-field">
                            <p htmlFor={`edit-${input}`} className="edit-label">
                                {input}:
                            </p>
                            <input
                                id={`edit-${input}`}
                                type="text"
                                value={editedData[input]}
                                onChange={(e) =>
                                    setEditedData((prev) => ({ ...prev, [input]: e.target.value }))
                                }
                                placeholder={`Edit ${input}`}
                                className="edit-input"
                            />
                        </div>
                    ))}
                    <button onClick={handleSave} disabled={activity}>
                    <FontAwesomeIcon icon={faCheck } />
                    </button>
                    <button  className="add-button" onClick={() => setIsEditing(false)}> <FontAwesomeIcon icon={faTimes} /></button>
                </div>
            ) : (
                <button className="edit-button" 
                    onClick={() => setIsEditing(true)}
                    disabled={activity} 
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
            )}
        </div>
    );
}

export default Edit;
