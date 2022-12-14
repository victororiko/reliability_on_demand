import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"
import { MessageBox } from "./MessageBox"

describe("MessageBox", () => {
    test('renders "Hello World"', () => {
        render(<MessageBox message="Hello World" />) // This will render our MessageBox Component
        // screen.debug() // This will show the HTML of the rendered component
        const messageBox = screen.getByText("Hello World") // This will find the element with the text "Hello World"
        expect(messageBox).toBeInTheDocument() // This will check that the element is in the document

        // refer to https://github.com/testing-library/jest-dom/ for more assertions
    })

    test("redners a TeamConfig JSON", () => {
        const json = {
            TeamID: 0,
            OwnerContact: "cosreldata",
            OwnerTeamFriendlyName: "Platform Health Reliability Team",
            OwnerTriageAlias: "cosreldata",
            ComputeResourceLocation:
                "https://www.cosmos15.osdinfra.net/cosmos/asimov.partner.swat/",
            HashString: "CLIENT FUN TEAM",
        }
        render(<MessageBox message={json} isJSON />) // This will render our MessageBox Component
        const messageBox = screen.getByText(/cosreldata/i) // This will find the element with the json
        expect(messageBox).toBeInTheDocument() // This will check that the element is in the document
    })
})
