const form = document.querySelector("form");
const todoInput = document.querySelector("#todo-input");
const addButton = document.querySelector("#add-button");
const todoList = document.querySelector("#todo-list");

let todos = [];

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
    const todo = {
      id: Date.now(),
      text: todoText,
      completed: false,
    };
    todos.push(todo);
    todoInput.value = "";
    renderTodos();
  }
}

// 1. เพิ่ม Alert ยืนยันก่อนลบ
function deleteTodo(id) {
  const isConfirmed = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?");
  if (isConfirmed) {
    todos = todos.filter((todo) => todo.id !== id);
    renderTodos();
  }
}

function toggleCompleted(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      todo.completed = !todo.completed;
    }
    return todo;
  });
  renderTodos();
}

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const todoItem = document.createElement("li");
    const todoText = document.createElement("span");
    const todoDeleteButton = document.createElement("button");

    // 2. สร้าง Checkbox และกำหนดสถานะ
    const myCheck = document.createElement("input");
    myCheck.setAttribute("type", "checkbox");
    myCheck.checked = todo.completed; // ติ๊กถูกตามสถานะจริง

    todoText.textContent = todo.text;
    todoDeleteButton.textContent = "Delete";

    // จัดการ Event สำหรับปุ่มลบ (หยุดการสะท้อน event ไปยัง li)
    todoDeleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTodo(todo.id);
    });

    // ตรวจสอบสถานะเพื่อขีดฆ่าข้อความ
    if (todo.completed) {
      todoItem.classList.add("completed");
    }

    // เมื่อคลิกที่รายการ (li) ให้สลับสถานะ
    todoItem.addEventListener("click", () => toggleCompleted(todo.id));

    // ใส่ Element ลงใน li
    todoItem.appendChild(myCheck);
    todoItem.appendChild(todoText);
    todoItem.appendChild(todoDeleteButton);

    todoList.appendChild(todoItem);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo();
});

renderTodos();