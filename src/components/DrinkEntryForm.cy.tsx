import React from 'react'
import DrinkEntryForm from './DrinkEntryForm'

describe('<DrinkEntryForm />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<DrinkEntryForm />)
  })
})