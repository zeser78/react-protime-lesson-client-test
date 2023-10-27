import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const lessonsData = [
  { id:1, userId:1, clientId: 2, lessonPackageId: null, date: '2023-10-10', time: '8:00'  },
  { id:2, userId:1, clientId: 2, lessonPackageId: null, date: '2023-10-11', time: '9:00'  },

];

const clientsData =  [{ id: 1, name: 'John Doe'}, { id: 2, name: 'Sergio'}]
const lessonPackagesData = [ { id: 0, packageName: 'None', quantity: 0 },{ id: 1, packageName: 'Basic', quantity: 10 }]

function App() {
  const [count, setCount] = useState(0)
  const [lessons, setLessons] = useState(lessonsData);
  const [newLesson, setNewLesson] = useState({ clientId: '', lessonPackageId: '', date: '', time: '' });


  const [clients, setClients] = useState(clientsData);

  const [lessonPackages, setLessonPackages] = useState(lessonPackagesData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    setNewLesson(prevLesson => ({
      ...prevLesson,
      [name]: value
    }));
  };

  const renderLesson = (lesson) => {
    const client = clients.find(c => c.id === parseInt(lesson.clientId));
    let lessonPackage = lessonPackages.find(lp => lp.id === parseInt(lesson.lessonPackageId));
    const remaining = remainingLessons(lesson.lessonPackageId);
    if (lessonPackage == undefined || null) {
       lessonPackage = lessonPackages.find(lp => lp.id === parseInt(0));
    }
    return (
      <tr key={lesson.id}>
        <td>{lesson.id}</td>
        <td>{client?.name}</td>
        <td>{lessonPackage?.packageName}</td>
        <td>{lessonPackage?.amount}</td>
        <td>{remaining}</td>
        <td>{formatDate(lesson.date)}</td>
        <td>{formatTime(lesson.time)}</td>

      </tr>
    );
  };

          const [searchTerm, setSearchTerm] = useState('');

          const handleSearchChange = (e) => {
            setSearchTerm(e.target.value);
          };
        
          const filteredClients = clients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          
  const handleAddLesson = () => {
    const lessonPackage = lessonPackages.find(lp => lp.id === parseInt(newLesson.lessonPackageId));
    // if (lessonPackage && remainingLessons(newLesson.lessonPackageId) <= 0 || null) {
      
    //  lessonPackage = lessonPackage[0];
    // }
     setLessons(prevLessons => [...prevLessons, { ...newLesson, id: prevLessons.length + 1 }]);
      setNewLesson({ clientId: '', lessonPackageId: '', date: '', time: '' });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  };

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    return `${parseInt(hour)}:${minute} ${parseInt(hour) < 12 ? 'AM' : 'PM'}`;
  };
        
          const remainingLessons = (lessonPackageId) => {
            const totalLessons = lessonPackages.find(pkg => pkg.id === parseInt(lessonPackageId))?.amount || 0;
            const usedLessons = lessons.filter(lesson => lesson.lessonPackageId === lessonPackageId).length;
            return totalLessons - usedLessons;
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
          {filteredClients.map(client => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.name}</td>
            </tr>
          ))}
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
          {lessonPackages.map(pkg => (
            <tr key={pkg.id}>
              <td>{pkg.id}</td>
              <td>{pkg.packageName}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <div>
        <input type="number" name="clientId" value={newLesson.clientId} onChange={handleInputChange} placeholder="Client ID" />
        <input type="number" name="lessonPackageId" value={newLesson.lessonPackageId} onChange={handleInputChange} placeholder="Package ID" />
        <input type="date" name="date" value={newLesson.date} onChange={handleInputChange} />
        <input type="time" name="time" value={newLesson.time} onChange={handleInputChange} />
        <button onClick={handleAddLesson}>Add Lesson</button>
      </div>
      <table className='lesson-table'>
        <thead>
            <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Package</th>
            <th>Amount</th>
            <th>Remaining</th>
            <th>Date</th>
            <th>Time</th>
            </tr>
        </thead>
        <tbody>
        {lessons.map(lesson => renderLesson(lesson))}
          </tbody>
            </table>
</>  
);
}

export default App

