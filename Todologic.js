// ============================================================
// Pure functions only — no DOM access here at all.
// This is deliberate: logic that touches the DOM is hard to unit
// test (you need a fake browser environment for it). Logic that
// only transforms plain data is trivial to test. Splitting your
// app into "pure logic" + "DOM glue" like this is one of the most
// useful habits you can build early.
// ============================================================

function addTodo(todos, text, id) {
  const trimmed = text.trim();
  if (!trimmed) return todos; // no-op on empty input, same array reference back
  return [...todos, { id, text: trimmed, completed: false }];
}

function removeTodo(todos, id) {
  return todos.filter((todo) => todo.id !== id);
}

function toggleTodo(todos, id) {
  return todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
}

// Works in both Node (CommonJS, for tests) and the browser (as a
// plain global, since index.html loads this via a <script> tag).
if (typeof module !== "undefined" && module.exports) {
  module.exports = { addTodo, removeTodo, toggleTodo };
}