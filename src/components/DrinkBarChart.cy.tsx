import React from 'react'
import DrinkBarChart from './DrinkBarChart'
import { drinks } from '../../cypress/fixtures/example'


describe('<DrinkBarChart />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<DrinkBarChart drinks={[]}/>)
  })

  it('displays all drinks correctly', () => {
    cy.mount(<DrinkBarChart drinks={drinks} />)
  })
})