import { Vertical, Pair } from './model'
import { sampleVerticals } from './sampleVerticals'

export const verticals = sampleVerticals
export const loadVerticals = (): Vertical[] => {
  return verticals
}

export const getVerticalFromList = (list: string[]): Vertical[] => {
  const parsedVerticalList: Vertical[] = []
  for (let i = 0; i < list.length; i++) {
    const selection = list[i]
    const parsedVertical: Vertical | undefined = verticals.find(
      ({ VerticalName }) => {
        return VerticalName === selection
      }
    )
    if (parsedVertical) parsedVerticalList.push(parsedVertical)
  }
  return parsedVerticalList
}

export const getVerticalNamesFromPair = (list: Pair[]): string[] => {
  const verticalnames: string[] = []
  for (let i = 0; i < list.length; i++) {
    verticalnames.push(list[i].text)
  }
  return verticalnames
}
