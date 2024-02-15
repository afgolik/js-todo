let tasks = [
    {
        id: '1138465078061',
        completed: false,
        text: 'Купить 2 арбуза',
    },
    {
        id: '1138465078062',
        completed: false,
        text: 'Съесть 1 арбуз',
    },
    {
        id: '1138465078063',
        completed: false,
        text: 'Отдать 1 арбуз соседке',
    },
];
const body = document.querySelector('body');
const tasksList = document.querySelector('.tasks-list');
function render(array){
    array.forEach(item => addTaskItem(item));
}
render(tasks);
function addTaskItem(task){
    const taskItem = createCustomElement('div', {className: 'task-item'});
    taskItem.dataset.taskId = task.id;
    tasksList.append(taskItem);
    const taskItemMainContainer = createCustomElement('div', {className: 'task-item__main-container'});
    taskItem.append(taskItemMainContainer);
    const taskItemMainContent = createCustomElement('div', {className: 'task-item__main-content'});
    taskItemMainContainer.append(taskItemMainContent);
    const form = createCustomElement('form', {className: 'checkbox-form'});
    taskItemMainContent.append(form);
    const input = createCustomElement('input', {className: 'checkbox-form__checkbox', type: 'checkbox', id: task.id});
    form.append(input);
    const label = createCustomElement('label', {htmlFor: task.id});
    form.append(label);
    const span = createCustomElement('span', {className: 'task-item__text', textContent: task.text});
    taskItemMainContent.append(span);
    const button = createCustomElement('button', {className: 'task-item__delete-button default-button delete-button', textContent: 'Удалить', dataset: {taskId: task.id}});
    button.dataset.taskId = task.id;
    taskItemMainContainer.append(button);
}

//функции для создания элементов
function createCustomElement(elementName, object){
    const element = document.createElement(elementName);
    for(let key in object){
        if(typeof object[key] === "object"){
            for(let innerKey in object[key]){
                element[key][innerKey] = object[key][innerKey];
            }
        }else{
            element[key] = object[key]
        }
    }
    return element;
}

//валидация формы
const createTaskBlock = document.querySelector('.create-task-block');
createTaskBlock.addEventListener('submit', event => {
    event.preventDefault();
    const newTaskText = document.querySelector('.create-task-block__input').value
    const errorType = getErrorType(newTaskText);
    if(errorType){
        const errorText = errorType === 'isEmpty' ? 'Название задачи не должно быть пустым' : 'Задача с таким названием уже существует.';
        createError(errorText);
    }else{
        removeError();
        const newTask = {
            id: `${Date.now()}`,
            completed: false,
            text: newTaskText
        };
        tasks.push(newTask);
        addTaskItem(newTask);
    }
});
function createError(text){
    const error = document.querySelector('.error-message-block');
    if(error){
        error.textContent = text;
    }else{
        const newError = createCustomElement('span', {className: 'error-message-block', textContent: text});
        createTaskBlock.append(newError);
    }
}
function removeError(){
    const error = document.querySelector('.error-message-block');
    if(error){
        error.remove();
    }
}
function getErrorType(text){
    let errorType = null;
    const isContainTask = tasks.some((item) => item.text === text);
    if(text === ''){
        errorType = 'isEmpty';
    }else if(isContainTask){
        errorType = 'isRepeated';
    }
    return errorType;
}

//модальное окно
const modalOverlay = createCustomElement('div', {className: 'modal-overlay_hidden'});
body.append(modalOverlay);
const deleteModal = createCustomElement('div', {className: 'delete-modal'});
modalOverlay.append(deleteModal);
const h3 = document.createElement('h3');
h3.className = 'delete-modal__question';
h3.textContent = 'Вы действительно хотите удалить эту задачу?';
deleteModal.append(h3);
const deleteModalButtons = createCustomElement('div', {className: 'delete-modal__buttons'});
deleteModal.append(deleteModalButtons);
const deleteButtonCancel = createCustomElement('button', {className: 'delete-modal__button delete-modal__cancel-button', textContent: 'Отмена'});
deleteModalButtons.append(deleteButtonCancel);
const deleteButtonConfirm = createCustomElement('button', {className: 'delete-modal__button delete-modal__confirm-button', textContent: 'Удалить'});
deleteModalButtons.append(deleteButtonConfirm);

//открываем модалку
let currentTaskId;
tasksList.addEventListener('click', event => {
    const deleteButton = event.target.closest('button');
    if(deleteButton){
        modalOverlay.className = 'modal-overlay';
        currentTaskId = deleteButton.getAttribute('data-task-id');
    }
});
//закрываем модалку
deleteButtonCancel.addEventListener('click', event => {
    modalOverlay.className = 'modal-overlay_hidden';
});
document.addEventListener('keyup', event => {
    if(event.key === 'Escape'){
        modalOverlay.className = 'modal-overlay_hidden';
    }
});
//удаляем задачу
deleteButtonConfirm.addEventListener('click', event => {
    tasks = tasks.filter(task => {
        return task.id !== currentTaskId;
    });
    let taskItem = tasksList.querySelectorAll('div[data-task-id]');
    taskItem.forEach(task => {
        if(task.getAttribute('data-task-id') === currentTaskId){
            task.remove();
        }
    });
    modalOverlay.className = 'modal-overlay_hidden';
});
