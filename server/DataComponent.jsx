import { useState, useEffect } from "react";
import axios from "axios";

function YourComponent() {
  const [data, setData] = useState([]);

  async function fetchData() {
    const response = await fetch("http://127.0.0.1:5000/getData");
    const data = await response.json();

    setData(data);
  }

  useEffect(() => {
    // axios
    //   .get("http://localhost:5000/getData")
    //   .then((response) => {
    //     setData(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("There was an error fetching the data!", error);
    //   });
    fetchData();
  }, []);

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          {item.id} - {item.user_id}
        </div>
      ))}
    </div>
  );
}

export default YourComponent;
