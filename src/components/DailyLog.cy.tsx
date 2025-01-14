import React from 'react'
import DailyLog from './DailyLog'
import { drinks } from '../../cypress/fixtures/example'


describe('<DailyLog />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<DailyLog drinks={drinks} onDelete={() => { }} />)
  })

  it('shows a message if no drinks are provided', () => {
    cy.mount(<DailyLog drinks={[]} onDelete={cy.spy()} />)
    cy.contains('No drinks logged yet.').should('exist')
  })

  it('displays the correct total of pure alcohol', () => {
    const testDrinks = [
      { id: 1, name: 'Beer', volume: 500, abv: 5, date: new Date() },
      { id: 2, name: 'Wine', volume: 200, abv: 12, date: new Date() }
    ]
    cy.mount(<DailyLog drinks={testDrinks} onDelete={cy.spy()} />)
    cy.contains('Today\'s Log').should('exist')
    cy.contains('Total Pure Alcohol (ml): 49.00').should('exist')
  })

  it('removes a drink when delete is confirmed', () => {
    const onDeleteStub = cy.stub()
    const testDrinks = [{ id: 1, name: 'Test Drink', volume: 250, abv: 10, date: new Date() }]
    cy.mount(<DailyLog drinks={testDrinks} onDelete={onDeleteStub} />)
    cy.contains('Test Drink').should('exist')
    cy.get('button').click()
    cy.wrap(onDeleteStub).should('have.been.calledWith', 1)
  })
})