// app.js
const form    = document.querySelector('form');
const status  = document.querySelector('#status');
const tbody   = document.querySelector('#results tbody');
const subject = document.querySelector('#subject');
const button  = form.querySelector('button[type="submit"]');

async function loadSubjects() {
  try {
    const response = await fetch('subjects.php');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const subjects = await response.json();

    for (const s of subjects) {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.name;
      subject.appendChild(opt);
    }
  } catch (err) {
    console.error(err);
  }
}

// run on page load
loadSubjects();