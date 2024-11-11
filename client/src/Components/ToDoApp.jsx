import React, { useState, useEffect } from 'react';
import '../App.css';

function ToDoApp() {
    const [task, setTask] = useState('');
    const [taskList, setTaskList] = useState([]);
    const [inProgressList, setInProgressList] = useState([]);
    const [completedList, setCompletedList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTaskToDelete, setSelectedTaskToDelete] = useState(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = () => {
        setTaskList(JSON.parse(localStorage.getItem('taskList')) || []);
        setInProgressList(JSON.parse(localStorage.getItem('inProgressList')) || []);
        setCompletedList(JSON.parse(localStorage.getItem('completedList')) || []);
    };

    const updateLocalStorage = (listName, list) => {
        localStorage.setItem(listName, JSON.stringify(list));
    };

    const addTask = () => {
        if (task.trim() === '') return;
        if (taskList.includes(task) || inProgressList.includes(task) || completedList.includes(task)) {
            alert("Task already exists!");
            return;
        }
        const newTaskList = [...taskList, task];
        setTaskList(newTaskList);
        updateLocalStorage('taskList', newTaskList);
        setTask('');
    };

    const moveToProgress = (taskItem) => {
        setTaskList(taskList.filter(t => t !== taskItem));
        const newInProgressList = [...inProgressList, taskItem];
        setInProgressList(newInProgressList);
        updateLocalStorage('taskList', taskList.filter(t => t !== taskItem));
        updateLocalStorage('inProgressList', newInProgressList);
    };

    const markCompleted = (taskItem) => {
        setInProgressList(inProgressList.filter(t => t !== taskItem));
        const newCompletedList = [...completedList, taskItem];
        setCompletedList(newCompletedList);
        updateLocalStorage('inProgressList', inProgressList.filter(t => t !== taskItem));
        updateLocalStorage('completedList', newCompletedList);
    };

    const clearCompleted = () => {
        setCompletedList([]);
        localStorage.removeItem('completedList');
    };

    const openModal = (taskItem) => {
        setSelectedTaskToDelete(taskItem);
        setShowModal(true);
    };

    const confirmDelete = () => {
        const updatedTaskList = taskList.filter(t => t !== selectedTaskToDelete);
        const updatedInProgressList = inProgressList.filter(t => t !== selectedTaskToDelete);
        const updatedCompletedList = completedList.filter(t => t !== selectedTaskToDelete);

        setTaskList(updatedTaskList);
        setInProgressList(updatedInProgressList);
        setCompletedList(updatedCompletedList);

        updateLocalStorage('taskList', updatedTaskList);
        updateLocalStorage('inProgressList', updatedInProgressList);
        updateLocalStorage('completedList', updatedCompletedList);

        setShowModal(false);
    };

    return (
        <div>
            <div className="heading">
                <h1>To-Do App</h1>
            </div>
            <div className="container">
                <label>Add Item</label>
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Enter Task"
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <button id='add' onClick={addTask}>Add</button>
            </div>
            <div className="container">
                <label>List-Item</label>
                <ul>
                    {taskList.map((taskItem, index) => (
                        <li key={index}>
                            {taskItem}
                            <span>
                                <button className='prg-btn'onClick={() => moveToProgress(taskItem)}>Progress</button>
                                <button className='del-btn'onClick={() => openModal(taskItem)}>Delete</button>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="container">
                <label>In Progress</label>
                <ul>
                    {inProgressList.map((taskItem, index) => (
                        <li key={index}>
                            {taskItem}
                            <span>
                                <button className='cmp-btn'onClick={() => markCompleted(taskItem)}>Completed</button>
                                <button className='del-btn'onClick={() => openModal(taskItem)}>Delete</button>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="container">
                <label>Completed</label>
                <ul>
                    {completedList.map((taskItem, index) => (
                        <li key={index}>
                            {taskItem}.......Task Completed
                        </li>
                    ))}
                </ul>
                <button className='clear' onClick={clearCompleted}>Clear All</button>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span onClick={() => setShowModal(false)} className="close">Close</span>
                        <h3>Are you sure you want to delete</h3>
                        <button onClick={confirmDelete} className="ok">OK</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ToDoApp;
