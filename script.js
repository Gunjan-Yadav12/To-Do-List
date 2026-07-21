// ============================================================
// DAY 1: Todo List — Core concept = event delegation + state
// ============================================================

// --- STATE ---
// This array is the single source of truth. The DOM is just a
// reflection of this data — we never trust the DOM to "remember"
// anything; we re-render from state instead.
let todos = [];
let nextId = 1;

// --- DOM REFERENCES ---
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const count = document.getElementById("count");

// ============================================================
// RENDER
// ============================================================
// Naive approach: wipe the list and rebuild it from scratch every
// time state changes. This is simple and correct, but not the most
// efficient — see the "stretch goal" note at the bottom of this file
// for what a smarter version would do (this is literally the problem
// React's diffing algorithm solves).
function render() {
  list.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "entry" + (todo.completed ? " completed" : "");
    // Store the id on the element itself via a data attribute.
    // This lets our single delegated listener know WHICH todo
    // was clicked, without needing a separate listener per item.
    li.dataset.id = todo.id;

    // The visible checkbox is an SVG we fully control (for the
    // stroke-draw checkmark animation). The real <input> underneath
    // stays functionally a checkbox — screen readers and keyboard
    // users interact with it exactly like any other checkbox — it's
    // just made visually invisible (opacity: 0) via CSS, with the
    // SVG drawn on top for sighted users.
    li.innerHTML = `
      <label class="check">
        <input type="checkbox" class="check-input toggle-checkbox" ${todo.completed ? "checked" : ""} />
        <svg class="check-box" viewBox="0 0 24 24" aria-hidden="true">
          <rect class="check-box-bg" x="1.5" y="1.5" width="21" height="21" rx="6" />
          <path class="check-mark" d="M6 12.5L10 16.5L18 8" />
        </svg>
      </label>
      <span class="todo-text">${escapeHTML(todo.text)}</span>
      <button type="button" class="delete-btn" aria-label="Delete task">✕</button>
    `;

    list.appendChild(li);
  });

  emptyState.classList.toggle("hidden", todos.length > 0);
  updateCount();
}

// Small, separate function so the "what text goes in the count badge"
// logic doesn't clutter render(). Handles the 0-remaining case with
// different copy rather than showing "0 left", which reads oddly.
function updateCount() {
  const remaining = todos.filter((todo) => !todo.completed).length;
  if (todos.length === 0) {
    count.textContent = "";
  } else if (remaining === 0) {
    count.textContent = "all done";
  } else {
    count.textContent = `${remaining} left`;
  }
}

// Basic XSS guard: never trust user input when inserting via innerHTML.
// If someone types "<img src=x onerror=alert(1)>" as a todo, this
// prevents it from executing.
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ============================================================
// EVENT: Adding a todo
// ============================================================
form.addEventListener("submit", (event) => {
  // Forms reload the page on submit by default — preventDefault()
  // stops that so we can handle it with JS instead.
  event.preventDefault();

  const before = todos;
  todos = addTodo(todos, input.value, nextId);
  if (todos === before) return; // addTodo returns the same array on empty input

  nextId++;
  input.value = "";
  render();
});

// ============================================================
// EVENT: Toggle complete / Delete — via DELEGATION
// ============================================================
// Instead of attaching a listener to every <li> (which would mean
// re-attaching listeners every time we re-render), we attach ONE
// listener to the parent <ul>. Clicks on children "bubble up" to
// the parent, and we inspect event.target to figure out what was
// actually clicked.
list.addEventListener("click", (event) => {
  // event.target = the exact element that was clicked
  // event.currentTarget = the element the listener is attached to (the <ul>)
  // These are NOT the same thing — mixing them up is the most common
  // event-delegation bug.
  const li = event.target.closest(".entry");
  if (!li) return; // click landed outside any todo item

  const id = Number(li.dataset.id);

  if (event.target.classList.contains("delete-btn")) {
    todos = removeTodo(todos, id);
    render();
    return;
  }

  if (event.target.classList.contains("toggle-checkbox")) {
    todos = toggleTodo(todos, id);
    render();
  }
});

// Initial render (in case todos was ever pre-populated)
render();

// ============================================================
// STRETCH GOAL (try this once the above works and feels easy):
// Instead of list.innerHTML = "" + rebuilding everything in render(),
// diff the new `todos` array against what's currently in the DOM and
// only touch the <li> elements that actually changed. This is a much
// closer model of how React/Vue work internally, and Day 10 of this
// plan (Virtual DOM Diff) builds exactly this from scratch.
// ============================================================