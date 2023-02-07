import { MRT_ColumnDef } from "material-react-table"
import { StudyInstanceData } from "../../models/study.model"

export const expandCols = (data: StudyInstanceData[]): MRT_ColumnDef<StudyInstanceData>[] => {
    const ans: MRT_ColumnDef<StudyInstanceData>[] = []
    if (data === undefined || data.length === 0) return ans
    // extract # cols from first item in data
    const firstItem = data[0]
    // parse into JSON object
    const aggByColJSON = JSON.parse(firstItem.StudyAggregateByCols)
    // iterate through each item in JSON creating a column
    for (const key of Object.keys(aggByColJSON)) {
        const colId = key
        const colHeader = key
        const colValue = aggByColJSON[key]
        const column: MRT_ColumnDef<StudyInstanceData> = {
            accessorFn: () => {
                return colValue
            },
            id: colId,
            header: colHeader,
            filterVariant: isNaN(parseInt(colValue, 10)) ? "text" : "range",
        }
        ans.push(column)
    }
    return ans
}
