import { Vertical } from "./model";
import { sampleVerticals } from './sampleVerticals';

export const verticals = sampleVerticals;
export const loadVerticals = ():Vertical[] => verticals

// TODO uncomment this to make backend call
// const loadVerticals = () => {
//     axios.get(`api/Data/GetVerticals/`)
//         .then((response) => {
//             if (response.data) {
//                 setVerticals(response.data)
//             } else {
//                 setVerticals([])
//             }
//         })
//         .catch(err => console.error(err))
// }

export const getVerticalFromList = (list:string[]):Vertical[] => {
    const parsedVerticalList:Vertical[] = [];
    for(let i = 0; i < list.length; i++){
        const selection = list[i];
        const parsedVertical:Vertical | undefined = verticals.find(({ VerticalName }) => 
        VerticalName === selection);
        if(parsedVertical)
            parsedVerticalList.push(parsedVertical);
    }
    return parsedVerticalList;
}