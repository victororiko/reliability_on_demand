import { Dropdown } from '@fluentui/react';
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

function getPivotScopes(){
    return [
        { key: 'Any', text: 'Any' },
        { key: 'List', text: 'List' },
        { key: 'Range', text: 'Range' },
    ]
}

export function PivotSection(props: IPivotSectionProps) {
    return (
        <div>
            {/* User selects from [Build, Branch, Revision, OEM Model, OEM, Processor...] */}
            <Dropdown
                placeholder="Select a Pivot"
                label="Pivot"
                options={getPivots()}
                required
                aria-label="Select a Pivot"
            />

            {/* User selects from [Any, List, Range] */}
            <Dropdown
                placeholder="Select a Pivot Scope"
                label="Pivot Scope"
                options={getPivotScopes()}
                required
                aria-label="Select a Pivot Scope"
            />

            
        </div>
    );
}
