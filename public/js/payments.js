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

// Payment inputs
const paymentIdInput = document.getElementById("payment-id");
const paymentStudentInput = document.getElementById("payment-student");
const paymentAmountInput = document.getElementById("payment-amount");
const paymentDateInput = document.getElementById("payment-date");
const paymentStatusSelect = document.getElementById("payment-status");
const savePaymentBtn = document.getElementById("save-payment");
const paymentList = document.getElementById("payment-list");

// Default date
paymentDateInput.value = new Date().toISOString().slice(0,10);

// Load Payments
async function loadPayments(){
  paymentList.innerHTML = "";
  const snapshot = await db.collection("payments").get();
  snapshot.forEach(doc => {
    const data = doc.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.student}</td>
      <td>${data.amount}</td>
      <td>${data.date}</td>
      <td>${data.status}</td>
      <td>
        <button class="edit-btn" data-id="${doc.id}">Edit</button>
        <button class="delete-btn" data-id="${doc.id}">Delete</button>
      </td>
    `;
    paymentList.appendChild(tr);
  });

  document.querySelectorAll(".edit-btn").forEach(btn => btn.addEventListener("click", () => editPayment(btn.dataset.id)));
  document.querySelectorAll(".delete-btn").forEach(btn => btn.addEventListener("click", () => deletePayment(btn.dataset.id)));
}

// Save Payment
savePaymentBtn.addEventListener("click", async () => {
  const student = paymentStudentInput.value;
  const amount = parseFloat(paymentAmountInput.value);
  const date = paymentDateInput.value;
  const status = paymentStatusSelect.value;
  const paymentId = paymentIdInput.value;

  if(!student || !amount || !date){
    alert("Fill all fields");
    return;
  }

  if(paymentId){
    await db.collection("payments").doc(paymentId).update({ student, amount, date, status });
    alert("Payment updated!");
  } else {
    await db.collection("payments").add({ student, amount, date, status });
    alert("Payment added!");
  }

  paymentIdInput.value = "";
  paymentStudentInput.value = "";
  paymentAmountInput.value = "";
  paymentDateInput.value = new Date().toISOString().slice(0,10);
  paymentStatusSelect.value = "paid";

  loadPayments();
});

// Edit Payment
async function editPayment(id){
  const doc = await db.collection("payments").doc(id).get();
  if(doc.exists){
    const data = doc.data();
    paymentIdInput.value = doc.id;
    paymentStudentInput.value = data.student;
    paymentAmountInput.value = data.amount;
    paymentDateInput.value = data.date;
    paymentStatusSelect.value = data.status;
  }
}

// Delete Payment
async function deletePayment(id){
  if(confirm("Delete this payment?")){
    await db.collection("payments").doc(id).delete();
    loadPayments();
  }
}

// Initial load
loadPayments();
