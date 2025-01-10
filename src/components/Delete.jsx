 /* eslint-disable react/prop-types */
import { deleteRequest ,get} from "../js/controller";
function Delete({ types, id, setDetails, activity, showMessage, setSelectedItem }) {
    const handleDelete = async () => {
        try {
            // מערך לשמירת כל ה-IDs של הילדים שצריך למחוק
            const dependentItemsToDelete = [];
            // לולאה לעיבוד כל סוגי הנתיבים
            for (const type of types) {
                if (type.includes("/")) {
                    const [dependentType, parentField] = type.split("/"); // מחלק ל: "comments", "postId"

                    // מבצע קריאת GET כדי לקבל את כל הפריטים התלויים
                    const dependentItems = await get(`${dependentType}/?${parentField}=${id}`)
                    if (!dependentItems) {
                        throw new Error(`Failed to fetch dependent items from ${dependentType}`);
                    }
                    // הוספת IDs של הילדים למערך עזר
                    dependentItems.forEach((item) => dependentItemsToDelete.push({ type: dependentType, id: item.id }));
                } else {
                    // אם זה סוג רגיל, מוסיפים את האובייקט למחיקה
                    dependentItemsToDelete.push({ type, id });
                }
            }

            // מחיקת כל האובייקטים מהמערך
            for (const item of dependentItemsToDelete) {
                const response = await deleteRequest(`${item.type}/${item.id}`)
                if (!response) {
                    throw new Error(`Failed to delete ${item.type} with ID: ${item.id}`);
                }
            }
            if (setSelectedItem) setSelectedItem(null);
            setDetails((prev) => prev.filter((item) => item.id !== id));
            showMessage("The item and its related items were deleted successfully!");
        } catch (error) {
            console.error("Error deleting the items:", error);
        }
    };

    return <button onClick={handleDelete} disabled={activity}>Delete</button>;
}

export default Delete;
