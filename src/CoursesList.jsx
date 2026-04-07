import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = "https://demo-render-hosting.onrender.com";

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newTechStack, setNewTechStack] = useState('');

  // ✅ FETCH courses
  useEffect(() => {
    axios.get(`${API_BASE}/api/courses/`)
      .then(response => {
        // ensure it's always an array
        setCourses(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching courses:", error);
        setCourses([]); // prevent map error
        setLoading(false);
      });
  }, []);

  // ✅ ADD COURSE
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${API_BASE}/api/courses/`, {
      course_name:newCourse,
      description:newDesc,
      duration: newDuration,
      tech_stack:newTechStack
      
    })
    .then(response => {
      setCourses([...courses, response.data]);
      setNewCourse('');
      setNewDesc('');
      setNewDuration('');
      setNewTechStack('');
    })
    .catch(error => console.error('Error adding course:', error));
  };

  // ✅ TOGGLE COMPLETE
  // const toggleComplete = (id) => {
  //   const todo = courses.find(t => t.id === id);
  //   if (!todo) return;

  //   axios.put(`${API_BASE}/api/courses/${id}/`, {
  //     ...todo,
  //     completed: !todo.completed
  //   })
  //   .then(response => {
  //     setcourses(courses.map(t => t.id === id ? response.data : t));
  //   })
  //   .catch(error => console.error('Error updating todo:', error));
  // };

  // ✅ DELETE COURSE
  const deleteCourse = (id) => {
    axios.delete(`${API_BASE}/api/courses/${id}/`)
      .then(() => {
        setCourses(courses.filter(cou => cou.id !== id));
      })
      .catch(error => console.error('Error deleting course:', error));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Courses List</h1>

      {/* ✅ FORM */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input 
          value={newCourse} 
          onChange={e => setNewCourse(e.target.value)} 
          placeholder="Course" 
          required 
          className="border p-2 mr-2"
        />
        <input 
          value={newDesc} 
          onChange={e => setNewDesc(e.target.value)} 
          placeholder="Description" 
          required 
          className="border p-2 mr-2"
        />
        <input 
          value={newDuration} 
          onChange={e => setNewDuration(e.target.value)} 
          placeholder="Duration" 
          required 
          className="border p-2 mr-2"
        />
        <input 
          value={newTechStack} 
          onChange={e => setNewTechStack(e.target.value)} 
          placeholder="Tech Stack" 
          required 
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Add Course
        </button>
      </form>

      {/* ✅ LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses available</p>
      ) : (
        <ul>
          {courses.map(cou => (
            <li 
              key={cou.id} 
              className="flex items-center justify-between mb-2 p-2 border"
            >
              <span>
                {cou.course_name} - {cou.description} - {cou.duration} - {cou.tech_stack} 
              </span>

              <div>
                {/* <button 
                  onClick={() => toggleComplete(todo.id)} 
                  className="bg-yellow-500 text-white p-1 mr-2"
                >
                  Toggle
                </button> */}

                <button 
                  onClick={() => deleteCourse(cou.id)} 
                  className="bg-red-500 text-white p-1"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CoursesList;