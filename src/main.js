const handleSetLocalStorage = (key, value) => {
    if (!key || !value) return;
    return localStorage.setItem(key, JSON.stringify(value));
}
const handleGetLocalStorage = (key) => {
    if (!key) return;
    return JSON.parse(localStorage.getItem(key));
}
const handleRemoveLocalStorage = (key) => {
    if (!key) return;
    return localStorage.removeItem(key);
}
let students = []

if (handleGetLocalStorage('students')) {
    students = handleGetLocalStorage('students')

}
else {
    students = [
        {
            name: 'zaky aly',
            email: 'zaky.aly88@gmail.com',
            grade: 2,
            graduation_contact: "+1-613-111-3344",

        }, {
            name: 'hossam mourad',
            email: 'hossam.mourad@example.com',
            grade: 1,
            graduation_contact: "+1-613-555-6677",

        }]
       
    handleSetLocalStorage('students', students)
}


const deleteAllBtnContainer = document.querySelector('#delete-all');
const addNewStudentBtn = document.querySelector('#add-new-student');

const overlay = document.querySelector('.overlay');
const popupDeleteAll = document.querySelector('.popup__delete-all');
const closeBtnDeleteAll = document.querySelector('.popup__delete-all__close');
const cancelBtnDeleteAll = document.querySelector('.popup__delete-all__button--cancel');
const deleteAllBtnStudents = document.querySelector(".popup__delete-all__button--delete")
const tableBody = document.querySelector('.students__table__body');
const popupAddNewStudent = document.querySelector('.popup__new-student');
const closeAddNewStudentBtn = document.querySelector('.popup__new-student__close');
const AddNewStudentForm = document.querySelector('.popup__new-student__form');
const toggleNewStudentForm = document.querySelector('.popup__new-student__form__button--toggle');

let isEditFlag = false
let editIndex = 0
const showModel = (model) => {
    model.classList.remove('hidden');
    overlay.classList.remove('hidden');
}
const hideModel = (model) => {
    model.classList.add('hidden');
    overlay.classList.add('hidden');
}
const handleDeleteAllBtnContainerClick = () => {
    showModel(popupDeleteAll)
}
const handleCancelBtnDeleteAllClick = () => {
    hideModel(popupDeleteAll)
}
const handleCloseBtnDeleteAllClick = () => {
    hideModel(popupDeleteAll)
}
const handleCloseBtnAddNewStudent = () => {
    hideModel(popupAddNewStudent)
}
const handleAddNewStudentBtnClick = () => {
    
    showModel(popupAddNewStudent)
    clearAddNewStudentForm()
    isEditFlag = false
    if(!isEditFlag){
        toggleNewStudentForm.textContent = "Add Student"
    }
}

cancelBtnDeleteAll.addEventListener('click', handleCancelBtnDeleteAllClick);
closeBtnDeleteAll.addEventListener('click', handleCloseBtnDeleteAllClick);
deleteAllBtnContainer.addEventListener('click', handleDeleteAllBtnContainerClick);

overlay.addEventListener('click', () => {
    hideModel(popupDeleteAll)
    hideModel(popupAddNewStudent)
})

const deleteRowTable =(row)=>{
    row.remove()


}
const createRowTable = (index, student) => {
    const row = document.createElement('tr');
    row.className = 'students__table__row';
    row.setAttribute("data-row" , index)
    row.innerHTML = `
    <td class="students__table__cell" data-cell="id">${(index) + 1}</td>
    <td class="students__table__cell" data-cell="name">${student.name}</td>
    <td class="students__table__cell students__table__cell-email" data-cell="email">${student.email}</td>
    <td class="students__table__cell" data-cell="grade">${student.grade}</td>
    <td class="students__table__cell" data-cell="guardian contact">${student.graduation_contact}</td>
    <td class="students__table__cell" data-cell="actions">
    <button class="students__table__cell-button--edit button">Edit</button>
    <span class="cell__slash">/</span>
            <button class="students__table__cell-button--delete button">Delete</button>
        </td>
    `;
    const deleteBtn = row.querySelector('.students__table__cell-button--delete');
    const editBtn = row.querySelector('.students__table__cell-button--edit');
    deleteBtn.addEventListener('click', (e)=>{
        const row = e.target.closest(".students__table__row")
        const studentId = Number(row.dataset.row) 
        students.splice(studentId , 1)
        deleteRowTable(row)
        handleSetLocalStorage('students', students)
    } )
    editBtn.addEventListener('click', (e)=>{
        isEditFlag = true
        const row = e.target.closest(".students__table__row")
        
        const studentId = Number(row.dataset.row) 
        const currentStudent = students[studentId]
        editIndex = studentId
        showModel(popupAddNewStudent)
        if(isEditFlag){
            toggleNewStudentForm.textContent = "Edit Student"
        }
        fillEditStudentValue(currentStudent)
    } )
    return row;
};

const renderTable = () => {
    const fragment = document.createDocumentFragment();
    students.forEach((student, index) => {
        const row = createRowTable(index, student);
        fragment.appendChild(row);
    });

    tableBody.innerHTML = '';
    tableBody.appendChild(fragment);
};
const renderRowTable = (index, student) => {
    const fragment = document.createDocumentFragment();
    const row = createRowTable(index, student);
    fragment.appendChild(row);
    tableBody.appendChild(fragment);
};

document.addEventListener('DOMContentLoaded', renderTable)
/*is it better to use DOMContentLoaded or self invoking function in this case  
or i just call the function directly without any event listener or self invoking function ? */

const handleDeleteAllBtnStudents = () => {
    students.length = 0
    tableBody.innerHTML = ''
    handleRemoveLocalStorage('students')
    hideModel(popupDeleteAll)
}
const ValidationGraduationContact = (input, student) => {
    if (input.value.length !== 10) {
        input.classList.add('popup__new-student__input--error')
    }
    else {
        input.classList.remove('popup__new-student__input--error')
        const formatNumber = `+1-${input.value.slice(0, 3)}-${input.value.slice(3, 6)}-${input.value.slice(6, 10)}`
        student[input.name] = formatNumber
    }
}


const validationAddNewStudentForm = (input, student) => {
    if (input.value === '') {
        input.classList.add('popup__new-student__input--error')
    } else {
        input.classList.remove('popup__new-student__input--error')
        if (input.name === 'graduation_contact') {
            ValidationGraduationContact(input, student)
        }
        else {

            student[input.name] = input.value
        }
    }
}
const addNewStudent = (student , keys) => {
    if (keys.length === 4 ) {
        students.push(student)
        handleSetLocalStorage('students', students)
        hideModel(popupAddNewStudent)
      
        renderRowTable(students.length - 1, student)
            
    }
    else {
        alert('please fill all inputs')
    } }
const editStudent = (inputs) => {
    const currentStudent  = {}
    inputs.forEach(input => {
        input.classList.remove('popup__new-student__input--error')
        if(input.name === "graduation_contact"){
            const number = input.value.replace(/\D/g, '').slice(1)
            input.value = number
            ValidationGraduationContact(input, currentStudent)
        }
        else{
            currentStudent[input.name] = input.value
        }
        
    })
    const keys = Object.keys(currentStudent)
    if (keys.length === 4 ) {
        const row = document.querySelector(`[data-row="${editIndex}"]`)
        students[editIndex] = currentStudent
        const currentStudentRow = createRowTable(editIndex, currentStudent)
        row.replaceWith(currentStudentRow)
        hideModel(popupAddNewStudent)
        handleSetLocalStorage('students', students)            
    }
    else {
        alert('please fill all inputs')
    } 
}

const handleSubmitNewStudentForm = (e) => {
    e.preventDefault()
    const student = {}
    const inputs = AddNewStudentForm.querySelectorAll('input')
    inputs.forEach(input => {
        validationAddNewStudentForm(input, student)
    })
    const keys = Object.keys(student)
    if(!isEditFlag){
        addNewStudent(student , keys)
    }else{
        editStudent(inputs)
    }
    
    clearAddNewStudentForm()
}

const clearAddNewStudentForm = () => {
    const inputs = AddNewStudentForm.querySelectorAll('input')
    inputs.forEach(input => {
        input.value = ''
    })
}
const fillEditStudentValue = (student)=>{
    const inputs = AddNewStudentForm.querySelectorAll('input')
    inputs.forEach(input => {
        input.value = student[input.name]
    })


}
addNewStudentBtn.addEventListener('click', handleAddNewStudentBtnClick)
closeAddNewStudentBtn.addEventListener('click', handleCloseBtnAddNewStudent)
deleteAllBtnStudents.addEventListener("click", handleDeleteAllBtnStudents)
AddNewStudentForm.addEventListener('submit', handleSubmitNewStudentForm)

