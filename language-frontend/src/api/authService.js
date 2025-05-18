// src/api/authService.js

export const getHomeData = async () => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch("http://192.168.59.250:8000/api/home-after-login", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || "Something went wrong";
      throw new Error(message);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Failed to fetch home data:", error.message);
    throw error; // Re-throw to handle in the calling component
  }
};
