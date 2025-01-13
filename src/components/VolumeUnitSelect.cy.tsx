import React from 'react'
import VolumeUnitSelect from './VolumeUnitSelect'

describe('<VolumeUnitSelect />', () => {
  it('renders with default props', () => {
    cy.mount(<VolumeUnitSelect value="ml" onChange={cy.stub().as('onChange')} />)
    cy.get('label').should('contain', 'Unit')
    cy.get('input').should('have.value', 'ml')
  })

  it('displays custom label', () => {
    cy.mount(<VolumeUnitSelect value="ml" onChange={cy.stub()} label="Volume Unit" />)
    cy.get('label').should('contain', 'Volume Unit')
  })

  it('applies custom width', () => {
    cy.mount(<VolumeUnitSelect value="ml" onChange={cy.stub()} width={200} />)
    cy.get('.MuiFormControl-root').should('have.css', 'width', '200px')
  })

  it('applies custom style', () => {
    cy.mount(
      <VolumeUnitSelect 
        value="ml" 
        onChange={cy.stub()} 
        style={{ backgroundColor: 'rgb(240, 240, 240)' }} 
      />
    )
    cy.get('.MuiFormControl-root').should('have.css', 'background-color', 'rgb(240, 240, 240)')
  })
})