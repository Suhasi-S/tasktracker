
// GET HTML ELEMENTS

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const emptyMessage = document.getElementById("emptyMessage");
const taskCount = document.getElementById("taskCount");
const progressFill = document.getElementById("progressFill");
const filterSection = document.querySelector(".filter-section");


// LOAD SAVED TASKS

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// SAVE TASKS

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// DISPLAY TASKS

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });


    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";


    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.dataset.id = task.id;

        if (task.completed) {
            li.classList.add("completed");
        }


        // CHECKBOX

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;


        // TASK TEXT

        const span = document.createElement("span");

        span.className = "task-text";
        span.textContent = task.text;


        // EDIT BUTTON

        const editBtn = document.createElement("button");

        editBtn.textContent = "EDIT";
        editBtn.className = "edit-btn";
        editBtn.type = "button";


        // DELETE BUTTON

        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "DELETE";
        deleteBtn.className = "delete-btn";
        deleteBtn.type = "button";


        // ADD ELEMENTS TO LIST ITEM

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);

    });


    updateProgress();
}


// UPDATE PROGRESS

function updateProgress() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    taskCount.textContent = completed + " / " + total;

    const percentage = total === 0
        ? 0
        : (completed / total) * 100;

    progressFill.style.width = percentage + "%";
}


// CREATE TASK

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    currentFilter = "all";
    updateFilterButtons();

    displayTasks();

    taskInput.value = "";
});


// EDIT AND DELETE TASKS

taskList.addEventListener("click", function(event) {

    const li = event.target.closest("li");

    if (!li) return;

    const taskId = Number(li.dataset.id);

    const task = tasks.find(function(task) {
        return task.id === taskId;
    });

    if (!task) return;


    // EDIT

    if (event.target.classList.contains("edit-btn")) {

        const updatedText = prompt("Edit your task:", task.text);

        if (updatedText !== null && updatedText.trim() !== "") {

            task.text = updatedText.trim();

            saveTasks();
            displayTasks();
        }
    }


    // DELETE

    if (event.target.classList.contains("delete-btn")) {

        if (confirm("Are you sure you want to delete this task?")) {

            tasks = tasks.filter(function(task) {
                return task.id !== taskId;
            });

            saveTasks();
            displayTasks();
        }
    }

});


// MARK TASK COMPLETED

taskList.addEventListener("change", function(event) {

    if (!event.target.classList.contains("task-checkbox")) {
        return;
    }

    const li = event.target.closest("li");

    const taskId = Number(li.dataset.id);

    const task = tasks.find(function(task) {
        return task.id === taskId;
    });

    if (task) {

        task.completed = event.target.checked;

        saveTasks();
        displayTasks();
    }

});


// FILTER TASKS

filterSection.addEventListener("click", function(event) {

    const button = event.target.closest(".filter-btn");

    if (!button) return;

    currentFilter = button.dataset.filter;

    updateFilterButtons();

    displayTasks();

});


function updateFilterButtons() {

    document.querySelectorAll(".filter-btn").forEach(function(button) {

        button.classList.toggle(
            "active",
            button.dataset.filter === currentFilter
        );

    });

}


// INITIAL DISPLAY

displayTasks();
