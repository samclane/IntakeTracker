import React from 'react'
import MixedDrinkCalculator from './MixedDrinkCalculator'

describe('<MixedDrinkCalculator />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<MixedDrinkCalculator onMixedChange={()=>{}}/>)
  })
})