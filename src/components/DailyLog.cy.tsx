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

  it('calculates total alcohol correctly', () => {
    const testDrinks = [
      { id: 1, name: 'Beer', volume: 500, abv: 5, date: new Date() },
      { id: 2, name: 'Wine', volume: 200, abv: 12, date: new Date() }
    ]
    const expectedTotal = testDrinks.reduce((sum, drink) => sum + (drink.volume * drink.abv / 100), 0)
    cy.mount(<DailyLog drinks={testDrinks} onDelete={cy.spy()} />)
    cy.contains(`Total Pure Alcohol (ml): ${expectedTotal.toFixed(2)}`).should('exist')
  })

  it('removes a drink when delete is confirmed', () => {
    const onDeleteStub = cy.stub()
    const testDrinks = [{ id: 1, name: 'Test Drink', volume: 250, abv: 10, date: new Date() }]
    cy.mount(<DailyLog drinks={testDrinks} onDelete={onDeleteStub} />)
    cy.contains('Test Drink').should('exist')
    const expectedTotal = testDrinks[0].volume * testDrinks[0].abv / 100
    cy.contains(`Total Pure Alcohol (ml): ${expectedTotal.toFixed(2)}`).should('exist')
    cy.get('button').click()
    cy.wrap(onDeleteStub).should('have.been.calledWith', 1)
  })
})