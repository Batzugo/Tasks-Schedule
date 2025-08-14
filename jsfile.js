const STORAGE_KEY = "timetable.tasks.v3";

document.addEventListener("DOMContentLoaded", loadTasks);

function createtask(event) {
  event.preventDefault();
  if (!confirm("Are you sure that you want to create a new task?")) return;
  addRow({ task: "", time: "", place: "" }, true);
}

function addRow(data, isNew = false, index = null) {
  const table = document.getElementById("tableid");
  const tbody = table.tBodies[0] || table.createTBody();

  const row = tbody.insertRow(-1);
  if (index !== null) row.dataset.index = index;

  const c1 = row.insertCell(0);
  const c2 = row.insertCell(1);
  const c3 = row.insertCell(2);
  const cAction = row.insertCell(3);

  if (isNew) {
    const iTask = mkInput(data.task, "Task");
    const iTime = mkInput(data.time, "Time");
    const iPlace = mkInput(data.place, "Place");

    c1.appendChild(iTask);
    c2.appendChild(iTime);
    c3.appendChild(iPlace);

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
	saveBtn.className = "button";
    saveBtn.onclick = () => saveRow(row, iTask, iTime, iPlace);
    cAction.appendChild(saveBtn);
  } else {
    c1.textContent = data.task;
    c2.textContent = data.time;
    c3.textContent = data.place;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
	editBtn.className = "button";
    editBtn.onclick = () => makeEditable(row, data);
    cAction.appendChild(editBtn);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
	delBtn.className = "button";
    delBtn.onclick = () => deleteRow(row);
    cAction.appendChild(delBtn);
  }
}

function mkInput(value, ph, className) {
  const i = document.createElement("input");
  i.type = "text";
  i.value = value;
  i.placeholder = ph;
  i.className = "inputbox";
  return i;
}

function saveRow(row, iTask, iTime, iPlace) {
  const task = iTask.value.trim();
  const time = iTime.value.trim();
  const place = iPlace.value.trim();

  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const existingIndex = row.dataset.index ? parseInt(row.dataset.index) : -1;

  if (existingIndex >= 0) {
    tasks[existingIndex] = { task, time, place };
  } else {
    tasks.push({ task, time, place });
    row.dataset.index = tasks.length - 1; 
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));


  row.cells[0].textContent = task;
  row.cells[1].textContent = time;
  row.cells[2].textContent = place;
  row.cells[3].innerHTML = "";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "button";
  editBtn.onclick = () => makeEditable(row, { task, time, place });
  row.cells[3].appendChild(editBtn);

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.className = "button";
  delBtn.onclick = () => deleteRow(row);
  row.cells[3].appendChild(delBtn);
}

function makeEditable(row, data) {
  row.cells[0].innerHTML = "";
  row.cells[1].innerHTML = "";
  row.cells[2].innerHTML = "";
  row.cells[3].innerHTML = "";

  const iTask = mkInput(data.task, "Task");
  const iTime = mkInput(data.time, "Time");
  const iPlace = mkInput(data.place, "Place");

  row.cells[0].appendChild(iTask);
  row.cells[1].appendChild(iTime);
  row.cells[2].appendChild(iPlace);

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.className = "button";
  saveBtn.onclick = () => saveRow(row, iTask, iTime, iPlace);
  row.cells[3].appendChild(saveBtn);
}

function deleteRow(row) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const index = parseInt(row.dataset.index);

  if (!isNaN(index)) {
    tasks.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  row.remove();
  refreshIndexes(); 
}

function refreshIndexes() {
  const table = document.getElementById("tableid");
  const rows = table.tBodies[0].rows;
  for (let i = 0; i < rows.length; i++) {
    rows[i].dataset.index = i;
  }


  const tasks = [];
  for (let i = 0; i < rows.length; i++) {
    tasks.push({
      task: rows[i].cells[0].textContent,
      time: rows[i].cells[1].textContent,
      place: rows[i].cells[2].textContent
    });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const table = document.getElementById("tableid");
  const tbody = table.tBodies[0] || table.createTBody();
  tbody.innerHTML = ""; 
  
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  tasks.forEach((t, i) => addRow(t, false, i));
}