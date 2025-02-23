import React from 'react';
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion/MultipleChoiceQuestion';
import InputQuestion from './questions/InputQuestion/InputQuestion';
import ImageTextQuestion from './questions/ImageTextQuestion/ImageTextQuestion';
import ImageUrlQuestion from './questions//ImageUrlQuestion/ImageUrlQuestion';
import DropdownQuestion from './questions/DropdownQuestion/DropdownQuestion';
import FileUploadQuestion from './questions/FileUploadQuestion/FileUploadQuestion';
import CalendarQuestion from './questions/CalendarQuestion/CalendarQuestion';
import SingleChoiceQuestion from './questions/SingleChoiceQuestion/SingleChoiceQuestion';

const questionComponents: Record<string, React.FC<any>> = {
  single: SingleChoiceQuestion,
  multiple: MultipleChoiceQuestion,
  input: InputQuestion,
  imageText: ImageTextQuestion,
  imageUrl: ImageUrlQuestion,
  dropdownList: DropdownQuestion,
  fileUpload: FileUploadQuestion,
  calendar: CalendarQuestion,
};

export default questionComponents;
