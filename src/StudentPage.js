import React, { useEffect, useState } from "react";
import axios from "axios";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [editRow, setEditRow] = useState(null); // Track which row is being edited
  const [updatedScores, setUpdatedScores] = useState({}); // Track updated scores for the row

  // Fetch all students' full information
  const fetchStudents = async () => {
    try {
      console.log("Started Fetch");
      const response = await axios.get("http://192.168.107.55:4000/allStudents", {
        headers: {
          "ngrok-skip-browser-warning": true,
        },
      });
      setStudents(response.data);
      console.log("Completed Fetch");
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle update button click
  const handleUpdateClick = (rollNo, scores) => {
    setEditRow(rollNo);
    setUpdatedScores(scores);
  };

  // Handle input change for updated scores
  const handleScoreChange = (e) => {
    const { name, value } = e.target;
    setUpdatedScores((prevScores) => ({
      ...prevScores,
      [name]: parseInt(value, 10),
    }));
  };

  // Handle submit button click
  const handleSubmitClick = async (rollNo) => {
    try {
      await axios.put(`http://192.168.107.55:4000/student/${rollNo}`, {
        scores: updatedScores,
      });
      setEditRow(null); // Exit edit mode
      fetchStudents(); // Refresh table data
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student.");
    }
  };

  // Handle delete button click
  const handleDeleteClick = async (rollNo) => {
    try {
      alert(
        `Are you sure you want to delete the student with Roll Number: ${rollNo}?`
      );
      await axios.delete(`http://192.168.107.55:4000/student/${rollNo}`);
      alert("Student(s) deleted successfully");
      fetchStudents(); // Refresh the table data
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student.");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Students List</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Java</th>
            <th>CPP</th>
            <th>Python</th>
            <th>GenAI</th>
            <th>FSD</th>
            {/* <th>Action</th> */}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.rollNo} id={`row${student.rollNo}`}>
              <td>{student.name}</td>
              <td>{student.rollNo}</td>
              {["Java", "CPP", "Python", "GenAI", "FSD"].map((subject) => (
                <td key={subject}>
                  {editRow === student.rollNo ? (
                    <input
                      type="number"
                      name={subject}
                      className="form-control"
                      value={updatedScores[subject]}
                      onChange={handleScoreChange}
                    />
                  ) : (
                    student.scores[subject]
                  )}
                </td>
              ))}
              <td>
                {editRow === student.rollNo ? (
                  <button
                    className="btn btn-success"
                    onClick={() => handleSubmitClick(student.rollNo)}
                  >
                    Submit
                  </button>
                ) : (
                  <>
                    <button
                      id={`update${student.rollNo}`}
                      className="btn btn-primary me-2"
                      onClick={() =>
                        handleUpdateClick(student.rollNo, student.scores)
                      }
                    >
                      Update
                    </button>
                    <button
                      id={`delete${student.rollNo}`}
                      className="btn btn-danger"
                      onClick={() => handleDeleteClick(student.rollNo)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Students;
