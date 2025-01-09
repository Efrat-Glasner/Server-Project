/* eslint-disable react/prop-types */
import { post } from "../js/controller";
import { useState } from "react";

function Add({ type, setDetails, inputs, knownFields, showMessage }) {
    const [newItem, setNewItem] = useState({});
    const [isAdding, setIsAdding] = useState(false);

    const handleInputChange = (field, value) => {
        setNewItem((prev) => ({ ...prev, [field]: value }));
    };

    const handleAdd = async () => {
        try {
            const combinedData = { ...knownFields, ...newItem };
            const addedItem = await post(type, combinedData);
            setDetails((prevDetails) => [addedItem, ...prevDetails]);
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
                <button onClick={() => setIsAdding(true)}>Add {type}</button>
            ) : (
                <>
                    <button onClick={() => setIsAdding(false)}>Cancel</button>
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
                        <button
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
