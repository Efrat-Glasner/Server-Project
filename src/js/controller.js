// בסיס הכתובת של השרת
const BASE_URL = "http://localhost:3000/";

export const get = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; 
  }
};




export const post = async (endpoint, data) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to post data to ${endpoint}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};




export const deleteRequest = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete data from ${endpoint}`);
    }

    return await response.json(); // or you can just return a success message if no data is returned
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};



export const put = async (endpoint, data) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to put data to ${endpoint}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error puting data:", error);
    throw error;
  }
};