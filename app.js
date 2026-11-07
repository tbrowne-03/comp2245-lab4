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

async function loadBooks() {
  const params = new URLSearchParams(new FormData(form));

  button.disabled = true;
  status.textContent = 'Searching...';

  try {
    const response = await fetch(`books.php?${params}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const books = await response.json();

    tbody.replaceChildren();

    for (const b of books) {
      const tr = document.createElement('tr');
      const cells = [
        b.title,
        b.author,
        b.year,
        b.subject,
        `${b.available} of ${b.copies}`,
      ];

      cells.forEach((text, i) => {
        const td = document.createElement('td');
        td.textContent = text;
        if (i === 4 && Number(b.available) === 0) {
          td.classList.add('out');
        }
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    }

    if (books.length === 0) {
      status.textContent = 'No books match your search.';
    } else {
      status.textContent = `${books.length} book${books.length === 1 ? '' : 's'} found.`;
    }
  } catch (err) {
    console.error(err);
    tbody.replaceChildren();
    status.textContent = "Couldn't load the books. Please try again.";
  } finally {
    button.disabled = false;
  }
}

// connecting the form and the fields
form.addEventListener('submit', (event) => {
  event.preventDefault();
  loadBooks();
});

subject.addEventListener('change', loadBooks);
document.querySelector('input[name="available"]').addEventListener('change', loadBooks);

// initial page load
loadSubjects();
loadBooks();