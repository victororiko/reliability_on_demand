import * as React from 'react';
import { DatePicker, DayOfWeek, IDatePickerStrings } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/react';

const DayPickerStrings: IDatePickerStrings = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],

  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

  shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

  goToToday: 'Go to today',
  prevMonthAriaLabel: 'Go to previous month',
  nextMonthAriaLabel: 'Go to next month',
  prevYearAriaLabel: 'Go to previous year',
  nextYearAriaLabel: 'Go to next year',
  closeButtonAriaLabel: 'Close date picker',
  monthPickerHeaderAriaLabel: '{0}, select to change the year',
  yearPickerHeaderAriaLabel: '{0}, select to change the month',

  isRequiredErrorMessage: 'Field is required.',

  invalidInputErrorMessage: 'Invalid date format.',
};

const controlClass = mergeStyleSets({
  control: {
    margin: '0 0 15px 0',
    maxWidth: '300px',
  },
});

const firstDayOfWeek = DayOfWeek.Sunday;

interface IMyDatePickerProps{
  defaultDate:Date;
  label:string;
}

export const MyDatePicker: React.FC<IMyDatePickerProps> = (props:IMyDatePickerProps) => (
  <div className="docs-DatePickerExample">
    <DatePicker
      className={controlClass.control}
      label={props.label}
      isRequired={true}
      firstDayOfWeek={firstDayOfWeek}
      strings={DayPickerStrings}
      ariaLabel="Select a date"
      value={props.defaultDate}
    />
  </div>
);
