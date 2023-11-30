/* eslint-disable new-cap */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const handleSetLocalStorage = (key, value) => {
  if (!key || !value) return
  return localStorage.setItem(key, JSON.stringify(value))
}
const handleGetLocalStorage = (key) => {
  if (!key) return
  return JSON.parse(localStorage.getItem(key))
}
const handleRemoveLocalStorage = (key) => {
  if (!key) return
  return localStorage.removeItem(key)
}
let students = []
let grades = {}

if (handleGetLocalStorage('students')) {
  students = handleGetLocalStorage('students')
  grades = handleGetLocalStorage('grades')
} else {
  students = [
    {
      name: 'zaky aly',
      email: 'zaky.aly88@gmail.com',
      grade: 2,
      graduation_contact: '+1-613-111-3344'
    },
    {
      name: 'hossam mourad',
      email: 'hossam.mourad@example.com',
      grade: 1,
      graduation_contact: '+1-613-555-6677'
    }
  ]
  const gradesList = students
    .map((student) => student.grade)
    .sort((a, b) => a - b)
  gradesList.forEach((grade) => {
    grades[grade] = 1
  })
  handleSetLocalStorage('grades', grades)
  handleSetLocalStorage('students', students)
}

const deleteAllBtnContainer = document.querySelector('#delete-all')
const addNewStudentBtn = document.querySelector('#add-new-student')

const overlay = document.querySelector('.overlay')
const popupDeleteAll = document.querySelector('.popup__delete-all')
const closeBtnDeleteAll = document.querySelector('.popup__delete-all__close')
const cancelBtnDeleteAll = document.querySelector(
  '.popup__delete-all__button--cancel'
)
const deleteAllBtnStudents = document.querySelector(
  '.popup__delete-all__button--delete'
)
const tableBody = document.querySelector('.students__table__body')
const popupAddNewStudent = document.querySelector('.popup__new-student')
const closeAddNewStudentBtn = document.querySelector(
  '.popup__new-student__close'
)
const AddNewStudentForm = document.querySelector('.popup__new-student__form')
const toggleNewStudentForm = document.querySelector(
  '.popup__new-student__form__button--toggle'
)
const downloadTableBtn = document.querySelector('#download-btn')
const dropdownDownloadAll = document.querySelector('.dropdown__download-all')
const csvBtn = document.querySelector('#csv-btn')
const pdfBtn = document.querySelector('#pdf-btn')
const searchForStudent = document.querySelector('.search__input')
const searchSelectGrade = document.querySelector('.search__select')
const titleToggleStudent = document.querySelector('.popup__new-student__title')
let isEditFlag = false
let editIndex = 0
const showModel = (model) => {
  model.classList.remove('hidden')
  overlay.classList.remove('hidden')
}
const hideModel = (model) => {
  model.classList.add('hidden')
  overlay.classList.add('hidden')
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
const clearAddNewStudentForm = () => {
  const inputs = AddNewStudentForm.querySelectorAll('input')
  inputs.forEach((input) => {
    input.value = ''
  })
}
const initSelectGrades = (value = 'All grades') => {
  searchSelectGrade.innerHTML = ''
  searchSelectGrade.innerHTML = `
  <option class="search__select-option" value="all">
  ${value}
  </option>`
}
const handleAddNewStudentBtnClick = () => {
  showModel(popupAddNewStudent)
  clearAddNewStudentForm()
  isEditFlag = false
  if (!isEditFlag) {
    toggleNewStudentForm.textContent = 'Add Student'
    titleToggleStudent.textContent = 'Add New Student'
  }
}
const fillEditStudentValue = (student) => {
  const inputs = AddNewStudentForm.querySelectorAll('input')
  inputs.forEach((input) => {
    input.value = student[input.name]
  })
}

cancelBtnDeleteAll.addEventListener('click', handleCancelBtnDeleteAllClick)
closeBtnDeleteAll.addEventListener('click', handleCloseBtnDeleteAllClick)
deleteAllBtnContainer.addEventListener(
  'click',
  handleDeleteAllBtnContainerClick
)

overlay.addEventListener('click', () => {
  hideModel(popupDeleteAll)
  hideModel(popupAddNewStudent)
})

const deleteRowTable = (row) => {
  row.remove()
}
const deleteSelectGrade = (grade) => {
  const options = searchSelectGrade.querySelectorAll('option')
  options.forEach((option) => {
    if (Number(option.value) === grade) {
      option.remove()
    }
  })
}
const createRowTable = (index, student) => {
  const row = document.createElement('tr')
  row.setAttribute('data-row', index)
  row.className = 'students__table__row'
  row.innerHTML = `
    <td class='students__table__cell' data-cell='id'>${index + 1}</td>
    <td class='students__table__cell' data-cell='name'>${student.name}</td>
    <td class='students__table__cell students__table__cell-email' data-cell='email'>${
      student.email
    }</td>
    <td class='students__table__cell' data-cell='grade'>${student.grade}</td>
    <td class='students__table__cell' data-cell='guardian contact'>${
      student.graduation_contact
    }</td>
    <td class='students__table__cell' data-cell='actions'>
    <button 
    data-editId='${index}'
    class='students__table__cell-button--edit button'>Edit</button>
    <span class='cell__slash'>/</span>
            <button 
            data-deleteId='${index}'
            class='students__table__cell-button--delete button'>Delete</button>
        </td>
    `

  const deleteBtn = row.querySelector('.students__table__cell-button--delete')
  const editBtn = row.querySelector('.students__table__cell-button--edit')
  deleteBtn.addEventListener('click', (e) => {
    const studentId = Number(e.target.dataset.deleteid)
    if (studentId === undefined || studentId === null) return
    students.splice(studentId, 1)
    deleteRowTable(row)
    const grade = Number(student.grade)
    grades[grade] -= 1
    if (grades[grade] === 0) {
      deleteSelectGrade(grade)
      delete grades[grade]
    }
    handleSetLocalStorage('students', students)
    handleSetLocalStorage('grades', grades)
  })
  editBtn.addEventListener('click', (e) => {
    isEditFlag = true
    const studentId = Number(e.target.dataset.editid)
    if (studentId === undefined || studentId === null) return
    const currentStudent = students[studentId]
    editIndex = studentId
    showModel(popupAddNewStudent)
    if (isEditFlag) {
      toggleNewStudentForm.textContent = 'Edit Student'
      titleToggleStudent.textContent = `Edit ${currentStudent.name} Information`
    }
    fillEditStudentValue(currentStudent)
  })
  return row
}

const renderTable = (students) => {
  const fragment = document.createDocumentFragment()
  students.forEach((student, index) => {
    const row = createRowTable(index, student)
    fragment.appendChild(row)
  })

  tableBody.innerHTML = ''
  tableBody.appendChild(fragment)
}
const createSelectSearchGrade = (grade) => {
  const option = document.createElement('option')
  option.className = 'search__select-option'
  option.setAttribute('value', grade)
  option.textContent = grade
  return option
}
const renderSelectGrade = (grades) => {
  const fragment = document.createDocumentFragment()
  const gradesList = Object.keys(grades)
  gradesList.forEach((grade) => {
    const row = createSelectSearchGrade(grade)
    fragment.appendChild(row)
  })

  searchSelectGrade.appendChild(fragment)
}
const renderRowTable = (index, student) => {
  const fragment = document.createDocumentFragment()
  const row = createRowTable(index, student)
  fragment.appendChild(row)
  tableBody.appendChild(fragment)
}
const renderOptionSelectGrade = (grade) => {
  const fragment = document.createDocumentFragment()
  const option = createSelectSearchGrade(grade)
  fragment.appendChild(option)

  searchSelectGrade.appendChild(fragment)
}
document.addEventListener('DOMContentLoaded', () => {
  renderTable(students)
  renderSelectGrade(grades)
})

const handleDeleteAllBtnStudents = () => {
  students.length = 0
  grades = {}
  tableBody.innerHTML = ''
  initSelectGrades()
  handleRemoveLocalStorage('students')
  handleRemoveLocalStorage('grades')

  hideModel(popupDeleteAll)
}
const validationAddNewStudentForm = (input, student) => {
  if (input.value === '') {
    input.classList.add('popup__new-student__input--error')
  } else {
    input.classList.remove('popup__new-student__input--error')
    student[input.name] = input.value
  }
}
const addNewStudent = (student, keys) => {
  if (keys.length === 4) {
    students.push(student)
    handleSetLocalStorage('students', students)
    hideModel(popupAddNewStudent)

    renderRowTable(students.length - 1, student)
    const grade = Number(student.grade)
    if (!grades[grade]) {
      grades[grade] = 1
    } else {
      grades[grade] += 1
    }
    handleSetLocalStorage('grades', grades)

    if (grades[grade] === 1) {
      renderOptionSelectGrade(grade)
    }
  } else {
    // eslint-disable-next-line no-alert
    alert('please fill all inputs')
  }
}
const editStudent = (inputs) => {
  const currentStudent = {}
  inputs.forEach((input) => {
    input.classList.remove('popup__new-student__input--error')
    currentStudent[input.name] = input.value
  })
  const keys = Object.keys(currentStudent)
  if (keys.length === 4) {
    const row = document.querySelector(`[data-row='${editIndex}']`)
    const prevStudentData = students[editIndex]
    students[editIndex] = currentStudent
    const currentStudentRow = createRowTable(editIndex, currentStudent)
    row.replaceWith(currentStudentRow)
    hideModel(popupAddNewStudent)
    handleSetLocalStorage('students', students)
    const prevsGrade = Number(prevStudentData.grade)
    const currentGrade = Number(currentStudent.grade)
    if (prevsGrade !== currentGrade) {
      grades[prevsGrade] -= 1
      if (grades[prevsGrade] === 0) {
        deleteSelectGrade(prevsGrade)
        delete grades[prevsGrade]
      }
      if (!grades[currentGrade]) {
        grades[currentGrade] = 1
        renderOptionSelectGrade(currentGrade)
      } else {
        grades[currentGrade] += 1
      }
    }
    handleSetLocalStorage('grades', grades)
  } else {
    // eslint-disable-next-line no-alert
    alert('please fill all inputs')
  }
}

const handleSubmitNewStudentForm = (e) => {
  e.preventDefault()
  const student = {}
  const inputs = AddNewStudentForm.querySelectorAll('input')
  inputs.forEach((input) => {
    validationAddNewStudentForm(input, student)
  })
  const keys = Object.keys(student)
  if (!isEditFlag) {
    addNewStudent(student, keys)
  } else {
    editStudent(inputs)
  }

  clearAddNewStudentForm()
}

const handleToggleDropdownDownload = (e) => {
  const downloadBtnBounds = e.target.getBoundingClientRect()
  dropdownDownloadAll.style.position = 'absolute'
  dropdownDownloadAll.style.top = `${
    window.scrollY + downloadBtnBounds.bottom + 15
  }px`
  dropdownDownloadAll.style.right = `${10}px`

  dropdownDownloadAll.classList.toggle('hidden-dropdown')
}
const formatDate = () => {
  const today = new Date()
  return today.toLocaleDateString('en-US')
}
const convertJSONToCSV = () => {
  let csv = ''
  const studentsHeader = Object.keys(students[0])
  csv += `${studentsHeader.join(', ')}\n`
  students.forEach((studentRow) => {
    const data = studentsHeader
      .map((header) => JSON.stringify(studentRow[header]).replaceAll('"', ''))
      .join(', ')
    csv += `${data}\n`
  })
  return csv
}
const convertJSONToPDF = () => {
  const doc = new jsPDF()
  autoTable(doc, {
    html: '.students__table',
    styles: { overflow: 'linebreak' },
    margin: { top: 10 },
    theme: 'grid'
  })
  doc.save(`students-${formatDate()}.pdf`)
}
const handleDownloadCSVFile = () => {
  const studentCSV = convertJSONToCSV()
  const blob = new Blob([studentCSV], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `students-${formatDate()}.csv`
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  dropdownDownloadAll.classList.toggle('hidden-dropdown')
}
const handleDownloadPDFFile = () => {
  convertJSONToPDF()
  dropdownDownloadAll.classList.toggle('hidden-dropdown')
}
// is render all table and print dom every time when user search for student is good idea ?
// is there is another way for dom manipulation ?
// for small app like this should i use debounce  ?
const handleFilterStudents = (e) => {
  const { value } = e.target
  if (!value) {
    renderTable(students)
    return
  }
  const filterStudents = students.filter((student) => {
    const values = Object.values(student)
    return values.some((val) =>
      val.toString().toLowerCase().includes(value.toLowerCase())
    )
  })
  renderTable(filterStudents)
}
const filterGrades = (e) => {
  const filterStudents = students.filter((student) => {
    return Number(student.grade) === Number(e.target.value)
  })
  if (e.target.value === 'all') {
    renderTable(students)
    return
  }
  renderTable(filterStudents)
}
addNewStudentBtn.addEventListener('click', handleAddNewStudentBtnClick)
closeAddNewStudentBtn.addEventListener('click', handleCloseBtnAddNewStudent)
deleteAllBtnStudents.addEventListener('click', handleDeleteAllBtnStudents)
AddNewStudentForm.addEventListener('submit', handleSubmitNewStudentForm)
downloadTableBtn.addEventListener('click', handleToggleDropdownDownload)
csvBtn.addEventListener('click', handleDownloadCSVFile)
pdfBtn.addEventListener('click', handleDownloadPDFFile)
searchForStudent.addEventListener('keyup', handleFilterStudents)
searchSelectGrade.addEventListener('change', filterGrades)
