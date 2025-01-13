import React from 'react'
import DrinkTable from './DrinkTable'

const drinks = require('../../cypress/fixtures/example')

describe('<DrinkTable />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<DrinkTable drinks={drinks} />)
  })

  it('displays all drinks correctly', () => {
    cy.mount(<DrinkTable drinks={drinks} removingId={null} onRemove={cy.spy()} onAnimationEnd={cy.spy()} />)
    cy.get('[data-cy="drink-row"]').should('have.length', drinks.length)
    cy.get('[data-cy="drink-name"]').each((el, idx) => {
      expect(el.text()).to.equal(drinks[idx].name)
    })
  })

  it('removes a drink upon clicking delete', () => {
    const handleRemove = cy.spy()
    cy.mount(<DrinkTable drinks={drinks} removingId={null} onRemove={handleRemove} onAnimationEnd={cy.spy()} />)
    cy.get('[data-cy="drink-actions"] button').first().click()
    cy.wrap(handleRemove).should('have.been.calledOnce')
  })
})