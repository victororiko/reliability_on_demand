import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"
import { PivotResultRow } from "./PivotResultRow"
import { PopulationPivotConfig } from "../../models/filterexpression.model"

// Write a test for PivotResultRow react component
describe("PivotResultRow", () => {
    test("renders a row with PivotName, AggregateBy, and ScopeString", () => {
        // Arrange
        const pivotConfig = {
            PivotKey: "DeviceCensusConsolidated.ss_OSBranch",
            PivotName: "OSBranch",
            AggregateBy: true,
            PivotScopeOperator: "",
            PivotOperator: "==",
            PivotScopeValue: '"rs_prerelease"',
        } as PopulationPivotConfig

        // Act
        render(<PivotResultRow config={pivotConfig} />) // This will render our PivotResultRow Component
        // screen.debug() // This will show the HTML of the rendered component

        // Assert
        const pivotNameElement = screen.getByText("OSBranch") // This will find the element with the text "Pivot Name"
        const AggregateByElement = screen.getByText(/true/) // This will find the element with the text "Pivot Scope Value"
        const pivotScopeStrElement = screen.getByText(/OSBranch == "rs_prerelease"/) // This will find the element with the text "Pivot Scope Str"
        expect(pivotNameElement).toBeInTheDocument() // This will check that the element is in the document
        expect(AggregateByElement).toBeInTheDocument() // This will check that the element is in the document
        expect(pivotScopeStrElement).toBeInTheDocument() // This will check that the element is in the document
    })

    test("renders empty string when pivot scope is not configured", () => {
        // Arrange
        const pivotConfig = {
            PivotKey: "DeviceCensusConsolidated.ss_OSBranch",
            PivotName: "OSBranch",
            AggregateBy: true,
        } as PopulationPivotConfig
        // Act
        render(<PivotResultRow config={pivotConfig} />) // This will render our PivotResultRow Component
        // Assert
        expect(screen.getByText("OSBranch")).toBeInTheDocument() // This will check that the element is in the document
        expect(screen.getByText(/true/)).toBeInTheDocument() // This will check that the element is in the document
        expect(screen.getByTestId("pivotScopeString")).toHaveTextContent("") // This will check that the element is in the document
    })
})
