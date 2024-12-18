const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require('cors');

const app = express();
app.use(express.json());

// const corsOptions = {
//   origin: 'https://dcac-2405-201-c400-a04c-cc00-939a-9fbb-3dbe.ngrok-free.app',
// };


app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/Studentss", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const studentSchema = new mongoose.Schema({
  name: String,
  rollNo: String,
  scores: {
    Java: Number,
    CPP: Number,
    Python: Number,
    GenAI: Number,
    FSD: Number,
  },
});

const Student = mongoose.model("Student", studentSchema);

app.post("/student", async (req, res) => {
  try {
    const student = new Student(req.body); 
    await student.save();
    res.status(201).json({ message: "Student added successfully", student });
  } catch (err) {
    res.status(400).json({ message: "Failed to add student", error: err });
  }
});

app.put("/student/:rollNo", async (req, res) => {
  const rollNo = req.params.rollNo;
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { rollNo },
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedStudent) {
      res.status(200).json({ message: "Student updated successfully", updatedStudent });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (err) {
    res.status(400).json({ message: "Failed to update student", error: err });
  }
});

app.delete("/student/:rollNo", async (req, res) => {
  const rollNo = req.params.rollNo;
  try {
    const deletedStudent = await Student.findOneAndDelete({ rollNo });
    if (deletedStudent) {
      res.status(200).json({ message: "Student deleted successfully", deletedStudent });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (err) {
    res.status(400).json({ message: "Failed to delete student", error: err });
  }
});

app.get("/studentsGPA", async (req, res) => {
  try {
    const students = await Student.find({}, { name: 1, rollNo: 1, scores: 1 }); 
    const studentsWithGPA = students.map((student) => {
      const { Java, CPP, Python, GenAI, FSD } = student.scores;
      const gpa = ((Java + CPP + Python + GenAI + FSD) / 5).toFixed(2); 
      return {
        name: student.name, 
        rollNo: student.rollNo,
        gpa,
      };
    });
    res.status(200).json(studentsWithGPA);
  } catch (err) {
    res.status(400).json({ message: "Failed to fetch students", error: err });
  }
});

app.get("/student/:rollNo", async (req, res) => {
  const rollNo = req.params.rollNo;
  try {
    const student = await Student.findOne({ rollNo });
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching student data", error: err });
  }
});

app.get("/allStudents", async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Failed to fetch students", error });
  }
});

app.get("/code-teesko", async(req, res) => {
  res.send(`
// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import AddStudent from "./AddStudent";
// import StudentPage from "./StudentPage";
// import Home from "./Home";
// import About from "./About";
// import Contact from "./Contact";
// import NotFound from "./NotFound";
// import 'bootstrap/dist/css/bootstrap.min.css';

// function App() {
//   return (
//     <Router>
//       <div>
//         <nav>
//           <div>
//             <div>
//             <Link to="/">
//               Home
//             </Link>
//             </div>
//             <div>
//             <Link to="/about">
//               About Us
//             </Link>
//             </div>
//             <div>
//             <Link to="/login">
//               Login
//             </Link>
//             </div>
//             <div>
//             <Link to="/contact">
//               Contact
//             </Link>
//             </div>
            
//           </div>
//         </nav>

//         <div>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />
//             {/* <Route path="/students" element={<StudentPage />} /> */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;
`)
})



const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
