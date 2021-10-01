import { IComboBox, IComboBoxOption, VirtualizedComboBox } from '@fluentui/react'
import React, { FormEvent, useEffect } from 'react'
import { StudyConfig } from '../../models/config.model';

interface Props {
    data: StudyConfig[];
    callBack: any;
}

export const StudyComboBox = (props: Props) => {
    // onMount
    useEffect(() => {
        console.debug('Mounted StudyComboBox');
        return () => {
            console.debug('UnMounted StudyComboBox');
        }
    }, []);

    // state
    const [selectedItem, setSelectedItem] = React.useState<IComboBoxOption>();
    // core interation methods
    const onChange = (event: FormEvent<IComboBox>, option?: IComboBoxOption | undefined): void => {
        setSelectedItem(option);
        props.callBack(option ? option.text : "create new study");
    };

    const convertToOptions = (inputData: StudyConfig[]) => {
        let parsedList: IComboBoxOption[] = [];
        parsedList = inputData.map(item => {
            let rObj = {
                key:item.StudyName,
                text:item.StudyName
            };
            return rObj;
        });
        parsedList.push(
            {
                key:"create new study",
                text:"create new study"
            }
        );
        return parsedList;
    }

    return (
        <div>
            <VirtualizedComboBox
                selectedKey={selectedItem ? selectedItem.key : "create new study"}
                label="Study"
                allowFreeform
                autoComplete="on"
                options={convertToOptions(props.data)}
                useComboBoxAsMenuWidth
                onChange={onChange}
            />
        </div>

    )
}