import * as React from 'react'
import { Label } from '@fluentui/react'

export interface IManagePivotsProps {}

// Added randomly to check how pivots switching looks.
// Will be removed in next PR to implement the UI for this.
export const ManagePivots = (props: IManagePivotsProps) => {
  return (
    <div>
      <Label>Manage Pivots</Label>
    </div>
  )
}
