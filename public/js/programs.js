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

// DOM Elements
const programIdInput = document.getElementById("program-id");
const programNameInput = document.getElementById("program-name");
const programDescInput = document.getElementById("program-desc");
const programDurationInput = document.getElementById("program-duration");
const programPriceInput = document.getElementById("program-price");
const programSessionPriceInput = document.getElementById("program-session-price");
const programStatusSelect = document.getElementById("program-status");
const saveProgramBtn = document.getElementById("save-program");
const programList = document.getElementById("program-list");

// Load Programs
async function loadPrograms() {
  programList.innerHTML = "";
  const snapshot = await db.collection("programs").get();
  snapshot.forEach(doc => {
    const data = doc.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.name}</td>
      <td>${data.description}</td>
      <td>${data.duration}</td>
      <td>${data.price}</td>
      <td>${data.sessionPrice}</td>
      <td>${data.status}</td>
      <td>
        <button class="edit-btn" data-id="${doc.id}">Edit</button>
        <button class="delete-btn" data-id="${doc.id}">Delete</button>
      </td>
    `;
    programList.appendChild(tr);
  });

  // Edit buttons
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => editProgram(btn.dataset.id));
  });

  // Delete buttons
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => deleteProgram(btn.dataset.id));
  });
}

// Save Program
saveProgramBtn.addEventListener("click", async () => {
  const name = programNameInput.value.trim();
  const description = programDescInput.value.trim();
  const duration = programDurationInput.value.trim();
  const price = parseFloat(programPriceInput.value);
  const sessionPrice = parseFloat(programSessionPriceInput.value);
  const status = programStatusSelect.value;
  const id = programIdInput.value;

  if(!name || !description || !duration || isNaN(price) || isNaN(sessionPrice)){
    alert("Please fill all fields correctly.");
    return;
  }

  if(id){
    await db.collection("programs").doc(id).update({ name, description, duration, price, sessionPrice, status });
    alert("Program updated!");
  } else {
    await db.collection("programs").add({ name, description, duration, price, sessionPrice, status });
    alert("Program added!");
  }

  // Reset form
  programIdInput.value = "";
  programNameInput.value = "";
  programDescInput.value = "";
  programDurationInput.value = "";
  programPriceInput.value = "";
  programSessionPriceInput.value = "";
  programStatusSelect.value = "active";

  loadPrograms();
});

// Edit Program
async function editProgram(id){
  const doc = await db.collection("programs").doc(id).get();
  if(doc.exists){
    const data = doc.data();
    programIdInput.value = doc.id;
    programNameInput.value = data.name;
    programDescInput.value = data.description;
    programDurationInput.value = data.duration;
    programPriceInput.value = data.price;
    programSessionPriceInput.value = data.sessionPrice;
    programStatusSelect.value = data.status;
  }
}

// Delete Program
async function deleteProgram(id){
  const confirmDelete = confirm("Are you sure you want to delete this program?");
  if(confirmDelete){
    await db.collection("programs").doc(id).delete();
    loadPrograms();
  }
}

// Initial load
loadPrograms();
