import { Dropdown, IDropdownOption, Separator } from '@fluentui/react';
import * as React from 'react';
import { FormEvent } from 'react';

export interface IMyDropdownProps {
    data: any,
    useKey: string,
    showValueFor: string,
    enabled: boolean,
    handleOptionChange: any,

}

export interface IMyDropdownState {
    parsedOptions: IDropdownOption[],
    currentOption: IDropdownOption
}

export default class MyDropdown extends React.Component<IMyDropdownProps, IMyDropdownState> {
    constructor(props: IMyDropdownProps) {
        super(props);
        this.state = {
            parsedOptions: [],
            currentOption: {key:"", text:""}
        }
    }

    componentDidMount() {
        console.log('my dropdown component mounted - now parse the input')
        this.parseInputToState();
    }

    public render() {
        return (
            <div>
                <Separator>My Custom Dropdown Component</Separator>
                <Dropdown
                    options={this.state.parsedOptions}
                    disabled={!this.props.enabled}
                    onChange={this.onOptionChange}
                />
            </div>
        );
    }

    onOptionChange = (event: FormEvent<HTMLDivElement>, option?: IDropdownOption) =>  {
        this.props.handleOptionChange(option);
    }

    getTeamConfig(id: string | number | undefined) {
        const ans = this.state.parsedOptions.find(x => x.key === id); 
        return  ans ? ans : {key:"", text:""}
    }

    extractDropdownOption = (item: any) => {
        return {
            key: item[this.props.useKey],
            text: item[this.props.showValueFor]
        };
    }
    parseInputToState() {
        let newArr: IDropdownOption[] = this.props.data.map(this.extractDropdownOption);
        // set state based on data you get
        this.setState({
            parsedOptions: newArr
        })
    }

}

