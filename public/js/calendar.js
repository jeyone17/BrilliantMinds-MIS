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

// Initialize FullCalendar
document.addEventListener('DOMContentLoaded', async function() {
  const calendarEl = document.getElementById('calendar');

  // Fetch sessions from Firestore
  const sessionsSnapshot = await db.collection("sessions").get();
  const events = [];
  sessionsSnapshot.forEach(doc => {
    const data = doc.data();
    events.push({
      id: doc.id,
      title: data.title,
      start: data.start,   // ISO date format: "2025-11-27T09:00:00"
      end: data.end,       // ISO date format
      description: data.description || ''
    });
  });

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    events: events,
    eventClick: function(info) {
      alert(`Session: ${info.event.title}\nStart: ${info.event.start}\nEnd: ${info.event.end}`);
    },
    height: 'auto'
  });

  calendar.render();
});
