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

const attendanceDateInput = document.getElementById("attendance-date");
const loadBtn = document.getElementById("load-attendance");
const tableBody = document.querySelector("#attendance-table tbody");
const saveBtn = document.getElementById("save-attendance");

// Set today as default date
attendanceDateInput.value = new Date().toISOString().slice(0,10);

// Load students from Firestore
async function loadStudents() {
  const date = attendanceDateInput.value;
  tableBody.innerHTML = "";
  const studentsSnapshot = await db.collection("students").where("status","==","active").get();
  
  studentsSnapshot.forEach(doc => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${doc.data().name}</td>
      <td>
        <select data-student-id="${doc.id}">
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  // Load existing attendance for selected date
  const attendanceSnapshot = await db.collection("attendance")
    .where("date", "==", date)
    .get();
  attendanceSnapshot.forEach(attDoc => {
    const selectEl = document.querySelector(`select[data-student-id="${attDoc.data().studentId}"]`);
    if(selectEl) selectEl.value = attDoc.data().status;
  });
}

// Save attendance to Firestore
async function saveAttendance() {
  const date = attendanceDateInput.value;
  const selects = document.querySelectorAll("select[data-student-id]");
  
  for(const select of selects){
    const studentId = select.getAttribute("data-student-id");
    const status = select.value;

    // Check if attendance already exists for this student and date
    const existing = await db.collection("attendance")
      .where("studentId","==",studentId)
      .where("date","==",date)
      .get();

    if(existing.empty){
      // Add new record
      await db.collection("attendance").add({ studentId, date, status });
    } else {
      // Update existing record
      existing.forEach(doc => {
        db.collection("attendance").doc(doc.id).update({ status });
      });
    }
  }
  alert("Attendance saved successfully!");
}

// Event listeners
loadBtn.addEventListener("click", loadStudents);
saveBtn.addEventListener("click", saveAttendance);

// Load students on page load
loadStudents();
