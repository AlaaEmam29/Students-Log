/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */


interface ExampleFixture {
  students: Array<{
    name: string
    email: string
    grade: number
    graduation_contact: string
  }>
}

describe('students log', () => {
  describe('init data', () => {
    it('check if init data is exist in table', () => {
      cy.visit('/')
      cy.fixture<ExampleFixture>('example.json').then((data) => {
        cy.get(
          '[data-test="main"] .students__table__body .students__table__row'
        ).should('have.length', data.students.length)
        cy.window().then((win) => {
          const studentsData = win.localStorage.getItem('students')
          expect(studentsData).to.not.be.null
          const studentsArray = JSON.parse(studentsData!) as unknown[]
          expect(studentsArray).to.have.lengthOf(data.students.length)
        })
      })
    })
  })
  describe('data all students', () => {
    it('check if click on delete all students it will delete all students and clear local storage', () => {
      cy.visit('/')
      cy.get('[data-test="delete-all"]').click()
      cy.get('.popup__delete-all__button--delete').click()
      cy.get(
        '[data-test="main"] .students__table__body .students__table__row'
      ).should('have.length', 0)
      cy.window().then((win) => {
        const studentsData = win.localStorage.getItem('students')
        expect(studentsData).to.be.null
      })
    })
  })
  describe('add new student', () => {
    it('check if click on add new student it will add new student to table', () => {
      cy.visit('/')
      cy.get('[data-test="add-new-student"]').click()
      cy.get('[data-test="name-input"]').type('alaa')
      cy.get('[data-test="email-input"]').type('alaa@alaa.com')
      cy.get('[data-test="grade-input"]').type('12')
      cy.get('[data-test="guardian-contact-input"]').type('123456789')
      cy.get('[data-test="add-student-btn"]').click()
      cy.fixture<ExampleFixture>('example.json').then((data) => {
        cy.window().then((win) => {
          const studentsData = win.localStorage.getItem('students')
          expect(studentsData).to.not.be.null
          const studentsArray = JSON.parse(studentsData!) as unknown[]
          expect(studentsArray).to.have.lengthOf(data.students.length + 1)
        })
      })
    })
  })
  describe('download all students', () => {
    const date = new Date()
    const dateStr = `${date.getMonth() + 1}_${date.getDate()}_${date.getFullYear()}`
    it('check if click on download button and choose pdf it will download pdf file', () => {
      cy.visit('/')
      cy.get("[data-test='download-btn']").click()
      cy.get('#pdf-btn').click()
      cy.readFile(`cypress/downloads/students-${dateStr}.pdf`).should('exist')
    })
    it('check if click on download button and choose csv it will download csv file', () => {
      cy.visit('/')
      cy.get("[data-test='download-btn']").click()
      cy.get('#csv-btn').click()
      cy.readFile(`cypress/downloads/students-${dateStr}.csv`).should('exist')
    })
  })
  describe('search', () => {
    it('check if type on search input it will display the founded data if exist', () => {
      cy.visit('/')
      cy.get('[data-test="search-input"]').type('hossam')
      cy.get(
        '[data-test="main"] .students__table__body .students__table__row'
      ).should('have.length', 1)
      cy.get('[data-test="search-input"]').type('alaa')
      cy.get(
        '[data-test="main"] .students__table__body .students__table__row'
      ).should('have.length', 0)
    })
    it('check if select on search select it will display the founded data if exist', () => {
      cy.visit('/')
      cy.get('[data-test="search-select"]').select('1')
      cy.get(
        '[data-test="main"] .students__table__body .students__table__row'
      ).should('have.length', 1)
    })
  })
  describe('edit student', () => {
    it('check if click on edit student it will open popup for edit this specific student', () => {
      cy.visit('/')
      cy.get('[data-row="0"] .students__table__cell-button--edit').click()
      cy.get('[data-test="name-input"]').clear().type('alaa')
      cy.get('[data-test="add-student-btn"]').click()
      cy.get('[data-row="0"] .students__table__cell').should('contain', 'alaa')
    })
  })
  describe('delete student', () => {
    it('check if click on delete student it will delete this student', () => {
      cy.visit('/')
      cy.get('[data-row="0"] .students__table__cell-button--delete').click()
      cy.get('[data-row="0"]').should('not.exist')
    })
  })
})
