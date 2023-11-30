/* eslint-disable no-undef */

describe('students log', () => {
  it('check if main structure for students log is exist', () => {
    cy.visit('/')
    cy.get('[data-test="header"]').should('exist')
    cy.get('[data-test="main"]').should('exist')
  })
  it('check if header structure for students log is exist', () => {
    cy.visit('/')
    cy.get('[data-test="header"]').should('exist')
    cy.get('[data-test="nav"]').should('exist')
    cy.get('[data-test="header-title"]').should('exist')
    cy.get('[data-test="search-input"]').should('exist')
    cy.get('[data-test="search-select"]').should('exist')
    cy.get('[data-test="nav"] .header__item').should('have.length', 3)
  })
  it('check if body structure for students log is exist', () => {
    cy.visit('/')
    cy.get('[data-test="main"]').should('exist')
    cy.get(
      '[data-test="main"] .students__table__header .students__table__row .students__table__cell'
    ).should('have.length', 6)
  })

  it('check if action buttons exist', () => {
    cy.visit('/')
    cy.get('[data-test="main"]').should('exist')
    cy.get('[data-test="main"] .students__table__cell-button--edit').should(
      'contain',
      'Edit'
    )
    cy.get('[data-test="main"] .students__table__cell-button--delete').should(
      'contain',
      'Delete'
    )
  })

  it('check if init data is exist in table', () => {
    cy.visit('/')
    cy.fixture('example.json').then((data) => {
      cy.get('[data-test="main"]').should('exist')
      cy.get('[data-test="main"] .students__table__row').should(
        'have.length',
        data.students.length + 1
      )
      data.students.forEach((student, index) => {
        cy.get(`.students__table__row[data-row="${index}"]`).within(() => {
          cy.get('[data-cell="id"]').should('have.text', index + 1)
          cy.get('[data-cell="name"]').should('have.text', student.name)
          cy.get('[data-cell="email"]').should('have.text', student.email)
          cy.get('[data-cell="grade"]').should('have.text', student.grade)
          cy.get('[data-cell="guardian contact"]').should(
            'have.text',
            student.graduation_contact
          )
          cy.get('[data-cell="actions"]').should('exist')
        })
      })
    })
  })
  it('check if click on delete all students it will open popup for delete students', () => {
    cy.visit('/')
    cy.get('[data-test="delete-all"]').should('exist')
    cy.get('[data-test="delete-all"]').click()
    cy.get('.overlay').should('exist')

    cy.get('.popup__delete-all').should('exist')
    cy.get('[data-test="close-btn-delete-all"]').should('exist')
    cy.get('[data-test="delete-all-title"]')
      .should('exist')
      .contains('Are you sure you want to delete all students?')
    cy.get('[data-test="cancel-btn-delete-all"]').should('exist')
    cy.get('[data-test="delete-all-btn"]').should('exist')
  })
  it('check if click on cancel button it will close popup for delete all students', () => {
    cy.visit('/')
    cy.get('[data-test="delete-all"]').should('exist')
    cy.get('[data-test="delete-all"]').click()
    cy.get('.overlay').should('exist')

    cy.get('.popup__delete-all').should('exist')
    cy.get('[data-test="cancel-btn-delete-all"]').click()
    cy.get('.overlay').should('have.class', 'hidden')
    cy.get('.popup__delete-all').should('have.class', 'hidden')
  })
  it('check if click on close button it will close popup for delete students', () => {
    cy.visit('/')
    cy.get('[data-test="delete-all"]').should('exist')
    cy.get('[data-test="delete-all"]').click()
    cy.get('.overlay').should('exist')

    cy.get('.popup__delete-all').should('exist')
    cy.get('[data-test="close-btn-delete-all"]').click()
    cy.get('.overlay').should('have.class', 'hidden')
    cy.get('.popup__delete-all').should('have.class', 'hidden')
  })
  it('check if click on delete button it will  delete students', () => {
    cy.visit('/')
    cy.get('[data-test="delete-all"]').should('exist')
    cy.get('[data-test="delete-all"]').click()
    cy.get('.overlay').should('exist')

    cy.get('.popup__delete-all').should('exist')
    cy.get('[data-test="delete-all-btn"]').click()
    cy.get('.overlay').should('have.class', 'hidden')
    cy.get('.popup__delete-all').should('have.class', 'hidden')
    cy.get('[data-test="main"]').should('exist')
    cy.get('[data-test="main"] .students__table__row').should('have.length', 1)
  })

  it('check if click on new students it will open popup for add new students', () => {
    cy.visit('/')
    cy.get('[data-test="add-new-student"]').should('exist')
    cy.get('[data-test="add-new-student"]').click()
    cy.get('.overlay').should('exist')

    cy.get('.popup__new-student').should('exist')
    cy.get('[data-test="name-input"]').should('exist')
    cy.get('[data-test="email-input"]').should('exist')
    cy.get('[data-test="grade-input"]').should('exist')
    cy.get('[data-test="guardian-contact-input"]').should('exist')
    cy.get('[data-test="add-student-btn"]').should('exist')
    cy.get('[data-test="cancel-btn"]').should('exist')
  })
  it('check if click on close button it will close popup', () => {
    cy.visit('/')
    cy.get('[data-test="add-new-student"]').should('exist')
    cy.get('[data-test="add-new-student"]').click()
    cy.get('.overlay').should('exist')
    cy.get('.popup__new-student').should('exist')
    cy.get('[data-test="close-btn"]').click()
    cy.get('.overlay').should('have.class', 'hidden')
    cy.get('.popup__new-student').should('have.class', 'hidden')
  })
  it('check if click on add student button it will add new student to table', () => {
    cy.visit('/')
    cy.get('[data-test="add-new-student"]').should('exist')
    cy.get('[data-test="add-new-student"]').click()
    cy.get('.overlay').should('exist')
    cy.get('.popup__new-student').should('exist')
    cy.get('[data-test="name-input"]').type('alaa')
    cy.get('[data-test="email-input"]').type('alaa@gmail.com')
    cy.get('[data-test="grade-input"]').type('12')
    cy.get('[data-test="guardian-contact-input"]').type('123456789')
    cy.get('[data-test="add-student-btn"]').click()
    cy.get('.overlay').should('have.class', 'hidden')
    cy.get('.popup__new-student').should('have.class', 'hidden')
    cy.fixture('example.json').then((data) => {
      cy.get('[data-test="main"]').should('exist')
      cy.get('[data-test="main"] .students__table__row').should(
        'have.length',
        data.students.length + 2
      )
      cy.get(
        `.students__table__row[data-row="${data.students.length}"]`
      ).within(() => {
        cy.get('[data-cell="id"]').should(
          'have.text',
          data.students.length + 1
        )
        cy.get('[data-cell="name"]').should('have.text', 'alaa')
        cy.get('[data-cell="email"]').should('have.text', 'alaa@gmail.com')
        cy.get('[data-cell="grade"]').should('have.text', '12')
        cy.get('[data-cell="guardian contact"]').should(
          'have.text',
          '123456789'
        )
        cy.get('[data-cell="actions"]').should('exist')
      })
    })
  })
  it('check if click on cancel student button it will remove all data', () => {
    cy.visit('/')
    cy.get('[data-test="add-new-student"]').should('exist')
    cy.get('[data-test="add-new-student"]').click()
    cy.get('.overlay').should('exist')
    cy.get('.popup__new-student').should('exist')
    cy.get('[data-test="cancel-btn"]').should('exist')
    cy.get('[data-test="cancel-btn"]').click()
    cy.get('[data-test="name-input"]').should('exist').should('have.value', '')
    cy.get('[data-test="email-input"]')
      .should('exist')
      .should('have.value', '')
    cy.get('[data-test="grade-input"]')
      .should('exist')
      .should('have.value', '')
    cy.get('[data-test="guardian-contact-input"]')
      .should('exist')
      .should('have.value', '')
  })

  it('check if click on download button it show dropdown', () => {
    cy.visit('/')
    cy.get('[data-test="download-btn"]').should('exist')
    cy.get('[data-test="download-btn"]').click()
    cy.get('.dropdown__download-all').should('exist')
    cy.get('.dropdown__item__download').should('have.length', 2)
    cy.get('.dropdown__item__download').should('contain', 'csv')
    cy.get('.dropdown__item__download').should('contain', 'pdf')
  })
  it('check if click on csv button it will download csv file', () => {
    cy.visit('/')
    cy.get('[data-test="download-btn"]').should('exist')
    cy.get('[data-test="download-btn"]').click()
    cy.get('.dropdown__download-all').should('exist')
    cy.get('.dropdown__item__download').should('have.length', 2)
    cy.get('.dropdown__item__download').should('contain', 'csv')
    cy.get('.dropdown__item__download').should('contain', 'pdf')
    cy.get('.dropdown__item__download').contains('csv').click()
    cy.get('.dropdown__download-all').should('have.class', 'hidden-dropdown')
  })
  it('check if click on pdf button it will download pdf file', () => {
    cy.visit('/')
    cy.get('[data-test="download-btn"]').should('exist')
    cy.get('[data-test="download-btn"]').click()
    cy.get('.dropdown__download-all').should('exist')
    cy.get('.dropdown__item__download').should('have.length', 2)
    cy.get('.dropdown__item__download').should('contain', 'pdf')
    cy.get('.dropdown__item__download').should('contain', 'pdf')
    cy.get('.dropdown__item__download').contains('pdf').click()
    cy.get('.dropdown__download-all').should('have.class', 'hidden-dropdown')
  })
  it('check if type on search input it will display the founded data if exist', () => {
    cy.visit('/')
    cy.get('[data-test="search-input"]').should('exist')
    cy.get('[data-test="search-input"]').type('hossam')
    cy.get('[data-test="main"]').should('exist')
    cy.get('[data-test="main"] .students__table__row').should('have.length', 2)
    cy.get('[data-test="search-input"]').type('alaa')
    cy.get('[data-test="main"]').should('exist')
    cy.get('[data-test="main"] .students__table__row').should('have.length', 1)
  })
  it('check if type on search input it will display the founded data if exist', () => {
    cy.visit('/')
    cy.get('[data-test="search-select"]').should('exist')
    cy.get('[data-test="search-select"]').select('1')
    cy.get('[data-test="main"]').should('exist')
    cy.get('[data-test="main"] .students__table__row').should('have.length', 2)
  })
  it('check if click on edit student it will open popup for edit this specific student', () => {
    cy.visit('/')
    cy.get('[data-row="0"] .students__table__cell-button--edit').should(
      'exist'
    )
    cy.get('[data-row="0"] .students__table__cell-button--edit').click()
    cy.get('.overlay').should('exist')
    cy.get('.popup__new-student').should('exist')
    cy.get('.popup__new-student__title')
      .should('exist')
      .contains('Edit zaky aly Information')
    cy.get('[data-test="name-input"]').should('exist')
    cy.get('[data-test="email-input"]').should('exist')
    cy.get('[data-test="grade-input"]').should('exist')
    cy.get('[data-test="guardian-contact-input"]').should('exist')
    cy.get('[data-test="add-student-btn"]').should('exist')
    cy.get('[data-test="cancel-btn"]').should('exist')
    cy.get('[data-test="name-input"]').should('have.value', 'zaky aly')
    cy.get('[data-test="email-input"]').should(
      'have.value',
      'zaky.aly88@gmail.com'
    )
    cy.get('[data-test="grade-input"]').should('have.value', '2')
    cy.get('[data-test="guardian-contact-input"]').should(
      'have.value',
      '+1-613-111-3344'
    )
    cy.get('[data-test="name-input"]').type('alaa')
    cy.get('.popup__new-student__form__button--toggle').should('exist')
    cy.get('[data-test="add-student-btn"]').click()
    cy.get('.overlay').should('have.class', 'hidden')
    cy.get('.popup__new-student').should('have.class', 'hidden')
    cy.get('[data-row="0"]').should('exist')
    cy.get('[data-row="0"] .students__table__cell').should('have.length', 6)
    cy.get('[data-row="0"] .students__table__cell').should('contain', 'alaa')
  })
  it('check if click on delete student it will delete this student', () => {
    cy.visit('/')
    cy.get('[data-row="0"] .students__table__cell-button--delete').should(
      'exist'
    )
    cy.get('[data-row="0"] .students__table__cell-button--delete').click()
    cy.get('[data-row="0"]').should('not.exist')
  })
})
