import JSPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Student {
  name: string;
  email: string;
  grade: number;
  graduation_contact: string;
}
const handleSetLocalStorage = (key: string, value: Student[]) => {
  if (!key || !value) return;
  return localStorage.setItem(key, JSON.stringify(value));
};
const handleGetLocalStorage = (key: string) => {
  if (!key) return;
  const item = localStorage.getItem(key);
  if (item === null) return null;
  return JSON.parse(item);
};
const handleRemoveLocalStorage = (key: string | null) => {
  if (!key) return;
  return localStorage.removeItem(key);
};

let students: Student[] = [];
let grades: number[] = [];

if (handleGetLocalStorage('students')) {
  students = handleGetLocalStorage('students');
} else {
  students = [
    {
      name: 'zaky aly',
      email: 'zaky.aly88@gmail.com',
      grade: 2,
      graduation_contact: '+1-613-111-3344',
    },
    {
      name: 'hossam mourad',
      email: 'hossam.mourad@example.com',
      grade: 1,
      graduation_contact: '+1-613-555-6677',
    },
  ];
  grades = students.map((student) => student.grade).sort((a, b) => a - b);

  handleSetLocalStorage('students', students);
}

const deleteAllBtnContainer: HTMLButtonElement | null =
  document.querySelector('#delete-all');
const addNewStudentBtn: HTMLButtonElement | null =
  document.querySelector('#add-new-student');

const popupDeleteAll: HTMLDialogElement | null =
  document.querySelector('.popup__delete-all');
const closeBtnDeleteAll: HTMLButtonElement | null = document.querySelector(
  '.popup__delete-all__close',
);
const cancelBtnDeleteAll: HTMLButtonElement | null = document.querySelector(
  '.popup__delete-all__button--cancel',
);
const deleteAllBtnStudents: HTMLButtonElement | null = document.querySelector(
  '.popup__delete-all__button--delete',
);
const tableBody: HTMLTableSectionElement | null = document.querySelector(
  '.students__table__body',
);
const popupAddNewStudent: HTMLDialogElement | null = document.querySelector(
  '.popup__new-student',
);
const closeAddNewStudentBtn: HTMLButtonElement | null = document.querySelector(
  '.popup__new-student__close',
);
const AddNewStudentForm: HTMLFormElement | null = document.querySelector(
  '.popup__new-student__form',
);
const toggleNewStudentForm: HTMLButtonElement | null = document.querySelector(
  '.popup__new-student__form__button--toggle',
);
const downloadTableBtn: HTMLButtonElement | null =
  document.querySelector('#download-btn');
const dropdownDownloadAll = document.querySelector('.dropdown__download-all');
const csvBtn: HTMLButtonElement | null = document.querySelector('#csv-btn');
const pdfBtn: HTMLButtonElement | null = document.querySelector('#pdf-btn');
const searchForStudent: HTMLInputElement | null =
  document.querySelector('.search__input');
const searchSelectGrade: HTMLSelectElement | null =
  document.querySelector('.search__select');
const titleToggleStudent: HTMLHeadingElement | null = document.querySelector(
  '.popup__new-student__title',
);
const dialog: HTMLDialogElement | null = document.querySelector('dialog');
let isEditFlag = false;
let editIndex = 0;
const hideModel = () => {
  if (!dialog) return;
  dialog.addEventListener('close', () => {
    console.log('close');
  });
};
const handleDeleteAllBtnContainerClick = () => {
  if (!popupDeleteAll) return;
  popupDeleteAll.showModal();
};

const clearAddNewStudentForm = () => {
  const inputs = AddNewStudentForm?.querySelectorAll('input');
  inputs?.forEach((input) => {
    input.value = '';
  });
};
const initSelectGrades = (value = 'All grades') => {
  if (!searchSelectGrade) return;
  searchSelectGrade.innerHTML = '';
  searchSelectGrade.innerHTML = `
  <option class="search__select-option" value="all">
  ${value}
  </option>`;
};
const handleAddNewStudentBtnClick = () => {
  if (!popupAddNewStudent) return;
  popupAddNewStudent?.showModal();

  if (!isEditFlag) {
    isEditFlag = false;
    if (!toggleNewStudentForm) return;
    toggleNewStudentForm.textContent = 'Add Student';
    if (!titleToggleStudent) return;
    titleToggleStudent.textContent = 'Add New Student';
  }
};
const fillEditStudentValue = (student: Student) => {
  if (!AddNewStudentForm) return;
  const inputs = AddNewStudentForm.querySelectorAll('input');
  inputs.forEach((input) => {
    if (input.name in student) {
      input.value = String((student as any)[input.name] ?? '');
    } else {
      input.value = '';
    }
  });
};

const deleteRowTable = (row: HTMLTableRowElement) => {
  row.remove();
};
const deleteSelectGrade = (grade: number) => {
  if (!searchSelectGrade) return;
  const options = searchSelectGrade.querySelectorAll('option');
  options.forEach((option) => {
    if (Number(option.value) === grade) {
      option.remove();
    }
  });
};
const createRowTable = (index: number, student: Student) => {
  const row = document.createElement('tr');
  row.setAttribute('data-row', index.toString());
  row.className = 'students__table__row';
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
    `;

  const deleteBtn: HTMLButtonElement | null = row.querySelector(
    '.students__table__cell-button--delete',
  );
  const editBtn: HTMLButtonElement | null = row.querySelector(
    '.students__table__cell-button--edit',
  );
  if (!deleteBtn) return;
  if (!editBtn) return;

  deleteBtn.addEventListener('click', (e: any) => {
    const studentId = Number(e.target.dataset.deleteid);
    if (studentId === undefined || studentId === null) return;
    students.splice(studentId, 1);
    deleteRowTable(row);
    const grade = Number(student.grade);
    grades[grade] -= 1;
    if (grades[grade] === 0) {
      deleteSelectGrade(grade);
      delete grades[grade];
    }
    handleSetLocalStorage('students', students);
    handleSetLocalStorage('grades', grades as any);
  });
  editBtn.addEventListener('click', (e: any) => {
    isEditFlag = true;
    const studentId = Number(e.target.dataset.editid);
    if (studentId === undefined || studentId === null) return;
    const currentStudent = students[studentId];
    editIndex = studentId;
    if (!popupAddNewStudent) return;
    popupAddNewStudent.showModal();

    if (isEditFlag) {
      if (!toggleNewStudentForm) return;
      if (!titleToggleStudent) return;
      toggleNewStudentForm.textContent = 'Edit Student';
      titleToggleStudent.textContent = `Edit ${currentStudent.name} Information`;
    }
    fillEditStudentValue(currentStudent);
  });
  return row;
};

const renderTable = (students: Student[]) => {
  if (!tableBody) return;
  const fragment = document.createDocumentFragment();
  students.forEach((student, index) => {
    const row = createRowTable(index, student);
    if (!row) return;
    fragment.appendChild(row);
  });

  tableBody.innerHTML = '';
  tableBody.appendChild(fragment);
};
const createSelectSearchGrade = (grade: number) => {
  const option = document.createElement('option');
  option.className = 'search__select-option';
  option.setAttribute('value', grade.toString());
  option.textContent = grade.toString();
  return option;
};
const renderSelectGrade = (students: Student[]) => {
  if (!searchSelectGrade) return;
  initSelectGrades();
  const uniquesGrades = new Set(
    students.map((student) => Number(student.grade)),
  );
  grades = [...uniquesGrades].sort((a: number, b: number) => a - b);
  const fragment = document.createDocumentFragment();
  if (!fragment) return;
  grades.forEach((grade: number) => {
    const row = createSelectSearchGrade(grade);
    if (!row) return;
    fragment.appendChild(row);
  });

  searchSelectGrade.appendChild(fragment);
};
const renderRowTable = (index: number, student: Student) => {
  if (!tableBody) return;
  const fragment = document.createDocumentFragment();
  const row = createRowTable(index, student);
  if (!row) return;
  fragment.appendChild(row);
  tableBody.appendChild(fragment);
};

document.addEventListener('DOMContentLoaded', () => {
  renderTable(students);
  renderSelectGrade(students);
});

const handleDeleteAllBtnStudents = () => {
  handleRemoveLocalStorage('students');
  handleRemoveLocalStorage('grades');
  students.length = 0;
  grades = [];
  if (!tableBody) return;
  tableBody.innerHTML = '';
  initSelectGrades();
};
const validationAddNewStudentForm = (
  input: HTMLInputElement,
  student: Student,
) => {
  if (input.value === '') {
    input.classList.add('popup__new-student__input--error');
  } else {
    input?.classList.remove('popup__new-student__input--error');
    if (input.name in student) {
      (student as any)[input.name] = input.value;
    }
  }
};
const addNewStudent = (student: Student, keys: string[]) => {
  if (keys.length === 4) {
    students.push(student);
    handleSetLocalStorage('students', students);
    renderRowTable(students.length - 1, student);
    renderSelectGrade(students);
  } else {
    // eslint-disable-next-line no-alert
    alert('please fill all inputs');
  }
};
const editStudent = (inputs: any) => {
  if (!inputs) return;
  const currentStudent = {};
  inputs.forEach((input: any) => {
    input.classList.remove('popup__new-student__input--error');
    if (input.name in currentStudent) {
      (currentStudent as any)[input.name] = input.value;
    }
  });
  const keys = Object.keys(currentStudent);
  if (keys.length === 4) {
    const row = document.querySelector(`[data-row='${editIndex}']`);
    if (!row) return;
    students[editIndex] = currentStudent as Student;
    const currentStudentRow = createRowTable(
      editIndex,
      currentStudent as Student,
    );
    if (!currentStudentRow) return;
    row.replaceWith(currentStudentRow);
    handleSetLocalStorage('students', students);
    renderSelectGrade(students);
  } else {
    // eslint-disable-next-line no-alert
    alert('please fill all inputs');
  }
};

const handleSubmitNewStudentForm = (e: any) => {
  e.preventDefault();
  const student: Student = {
    name: '',
    email: '',
    grade: 0,
    graduation_contact: '',
  };
  const inputs = AddNewStudentForm?.querySelectorAll('input');
  if (!inputs) return;
  inputs?.forEach((input) => {
    validationAddNewStudentForm(input, student);
  });
  const keys = Object.keys(student);
  if (!isEditFlag) {
    addNewStudent(student, keys);
  } else {
    editStudent(inputs);
  }

  clearAddNewStudentForm();
  if (!popupAddNewStudent) return;
  popupAddNewStudent?.close();
};

const handleToggleDropdownDownload = (e: any) => {
  if (!dropdownDownloadAll) return;
  const downloadBtnBounds = e.target.getBoundingClientRect();
  if (!dropdownDownloadAll) return;
  if (!(dropdownDownloadAll instanceof HTMLElement)) return;
  dropdownDownloadAll.style.position = 'absolute';
  dropdownDownloadAll.style.top = `${
    window.scrollY + downloadBtnBounds.bottom + 15
  }px`;
  dropdownDownloadAll.style.right = `${10}px`;
  dropdownDownloadAll.classList.toggle('hidden-dropdown');
};
const formatDate = (): string => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const year = today.getFullYear();
  return `${month}_${day}_${year}`;
};
const convertJSONToCSV = () => {
  let csv = '';
  const studentsHeader = Object.keys(students[0]);
  csv += `${studentsHeader.join(', ')}\n`;
  students.forEach((studentRow) => {
    const data = studentsHeader
      .map((header) => {
        const value = (studentRow as any)[header];
        return JSON.stringify(value).replace(/"/g, '');
      })
      .join(', ');
    csv += `${data}\n`;
  });
  return csv;
};
const convertJSONToPDF = () => {
  const doc = new JSPDF();
  autoTable(doc, {
    html: '.students__table',
    styles: { overflow: 'linebreak' },
    margin: { top: 10 },
    theme: 'grid',
  });
  doc.save(`students-${formatDate()}.pdf`);
};
const handleDownloadCSVFile = () => {
  const studentCSV = convertJSONToCSV();
  const blob = new Blob([studentCSV], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `students-${formatDate()}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  if (!dropdownDownloadAll) return;
  if (!(dropdownDownloadAll instanceof HTMLElement)) return;
  dropdownDownloadAll.classList.toggle('hidden-dropdown');
};
const handleDownloadPDFFile = () => {
  convertJSONToPDF();
  if (!dropdownDownloadAll) return;
  if (!(dropdownDownloadAll instanceof HTMLElement)) return;
  dropdownDownloadAll.classList.toggle('hidden-dropdown');
};
// is render all table and print dom every time when user search for student is good idea ?
// is there is another way for dom manipulation ?
// for small app like this should i use debounce  ?
const handleFilterStudents = (e: any) => {
  const { value } = e.target;
  if (!value) {
    renderTable(students);
    return;
  }
  const filterStudents = students.filter((student) => {
    const values = Object.values(student);
    return values.some((val) =>
      val.toString().toLowerCase().includes(value.toLowerCase()),
    );
  });
  renderTable(filterStudents);
};
const filterGrades = (e: any) => {
  const filterStudents = students.filter((student) => {
    return Number(student.grade) === Number(e.target.value);
  });
  if (e.target.value === 'all') {
    renderTable(students);
    return;
  }
  renderTable(filterStudents);
};
const handleCloseAddNewStudent = () => {
  popupAddNewStudent?.close();
};
addNewStudentBtn?.addEventListener('click', handleAddNewStudentBtnClick);
closeAddNewStudentBtn?.addEventListener('click', handleCloseAddNewStudent);
deleteAllBtnStudents?.addEventListener('click', handleDeleteAllBtnStudents);
AddNewStudentForm?.addEventListener('submit', handleSubmitNewStudentForm);
downloadTableBtn?.addEventListener('click', handleToggleDropdownDownload);
csvBtn?.addEventListener('click', handleDownloadCSVFile);
pdfBtn?.addEventListener('click', handleDownloadPDFFile);
searchForStudent?.addEventListener('keyup', handleFilterStudents);
searchSelectGrade?.addEventListener('change', filterGrades);
closeBtnDeleteAll?.addEventListener('click', hideModel);
cancelBtnDeleteAll?.addEventListener('click', hideModel);
deleteAllBtnContainer?.addEventListener(
  'click',
  handleDeleteAllBtnContainerClick,
);
