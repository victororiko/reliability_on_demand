import { Dropdown, TextField } from '@fluentui/react';
import * as React from 'react';

export interface IPivotSectionProps {
}

function getPivots() {
    return [
        { key: 'Build', text: 'Build' },
        { key: 'Branch', text: 'Branch' },
        { key: 'Revision', text: 'Revision' },
        { key: 'OEM Model', text: 'OEM Model' },
        { key: 'Processor', text: 'Processor' },
    ]
}

function getPivotScopes() {
    return [
        { key: 'Any', text: 'Any' },
        { key: 'List', text: 'List' },
        { key: 'Range', text: 'Range' },
    ]
}

function getPivotOperators() {
    return [
        { key: '=', text: '=' },
        { key: '<', text: '<' },
        { key: '>', text: '>' },
        { key: '<=', text: '<=' },
        { key: '>=', text: '>=' },
    ]
}

export function PivotSection(props: IPivotSectionProps) {
    return (
        <div>
            {/* User selects from [Build, Branch, Revision, OEM Model, OEM, Processor...] */}
            <Dropdown
                label="Pivot"
                placeholder="Select a Pivot"
                options={getPivots()}
                required
                aria-label="Select a Pivot"
            />

            {/* User selects from [Any, List, Range] */}
            <Dropdown
                label="Pivot Scope"
                placeholder="Select a Pivot Scope"
                options={getPivotScopes()}
                required
                aria-label="Select a Pivot Scope"
            />

            {/* User selects from [ =, >, <, >=, <=] */}
            <Dropdown
                label="Pivot Operator"
                placeholder="Select a Pivot Operartor"
                options={getPivotOperators()}
                required
                aria-label="Select a Pivot Scope"
            />

            <TextField label="Pivot Value"
                underlined
                required
                placeholder="e.g. 20213"
                aria-label="Pivot Value" />

        </div>
    );
}
