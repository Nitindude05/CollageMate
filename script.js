// --- Dark Mode Toggle ---
const toggleDarkBtn = document.getElementById('toggle-dark');
const darkIcon = document.getElementById('dark-icon');
const htmlElement = document.documentElement;

// Check for saved theme preference or system preference
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
  htmlElement.classList.add('dark');
  darkIcon.textContent = '🌙'; // Moon icon for dark mode
} else {
  htmlElement.classList.remove('dark');
  darkIcon.textContent = '☀️'; // Sun icon for light mode
}

toggleDarkBtn.addEventListener('click', () => {
  if (htmlElement.classList.contains('dark')) {
    htmlElement.classList.remove('dark');
    darkIcon.textContent = '☀️';
    localStorage.setItem('theme', 'light');
  } else {
    htmlElement.classList.add('dark');
    darkIcon.textContent = '🌙';
    localStorage.setItem('theme', 'dark');
  }
});

// --- Tab Switching Logic ---
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons and hide all content
    tabButtons.forEach(btn => {
      btn.classList.remove('active', 'border-indigo-600', 'dark:border-indigo-400', 'text-indigo-600', 'dark:text-indigo-400');
      btn.classList.add('text-gray-600', 'dark:text-gray-400');
      btn.style.borderBottomWidth = '0px'; // Remove border
    });
    tabContents.forEach(content => content.classList.add('hidden'));

    // Add active class to clicked button and show corresponding content
    const targetTab = button.dataset.tab;
    document.getElementById(`${targetTab}-tab`).classList.remove('hidden');
    button.classList.add('active', 'border-indigo-600', 'dark:border-indigo-400', 'text-indigo-600', 'dark:text-indigo-400');
    button.classList.remove('text-gray-600', 'dark:text-gray-400');
    button.style.borderBottomWidth = '2px'; // Add border
  });
});

// Set default active tab (Tasks)
document.querySelector('[data-tab="tasks"]').click();

// --- Task Management ---
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

// Dummy task data (in a real app, use localStorage or a backend)
let tasks = [
  { id: 'task-1', title: 'Complete Math Assignment', description: 'Finish calculus problems 1-10', dueDate: '2025-07-26', priority: 'medium' },
  { id: 'task-2', title: 'Read Chapter 4', description: 'Biology textbook - Ecology section', dueDate: '2025-07-27', priority: 'low' },
];

function renderTasks() {
  taskList.innerHTML = ''; // Clear existing tasks
  tasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.draggable = true;
    taskItem.classList.add('task-item', 'bg-gray-50', 'dark:bg-gray-700', 'p-4', 'rounded-lg', 'cursor-move');
    taskItem.dataset.id = task.id;

    const priorityClass = {
      low: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      medium: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      high: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    };
    const dueDateText = task.dueDate === new Date().toISOString().slice(0, 10) ? 'Today' : (task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'No due date');

    taskItem.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-medium dark:text-white">${task.title}</h3>
        <span class="text-xs px-2 py-1 rounded-full ${priorityClass[task.priority]}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${task.description || ''}</p>
      <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>${dueDateText}</span>
        <div class="flex space-x-2">
          <button class="hover:text-indigo-600 dark:hover:text-indigo-400 edit-task-btn" data-id="${task.id}">Edit</button>
          <button class="hover:text-red-600 dark:hover:text-red-400 delete-task-btn" data-id="${task.id}">Delete</button>
        </div>
      </div>
    `;
    taskList.appendChild(taskItem);
  });

  addTaskListEventListeners();
}

function addTaskListEventListeners() {
  document.querySelectorAll('.delete-task-btn').forEach(button => {
    button.onclick = (e) => {
      const taskId = e.target.dataset.id;
      tasks = tasks.filter(task => task.id !== taskId);
      renderTasks();
    };
  });

  document.querySelectorAll('.edit-task-btn').forEach(button => {
    button.onclick = (e) => {
      const taskId = e.target.dataset.id;
      const taskToEdit = tasks.find(task => task.id === taskId);
      if (taskToEdit) {
        // Populate form for editing (for simplicity, we'll just log here)
        alert(`Editing task: ${taskToEdit.title}. In a real app, this would open a modal or populate the form.`);
        // Example: populate form fields
        document.getElementById('task-title').value = taskToEdit.title;
        document.getElementById('task-due').value = taskToEdit.dueDate;
        document.getElementById('task-priority').value = taskToEdit.priority;
        document.getElementById('task-description').value = taskToEdit.description;
        // You'd also need a way to differentiate between adding and updating
      }
    };
  });
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('task-title').value;
  const dueDate = document.getElementById('task-due').value;
  const priority = document.getElementById('task-priority').value;
  const description = document.getElementById('task-description').value;

  const newTask = {
    id: `task-${Date.now()}`, // Simple unique ID
    title,
    dueDate,
    priority,
    description
  };
  tasks.push(newTask);
  renderTasks();
  taskForm.reset(); // Clear the form
});

renderTasks(); // Initial render of tasks

// --- Notes Management ---
const noteForm = document.getElementById('note-form');
const notesList = document.getElementById('notes-list');
const noteSearchInput = document.getElementById('note-search');

// Dummy note data
let notes = [
  { id: 'note-1', title: 'Calculus Formulas', subject: 'math', content: 'Derivatives of trigonometric functions, chain rule applications, and integration techniques...', lastUpdated: '2 days ago' },
  { id: 'note-2', title: 'Biology Key Terms', subject: 'science', content: 'Cell structure, photosynthesis steps, DNA replication phases, and genetic inheritance patterns...', lastUpdated: '1 week ago' },
];

function renderNotes(filteredNotes = notes) {
  notesList.innerHTML = ''; // Clear existing notes
  filteredNotes.forEach(note => {
    const noteCard = document.createElement('div');
    noteCard.classList.add('note-card', 'p-4', 'rounded-lg', 'border');
    noteCard.dataset.id = note.id;

    let subjectBgClass = '';
    let subjectBorderClass = '';
    let subjectTextColorClass = '';

    switch (note.subject) {
      case 'math':
        subjectBgClass = 'bg-indigo-100 dark:bg-indigo-900';
        subjectBorderClass = 'border-indigo-100 dark:border-gray-600';
        subjectTextColorClass = 'text-indigo-800 dark:text-indigo-200';
        noteCard.classList.add('from-indigo-50', 'to-purple-50', 'dark:from-gray-700', 'dark:to-gray-800');
        break;
      case 'science':
        subjectBgClass = 'bg-green-100 dark:bg-green-900';
        subjectBorderClass = 'border-green-100 dark:border-gray-600';
        subjectTextColorClass = 'text-green-800 dark:text-green-200';
        noteCard.classList.add('from-green-50', 'to-teal-50', 'dark:from-gray-700', 'dark:to-gray-800');
        break;
      default:
        subjectBgClass = 'bg-gray-100 dark:bg-gray-700';
        subjectBorderClass = 'border-gray-100 dark:border-gray-600';
        subjectTextColorClass = 'text-gray-800 dark:text-gray-200';
        noteCard.classList.add('from-gray-50', 'to-gray-100', 'dark:from-gray-700', 'dark:to-gray-800');
    }
    noteCard.classList.add('bg-gradient-to-br', subjectBorderClass);


    noteCard.innerHTML = `
      <div class="flex justify-between items-start mb-3">
        <h3 class="font-medium dark:text-white">${note.title}</h3>
        <span class="text-xs px-2 py-1 rounded-full ${subjectBgClass} ${subjectTextColorClass}">${note.subject.charAt(0).toUpperCase() + note.subject.slice(1)}</span>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">${note.content}</p>
      <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>Last updated: ${note.lastUpdated}</span>
        <div class="flex space-x-2">
          <button class="hover:text-indigo-600 dark:hover:text-indigo-400 edit-note-btn" data-id="${note.id}">Edit</button>
          <button class="hover:text-red-600 dark:hover:text-red-400 delete-note-btn" data-id="${note.id}">Delete</button>
        </div>
      </div>
    `;
    notesList.appendChild(noteCard);
  });

  addNoteListEventListeners();
}

function addNoteListEventListeners() {
  document.querySelectorAll('.delete-note-btn').forEach(button => {
    button.onclick = (e) => {
      const noteId = e.target.dataset.id;
      notes = notes.filter(note => note.id !== noteId);
      renderNotes();
    };
  });

  document.querySelectorAll('.edit-note-btn').forEach(button => {
    button.onclick = (e) => {
      const noteId = e.target.dataset.id;
      const noteToEdit = notes.find(note => note.id === noteId);
      if (noteToEdit) {
        alert(`Editing note: ${noteToEdit.title}. In a real app, this would open a modal or populate the form.`);
        document.getElementById('note-title').value = noteToEdit.title;
        document.getElementById('note-subject').value = noteToEdit.subject;
        document.getElementById('note-content').value = noteToEdit.content;
      }
    };
  });
}


noteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('note-title').value;
  const subject = document.getElementById('note-subject').value;
  const content = document.getElementById('note-content').value;

  const newNote = {
    id: `note-${Date.now()}`,
    title,
    subject,
    content,
    lastUpdated: 'Just now'
  };
  notes.push(newNote);
  renderNotes();
  noteForm.reset();
});

noteSearchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm) ||
    note.content.toLowerCase().includes(searchTerm) ||
    note.subject.toLowerCase().includes(searchTerm)
  );
  renderNotes(filteredNotes);
});

renderNotes(); // Initial render of notes

// --- Calendar Logic ---
const currentMonthYear = document.getElementById('current-month-year');
const calendarGrid = document.getElementById('calendar-grid');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

let currentDate = new Date();

function renderCalendar() {
  calendarGrid.innerHTML = ''; // Clear existing days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  currentMonthYear.textContent = new Date(year, month).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // Get the first day of the month and last day of the month
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Calculate the day of the week for the first day (0 for Sunday, 1 for Monday, etc.)
  const startDay = firstDayOfMonth.getDay();

  // Populate leading empty days
  for (let i = 0; i < startDay; i++) {
    const emptyDay = document.createElement('div');
    calendarGrid.appendChild(emptyDay);
  }

  // Populate actual days of the month
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('p-2', 'rounded-lg', 'calendar-day', 'cursor-pointer', 'hover:bg-gray-200', 'dark:hover:bg-gray-700');
    dayElement.textContent = day;

    if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
      dayElement.classList.add('bg-indigo-500', 'text-white', 'font-bold'); // Highlight current day
    } else {
      dayElement.classList.add('text-gray-800', 'dark:text-gray-200');
    }

    calendarGrid.appendChild(dayElement);
  }
}

prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar(); // Initial render of calendar