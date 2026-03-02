const textarea = document.querySelector('textarea') /* define a variable and set it equal to the document, select based on a query */
const todoContainer = document.querySelector('.todoContainer')
const form = document.getElementById('todoForm');

const addBtn = document.getElementById('addBtn');
const cancelBtn = document.getElementById('cancelBtn');
const addBtnText = addBtn.querySelector('p'); // since button contains <p>
let editingIndex = null;

// to add with Add Todo
form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo();
});

// so pressing Enter also works 
textarea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    addTodo();
  }
});

let todoList = []  

// as soon as the script loads
function initialLoad() {
    if (!localStorage.getItem('todos')) {return}
    todoList = JSON.parse(localStorage.getItem('todos')).todoList
    updateUI()
}

initialLoad()

function addTodo() {
    const todo = textarea.value.trim()
    if (!todo) { return } // if there is no value just return nothing
    
    if (editingIndex !== null) {
        todoList[editingIndex] = todo
        editingIndex = null
        setEditingMode(false)
    } else {
        todoList.push(todo) // add element to array 
    }

    textarea.value = '' // resets to empty 
    updateUI()
}

function setEditingMode(isEditing) {
    addBtnText.textContent = isEditing ? 'Save' : 'Add Todo';
    cancelBtn.hidden = !isEditing;
}

function cancelEdit() {
    editingIndex = null;
    textarea.value = '';
    setEditingMode(false);
    textarea.focus();
}

cancelBtn.addEventListener('click', cancelEdit);

function editTodo(index) {
    textarea.value = todoList[index];
    editingIndex = index;
    setEditingMode(true);
    textarea.focus();
}

function deleteTodo(index) {
  todoList = todoList.filter((_, i) => i !== index);

  // If we deleted the todo currently being edited: cancel edit
  if (editingIndex === index) {
    cancelEdit();
  }

  // If we deleted something before the edited todo, the edited index shifts down by 1
  if (editingIndex !== null && index < editingIndex) {
    editingIndex -= 1;
  }

  updateUI();
}

// loop over every item in the list
function updateUI() {
    todoContainer.innerHTML = '';

    todoList.forEach((todoElement, todoIndex) => {
        const todoDiv = document.createElement('div');
        todoDiv.className = 'todo';

        const p = document.createElement('p');
        p.textContent = todoElement;

        const btns = document.createElement('div');
        btns.className = 'btnContainer';

        const editBtn = document.createElement('button');
        editBtn.className = 'iconBtn';
        editBtn.type = 'button';
        editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
        editBtn.addEventListener('click', () => editTodo(todoIndex));

        const delBtn = document.createElement('button');
        delBtn.className = 'iconBtn';
        delBtn.type = 'button';
        delBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        delBtn.addEventListener('click', () => deleteTodo(todoIndex));

        btns.append(editBtn, delBtn);
        todoDiv.append(p, btns);
        todoContainer.appendChild(todoDiv);
        });

        // to save to local storage - using a method available in javascript when working in browser
        localStorage.setItem('todos', JSON.stringify({todoList}))
}
