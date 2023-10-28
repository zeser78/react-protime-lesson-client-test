import { useState, useEffect } from "react";
import "./App.css";
import AddLesson from "./AddLesson";

// const lessonsData = [
//   {
//     id: 1,
//     userId: 1,
//     clientId: 2,
//     lessonPackageId: null,
//     date: "2023-10-10",
//     time: "8:00",
//   },
//   {
//     id: 2,
//     userId: 1,
//     clientId: 2,
//     lessonPackageId: null,
//     date: "2023-10-11",
//     time: "9:00",
//   },
// ];

// const clientsData = [
//   { id: 1, name: "John Doe" },
//   { id: 2, name: "Sergio" },
// ];
// const lessonPackagesData = [
//   { id: 0, packageName: "None", quantity: 0 },
//   { id: 1, packageName: "Basic", quantity: 10 },
// ];

function App() {
  const [count, setCount] = useState(0);
  const [lessons, setLessons] = useState();
  const [newLesson, setNewLesson] = useState({
    clientId: "",
    lessonPackageId: "",
    date: "",
    time: "",
  });

  const [data, setData] = useState([]);

  async function fetchData() {
    const response = await fetch("http://127.0.0.1:5000/getData");
    const data = await response.json();

    setData(data);
  }
  useEffect(() => {
    fetchData();
  }, []);

  // const [lessonPackages, setLessonPackages] = useState(lessonPackagesData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setNewLesson((prevLesson) => ({
      ...prevLesson,
      [name]: value,
    }));
  };

  const renderLesson = (lesson) => {
    // const client = data.find((c) => c.id === parseInt(lesson.clientId));
    // let lessonPackage = lessonPackages.find(
    //   (lp) => lp.id === parseInt(lesson.lessonPackageId)
    // );
    // const remaining = remainingLessons(lesson.lessonPackageId);
    // if (lessonPackage == undefined || null) {
    //   lessonPackage = lessonPackages.find((lp) => lp.id === parseInt(0));
    // }
    // const lesson = data
    const isoString = lesson.LessonDateTime;
    const dateObject = new Date(isoString);

    const optionsDate = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dateString = dateObject.toLocaleDateString(undefined, optionsDate); // Output: May 14, 2023

    const optionsTime = { hour: "2-digit", minute: "2-digit" };
    const timeString = dateObject.toLocaleTimeString(undefined, optionsTime); // Output: 05:00 PM

    console.log(dateString); // May 14, 2023
    console.log(timeString); // 05:00 PM
    const price = parseFloat(lesson.Price).toFixed(2);
    console.log(price);

    return (
      <tr key={lesson.id}>
        <td>{lesson.id}</td>
        <td>{lesson.client_id}</td>
        <td>{price}</td>
        <td>{dateString}</td>
        <td>{timeString}</td>
      </tr>
    );
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // const filteredClients = clients.filter((client) =>
  //   client.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const handleAddLesson = () => {
    // const lessonPackage = lessonPackages.find(lp => lp.id === parseInt(newLesson.lessonPackageId));
    // if (lessonPackage && remainingLessons(newLesson.lessonPackageId) <= 0 || null) {

    //  lessonPackage = lessonPackage[0];
    // }
    setLessons((prevLessons) => [
      ...prevLessons,
      { ...newLesson, id: prevLessons.length + 1 },
    ]);
    setNewLesson({ clientId: "", lessonPackageId: "", date: "", time: "" });
  };

  return (
    <>
      <h2>Clients</h2>
      <input
        type="text"
        placeholder="Search clients"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {/* {filteredClients.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.name}</td>
            </tr>
          ))} */}
        </tbody>
      </table>

      <h2>Lesson Packages</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Package Name</th>
          </tr>
        </thead>
        <tbody>
          {/* {lessonPackages.map((pkg) => (
            <tr key={pkg.id}>
              <td>{pkg.id}</td>
              <td>{pkg.packageName}</td>
            </tr>
          ))} */}
        </tbody>
      </table>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <div>
        <AddLesson />
      </div>
      <table className="lesson-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Price</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>{data.map((lesson) => renderLesson(lesson))}</tbody>
      </table>
    </>
  );
}

export default App;
