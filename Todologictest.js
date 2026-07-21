// Run with: node --test
// (Node's built-in test runner — no dependencies to install.)

const test = require("node:test");
const assert = require("node:assert/strict");
const { addTodo, removeTodo, toggleTodo } = require("../todoLogic.js");

test("addTodo adds a new todo with completed:false", () => {
  const result = addTodo([], "Buy milk", 1);
  assert.deepEqual(result, [{ id: 1, text: "Buy milk", completed: false }]);
});

test("addTodo trims whitespace from the text", () => {
  const result = addTodo([], "   Buy milk   ", 1);
  assert.equal(result[0].text, "Buy milk");
});

test("addTodo is a no-op on empty/whitespace-only input", () => {
  const original = [{ id: 1, text: "existing", completed: false }];
  const result = addTodo(original, "   ", 2);
  // Should return the SAME array reference, not a new one — this
  // matters because our UI code checks `todos === before` to decide
  // whether to increment nextId and clear the input.
  assert.equal(result, original);
});

test("addTodo does not mutate the original array", () => {
  const original = [];
  addTodo(original, "task", 1);
  assert.deepEqual(original, []); // original untouched
});

test("removeTodo removes only the matching id", () => {
  const todos = [
    { id: 1, text: "a", completed: false },
    { id: 2, text: "b", completed: false },
  ];
  const result = removeTodo(todos, 1);
  assert.deepEqual(result, [{ id: 2, text: "b", completed: false }]);
});

test("removeTodo with a non-existent id returns an equivalent array unchanged", () => {
  const todos = [{ id: 1, text: "a", completed: false }];
  const result = removeTodo(todos, 999);
  assert.deepEqual(result, todos);
});

test("toggleTodo flips completed on the matching id only", () => {
  const todos = [
    { id: 1, text: "a", completed: false },
    { id: 2, text: "b", completed: false },
  ];
  const result = toggleTodo(todos, 1);
  assert.equal(result[0].completed, true);
  assert.equal(result[1].completed, false); // untouched
});

test("toggleTodo called twice returns to the original state", () => {
  const todos = [{ id: 1, text: "a", completed: false }];
  const toggledOnce = toggleTodo(todos, 1);
  const toggledTwice = toggleTodo(toggledOnce, 1);
  assert.equal(toggledTwice[0].completed, false);
});

test("toggleTodo does not mutate the original array or objects", () => {
  const original = [{ id: 1, text: "a", completed: false }];
  toggleTodo(original, 1);
  assert.equal(original[0].completed, false); // still false — no mutation
});