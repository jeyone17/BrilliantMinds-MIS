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

const archiveList = document.getElementById("archive-list");
const searchInput = document.getElementById("search-student");

// Load Archived Students
async function loadArchives() {
  archiveList.innerHTML = "";
  const snapshot = await db.collection("students").where("status", "==", "inactive").get();

  snapshot.forEach(doc => {
    const data = doc.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${doc.id}</td>
      <td>${data.name}</td>
      <td>${data.program}</td>
      <td>${data.startDate || '-'}</td>
      <td>${data.endDate || '-'}</td>
      <td>${data.status}</td>
      <td>
        <button class="restore-btn" data-id="${doc.id}">Restore</button>
        <button class="delete-btn" data-id="${doc.id}">Delete</button>
      </td>
    `;
    archiveList.appendChild(tr);
  });

  // Restore button
  document.querySelectorAll(".restore-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const confirmRestore = confirm("Restore this student to active status?");
      if(confirmRestore){
        await db.collection("students").doc(btn.dataset.id).update({ status: "active" });
        loadArchives();
      }
    });
  });

  // Delete button
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const confirmDelete = confirm("Are you sure you want to permanently delete this student?");
      if(confirmDelete){
        await db.collection("students").doc(btn.dataset.id).delete();
        loadArchives();
      }
    });
  });
}

// Search Function
searchInput.addEventListener("input", () => {
  const filter = searchInput.value.toLowerCase();
  const rows = archiveList.getElementsByTagName("tr");
  Array.from(rows).forEach(row => {
    const cells = row.getElementsByTagName("td");
    let match = false;
    Array.from(cells).forEach(cell => {
      if(cell.textContent.toLowerCase().includes(filter)) match = true;
    });
    row.style.display = match ? "" : "none";
  });
});

// Initial load
loadArchives();
