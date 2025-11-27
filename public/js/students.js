// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const studentIdInput = document.getElementById("student-id");
const studentNameInput = document.getElementById("student-name");
const studentAgeInput = document.getElementById("student-age");
const studentProgramInput = document.getElementById("student-program");
const saveBtn = document.getElementById("save-student");
const studentList = document.getElementById("student-list");

// Load students
async function loadStudents() {
  studentList.innerHTML = "";
  const snapshot = await db.collection("students").where("status","==","active").get();
  snapshot.forEach(doc => {
    const data = doc.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.name}</td>
      <td>${data.age}</td>
      <td>${data.program}</td>
      <td>
        <button class="edit-btn" data-id="${doc.id}">Edit</button>
        <button class="delete-btn" data-id="${doc.id}">Delete</button>
        <button class="archive-btn" data-id="${doc.id}">Archive</button>
      </td>
    `;
    studentList.appendChild(tr);
  });

  // Add event listeners
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => editStudent(btn.dataset.id));
  });
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => deleteStudent(btn.dataset.id));
  });
  document.querySelectorAll(".archive-btn").forEach(btn => {
    btn.addEventListener("click", () => archiveStudent(btn.dataset.id));
  });
}

// Add / Update student
saveBtn.addEventListener("click", async () => {
  const name = studentNameInput.value;
  const age = parseInt(studentAgeInput.value);
  const program = studentProgramInput.value;
  const studentId = studentIdInput.value;

  if(!name || !age || !program){
    alert("Please fill all fields");
    return;
  }

  if(studentId){
    // Update
    await db.collection("students").doc(studentId).update({ name, age, program });
    alert("Student updated successfully!");
  } else {
    // Add new
    await db.collection("students").add({ name, age, program, status:"active" });
    alert("Student added successfully!");
  }

  // Clear form
  studentIdInput.value = "";
  studentNameInput.value = "";
  studentAgeInput.value = "";
  studentProgramInput.value = "";
  
  loadStudents();
});

// Edit student
async function editStudent(id){
  const doc = await db.collection("students").doc(id).get();
  if(doc.exists){
    const data = doc.data();
    studentIdInput.value = doc.id;
    studentNameInput.value = data.name;
    studentAgeInput.value = data.age;
    studentProgramInput.value = data.program;
  }
}

// Delete student
async function deleteStudent(id){
  if(confirm("Are you sure you want to delete this student?")){
    await db.collection("students").doc(id).delete();
    loadStudents();
  }
}

// Archive student
async function archiveStudent(id){
  if(confirm("Archive this student?")){
    await db.collection("students").doc(id).update({ status:"archived" });
    loadStudents();
  }
}

// Initial load
loadStudents();
