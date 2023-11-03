import { useState } from "react";
import { formatISO } from "date-fns";

function AddLesson() {
  const [formData, setFormData] = useState({
    user_id: "",
    client_id: "",
    price: "",
    lessonDateTime: "",
    lessonPackageId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (
      name === "user_id" ||
      name === "client_id" ||
      name === "lessonPackageId"
    ) {
      newValue = value ? parseInt(value, 10) : ""; // Convert to integer for user_id and client_id
    } else if (name === "price") {
      //   newValue = 430.14; // Keep as string with two decimal places for price
      newValue = parseFloat(value); // Keep as string with two decimal places for price
    }
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDateTime = formatISO(new Date(formData.lessonDateTime), {
        representation: "complete",
      });
      const updatedFormData = {
        ...formData,
        lessonDateTime: formattedDateTime,
      };
      const response = await fetch("http://127.0.0.1:5000/addLesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("There was a problem with the fetch:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        name="user_id"
        value={formData.user_id}
        onChange={handleInputChange}
        placeholder="User ID"
        required
      />
      <input
        type="number"
        name="client_id"
        value={formData.client_id}
        onChange={handleInputChange}
        placeholder="Client ID"
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleInputChange}
        placeholder="Price"
      />

      <input
        type="number"
        name="lessonPackageId"
        value={formData.lessonPackageId}
        onChange={handleInputChange}
        placeholder="Lesson Package ID"
      />

      <input
        type="datetime-local"
        name="lessonDateTime"
        value={formData.lessonDateTime}
        onChange={handleInputChange}
        required
      />
      <input type="submit" value="Submit" />
    </form>
  );
}

export default AddLesson;
