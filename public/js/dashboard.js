// Firebase configuration
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

// Load dashboard data
async function loadDashboard() {
  // Enrolled Students
  const studentsSnapshot = await db.collection("students").where("status", "==", "active").get();
  document.getElementById("enrolled-count").innerText = studentsSnapshot.size;

  // Present Today
  const today = new Date().toISOString().slice(0,10);
  const attendanceSnapshot = await db.collection("attendance")
    .where("date", "==", today)
    .where("status", "==", "present").get();
  document.getElementById("present-count").innerText = attendanceSnapshot.size;

  // Revenue Today
  let revenueToday = 0;
  const paymentsSnapshot = await db.collection("payments")
    .where("status","==","paid")
    .get();
  paymentsSnapshot.forEach(doc => {
    const data = doc.data();
    if(data.date === today) revenueToday += data.amount;
  });
  document.getElementById("revenue-today").innerText = revenueToday;

  // Recent Transactions
  const recentTransactionsEl = document.getElementById("recent-transactions");
  recentTransactionsEl.innerHTML = "";
  paymentsSnapshot.forEach(doc => {
    const data = doc.data();
    const studentDoc = db.collection("students").doc(data.studentId);
    studentDoc.get().then(student => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${data.date}</td>
        <td>${student.exists ? student.data().name : "Unknown"}</td>
        <td>${data.amount}</td>
        <td>${data.status}</td>
      `;
      recentTransactionsEl.appendChild(tr);
    });
  });

  // Income Chart (dummy monthly data for now)
  const incomeCtx = document.getElementById('incomeChart').getContext('2d');
  const incomeChart = new Chart(incomeCtx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Income',
        data: [5000, 7000, 6000, 8000, 7500, 9000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } }
    }
  });
}

// Initialize dashboard
loadDashboard();
