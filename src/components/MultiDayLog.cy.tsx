import React from 'react'
import MultiDayLog from './MultiDayLog'
import { drinks } from '../../cypress/fixtures/example'

describe('<MultiDayLog />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<MultiDayLog drinks={[]} onDelete={()=>{}}/>)
  })

  it('shows a message if no drinks are provided', () => {
    cy.mount(<MultiDayLog drinks={[]} onDelete={()=>{}} />)
    cy.contains('No drinks logged in this date range.').should('exist')
  })

  it('calculates total alcohol correctly', () => {
    const expectedTotal = drinks.reduce((sum, drink) => sum + (drink.volume * drink.abv / 100), 0)
    cy.mount(<MultiDayLog drinks={drinks} onDelete={cy.spy()} startDate={"1-1-1979"} endDate={Date()}/>)
    cy.contains(`Grand Total (ml): ${expectedTotal.toFixed(2)}`).should('exist')
  })
})