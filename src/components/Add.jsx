/* eslint-disable react/prop-types */
import { post } from "../js/controller";
import { useState } from "react";
import '../css/component.css'
function Add({ type, setDetails, inputs, knownFields, showMessage, onFilter }) {
    const [newItem, setNewItem] = useState({});
    const [isAdding, setIsAdding] = useState(false);

    const handleInputChange = (field, value) => {
        setNewItem((prev) => ({ ...prev, [field]: value }));
    };

    const handleAdd = async () => {
        try {
            const combinedData = { ...knownFields, ...newItem };
            const addedItem = await post(type, combinedData);
            setDetails((prevDetails) => {
                const updatedDetails = [addedItem, ...prevDetails];

                // עדכון המשימות המסוננות באמצעות onFilter
                onFilter(updatedDetails);
                return updatedDetails;
            });
            setNewItem({});
            setIsAdding(false);
            showMessage(`${type} added successfully!`);
        } catch (error) {
            console.error(`Error adding the ${type}:`, error);
            showMessage(`Failed to add the ${type}.`);
        }
    };

    return (
        <>
            {!isAdding ? (
                <button  className="add-button" onClick={() => setIsAdding(true)}>Add {type}</button>
            ) : (
                <>
                    <button  className="add-button" onClick={() => setIsAdding(false)}>Cancel</button>
                    <div className="add-item">
                        {inputs.map((field) => (
                            <input
                                key={field}
                                type="text"
                                placeholder={`Enter ${field}`}
                                value={newItem[field] || ""}
                                onChange={(e) => handleInputChange(field, e.target.value)}
                            />
                        ))}
                        <button className="add-button"
                            onClick={handleAdd}
                            disabled={inputs.some((field) => !newItem[field]?.trim())}
                        >
                            Confirm
                        </button>
                    </div>
                </>
            )}
        </>
    );
}

export default Add;
