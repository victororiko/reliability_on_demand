import axios from "axios"
import {
    DefaultButton,
    DetailsList,
    Dropdown,
    IColumn,
    IDropdownOption,
    Label,
    SelectionMode,
    TextField,
    TooltipHost,
} from "@fluentui/react"
import React from "react"
import { StudyPivotConfig } from "../../../models/filterexpression.model"
import "./FailureCurveSection.css"
import {
    FilterExpressionbuildColumnArray,
    getPivotScopeIDs,
    loadOperators,
    loadRelationalOperators,
    mapFilterExpTableColumnValue,
    getPivotKey,
    getAllFilteredPivots,
} from "./service"
import { azureFuncURL } from "../utils"

/**
 * Responsibilities : The filter expression component takes in the array of StudyPivotConfig and queries the backend to fetch the filter expression from the RELPivotScope table to show it to the user.
 * Also validates the filter expression.
 * @param : StudyPivotConfigs-> array of StudyPivotConfig that are currently configured pivot scope ids or null in case the user wants to configure a new pivot as filter expression
 * @param : callBack -> Return array of StudyPivotConfig that takes 2 arguments -> array of StudyPivotConfig and boolean argument to tell if need to call backend or not
 * @param: callBackend -> decide to call the backend or not. It should be true for the first time to load the already configured or default filter expression.
 * @param: validateExpCallBack -> optional function with a boolean param to signal if the vaildation for the filter expression has passed or not. After that, it will be false if it is not explicitly set by the callee.
 * @returns: Returns an array of StudyPivotConfig
 * @returns: if validation needed, Prints the expression or error
 * */
interface Props {
    studyPivotConfigs: StudyPivotConfig[] // Currently configured pivotscope ids or null in case user wants to configure a new pivot as filter expression
    callBack: any // Return array of StudyPivotConfig that takes 2 arguments -> array of StudyPivotConfig and boolean argument to tell if need to call backend or not
    callBackend: boolean // Should be false in all the cases where you don't want to reset the filter expression component by reloading the configured filter expression again.
    validateExpCallBack?: any // function with 2 arguments -> a boolean param to signal if the vaildation for the filter expression has passed or not and latest filter expression data that needs to be saved in the backend (StudyPivotConfig[] type)
}

// only type used for input/output is RELStudyPivotConfig
export const FilterExpressionDetailedList = (props: Props) => {
    // state
    const [cols, setCols] = React.useState<IColumn[]>([])
    const [selectedPivotsKeys, setSelectedPivotKeys] = React.useState<IDropdownOption[]>([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const [changedFilterExp, setChangedFilterExp] = React.useState<StudyPivotConfig[]>([])
    const [validateStatement, setValidateStatement] = React.useState<string>("")

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getPivotScopeInfo = (input: StudyPivotConfig[]) => {
        //

        if (props.studyPivotConfigs === null || props.studyPivotConfigs.length === 0) {
            setSelectedPivotKeys([])
            setChangedFilterExp([])
        } else if (props.callBackend === false) {
            setChangedFilterExp(input)
        } else {
            setSelectedPivotKeys(getAllFilteredPivots(props.studyPivotConfigs))
            const studyconfigidWithScopes = getPivotScopeIDs(input)
            axios
                .post("api/Data/GetFilterExpressionForPivotScopeIds", studyconfigidWithScopes)
                .then((response) => {
                    if (response.data !== null && response.data !== "") {
                        setChangedFilterExp(response.data)
                    } else {
                        const row: StudyPivotConfig = {
                            PivotKey: "",
                            PivotScopeID: -1,
                            PivotOperator: "",
                            PivotScopeValue: "",
                            StudyConfigID: props.studyPivotConfigs[0].StudyConfigID,
                            RelationalOperator: "",
                            UIDataType: "",
                            PivotName: "",
                        }

                        const arr: StudyPivotConfig[] = []
                        arr.push(row)
                        setChangedFilterExp(arr)
                    }
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    const addClicked = (id: any) => {
        const item: StudyPivotConfig = {
            PivotKey: "",
            PivotScopeID: -1,
            PivotOperator: "",
            PivotScopeValue: "",
            StudyConfigID: props.studyPivotConfigs[0].StudyConfigID,
            RelationalOperator: "",
            UIDataType: "",
            PivotName: "",
        }

        const updated = [...changedFilterExp.slice(0, id), item, ...changedFilterExp.slice(id)]

        setChangedFilterExp(updated)
        setCols([])
        setCols(FilterExpressionbuildColumnArray(changedFilterExp))
        props.callBack(updated, false)
    }

    const deleteClicked = (id: any) => {
        const updated = []

        for (let i = 0; i < changedFilterExp.length; i++) {
            if (i !== id) {
                updated.push(changedFilterExp[i])
            }
        }

        setChangedFilterExp(updated)
        setCols([])
        setCols(FilterExpressionbuildColumnArray(changedFilterExp))
        props.callBack(updated, false)
    }

    const onPivotSelected = (
        event: React.FormEvent<HTMLDivElement>,
        item?: IDropdownOption
    ): void => {
        if (item) {
            const target = event?.target as HTMLInputElement
            const arr = target.id.toString().split("_")
            const row = Number(arr[0])
            const col = arr[1]
            let updated = mapFilterExpTableColumnValue(changedFilterExp, row, col, item.text)

            updated = mapFilterExpTableColumnValue(updated, row, "PivotKey", item.key)

            setChangedFilterExp(updated)
            setCols([])
            setCols(FilterExpressionbuildColumnArray(changedFilterExp))
            props.callBack(updated, false)
        }
    }

    const onOperatorSelected = (
        event: React.FormEvent<HTMLDivElement>,
        item?: IDropdownOption
    ): void => {
        if (item) {
            const target = event?.target as HTMLInputElement
            const arr = target.id.toString().split("_")
            const row = Number(arr[0])
            const col = arr[1]
            const updated = mapFilterExpTableColumnValue(changedFilterExp, row, col, item.text)
            setChangedFilterExp(updated)
            setCols([])
            setCols(FilterExpressionbuildColumnArray(changedFilterExp))
            props.callBack(updated, false)
        }
    }

    const onRelationalOperatorSelected = (
        event: React.FormEvent<HTMLDivElement>,
        item?: IDropdownOption
    ): void => {
        if (item) {
            const target = event?.target as HTMLInputElement
            const arr = target.id.toString().split("_")
            const row = Number(arr[0])
            const col = arr[1]
            const updated = mapFilterExpTableColumnValue(changedFilterExp, row, col, item.text)
            setChangedFilterExp(updated)
            setCols([])
            setCols(FilterExpressionbuildColumnArray(changedFilterExp))
            props.callBack(updated, false)
        }
    }

    const onTextBoxChange = (event: {}): void => {
        const e = event as React.ChangeEvent<HTMLInputElement>
        const target = e?.target as HTMLInputElement
        const arr = target.id.toString().split("_")

        const row = Number(arr[0])
        const col = arr[1]

        const updated = mapFilterExpTableColumnValue(changedFilterExp, row, col, e.target.value)
        setChangedFilterExp(updated)
        setCols([])
        setCols(FilterExpressionbuildColumnArray(changedFilterExp))
        props.callBack(updated, false)
    }

    // call azure function to validate and return the validated filter expression
    const handleValidateFilterExpressionClick = () => {
        if (azureFuncURL) {
            axios
                .post(azureFuncURL, changedFilterExp)
                .then((response) => {
                    if (response) {
                        if (response.data === "Invalid Filter Expression") {
                            setValidateStatement(`${response.data}`)
                            props.validateExpCallBack(changedFilterExp, false)
                        } else {
                            setValidateStatement(`validated from Backend String = ${response.data}`)
                            props.validateExpCallBack(changedFilterExp, true)
                        }
                    } else {
                        setValidateStatement("no response from Backend Azure Function")
                        props.validateExpCallBack(changedFilterExp, false)
                    }
                })
                .catch((err) => {
                    setValidateStatement(`failed to call backend with error = ${err}`)
                    props.validateExpCallBack(changedFilterExp, false)
                })
        } else {
            setValidateStatement(
                "Missing Azure Function URL - please contact cosreldata@microsoft.com"
            )
            props.validateExpCallBack(changedFilterExp, false)
        }
    }

    const validate = props.validateExpCallBack ? (
        <div>
            <TooltipHost content="Click to validate your filter expression">
                <div>
                    <DefaultButton
                        text="Validate Filter Expression"
                        onClick={() => {
                            return handleValidateFilterExpressionClick()
                        }}
                        allowDisabledFocus
                        disabled={false}
                        checked={false}
                    />
                </div>
            </TooltipHost>
            <Label>{validateStatement}</Label>
        </div>
    ) : (
        ""
    )

    React.useEffect(() => {
        getPivotScopeInfo(props.studyPivotConfigs)
        setCols([])
        setCols(FilterExpressionbuildColumnArray(changedFilterExp))
        setValidateStatement("")
    }, [JSON.stringify(props.studyPivotConfigs)])

    const renderItemColumn = (item: IDropdownOption, index?: number, column?: IColumn) => {
        const fieldContent = item[column?.fieldName as keyof IDropdownOption] as string

        if (column?.key === "Add/Delete") {
            return (
                <span>
                    <DefaultButton
                        text="+"
                        onClick={() => {
                            return addClicked(index)
                        }}
                        id={index?.toString()}
                        allowDisabledFocus
                        disabled={false}
                        checked={false}
                        className="Button"
                    />
                    <DefaultButton
                        text="X"
                        onClick={() => {
                            return deleteClicked(index)
                        }}
                        id={index?.toString()}
                        allowDisabledFocus
                        disabled={false}
                        checked={false}
                        className="Button"
                    />
                </span>
            )
        }
        if (column?.key === "PivotName") {
            const val = { fieldContent }
            const key = getPivotKey(val, changedFilterExp)

            return (
                <span>
                    <Dropdown
                        selectedKey={key}
                        onChange={onPivotSelected}
                        options={selectedPivotsKeys}
                        id={`${index}_${column?.name}`}
                    />
                </span>
            )
        }
        if (column?.key === "PivotOperator") {
            return (
                <span>
                    <Dropdown
                        selectedKey={fieldContent}
                        onChange={onOperatorSelected}
                        options={loadOperators()}
                        id={`${index}_${column?.name}`}
                    />
                </span>
            )
        }
        if (column?.key === "RelationalOperator") {
            return (
                <span>
                    <Dropdown
                        selectedKey={fieldContent}
                        onChange={onRelationalOperatorSelected}
                        options={loadRelationalOperators()}
                        id={`${index}_${column?.name}`}
                    />
                </span>
            )
        }
        return (
            <span>
                <TextField
                    value={fieldContent}
                    id={`${index}_${column?.name}`}
                    onChange={onTextBoxChange}
                />
            </span>
        )
    }

    return (
        <div>
            <TooltipHost content="Select/Deselect the kind of Pivot">
                <DetailsList
                    items={changedFilterExp}
                    setKey="set"
                    columns={cols}
                    onRenderItemColumn={renderItemColumn}
                    selectionMode={SelectionMode.none}
                />
            </TooltipHost>
            {validate}
        </div>
    )
}
