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

// Expense inputs
const expenseIdInput = document.getElementById("expense-id");
const expenseDescInput = document.getElementById("expense-desc");
const expenseAmountInput = document.getElementById("expense-amount");
const expenseDateInput = document.getElementById("expense-date");
const saveExpenseBtn = document.getElementById("save-expense");
const expenseList = document.getElementById("expense-list");

// Default date
expenseDateInput.value = new Date().toISOString().slice(0,10);

// Load Expenses
async function loadExpenses(){
  expenseList.innerHTML = "";
  const snapshot = await db.collection("expenses").get();
  snapshot.forEach(doc => {
    const data = doc.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.description}</td>
      <td>${data.amount}</td>
      <td>${data.date}</td>
      <td>
        <button class="edit-btn" data-id="${doc.id}">Edit</button>
        <button class="delete-btn" data-id="${doc.id}">Delete</button>
      </td>
    `;
    expenseList.appendChild(tr);
  });

  document.querySelectorAll(".edit-btn").forEach(btn => btn.addEventListener("click", () => editExpense(btn.dataset.id)));
  document.querySelectorAll(".delete-btn").forEach(btn => btn.addEventListener("click", () => deleteExpense(btn.dataset.id)));
}

// Save Expense
saveExpenseBtn.addEventListener("click", async () => {
  const description = expenseDescInput.value;
  const amount = parseFloat(expenseAmountInput.value);
  const date = expenseDateInput.value;
  const expenseId = expenseIdInput.value;

  if(!description || !amount || !date){
    alert("Fill all fields");
    return;
  }

  if(expenseId){
    await db.collection("expenses").doc(expenseId).update({ description, amount, date });
    alert("Expense updated!");
  } else {
    await db.collection("expenses").add({ description, amount, date });
    alert("Expense added!");
  }

  expenseIdInput.value = "";
  expenseDescInput.value = "";
  expenseAmountInput.value = "";
  expenseDateInput.value = new Date().toISOString().slice(0,10);

  loadExpenses();
});

// Edit Expense
async function editExpense(id){
  const doc = await db.collection("expenses").doc(id).get();
  if(doc.exists){
    const data = doc.data();
    expenseIdInput.value = doc.id;
    expenseDescInput.value = data.description;
    expenseAmountInput.value = data.amount;
    expenseDateInput.value = data.date;
  }
}

// Delete Expense
async function deleteExpense(id){
  if(confirm("Delete this expense?")){
    await db.collection("expenses").doc(id).delete();
    loadExpenses();
  }
}

// Initial load
loadExpenses();
