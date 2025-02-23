import { IQuizData } from "../components/CreateQuizForm/CreateQuizForm";
import { QuizSubmissionPayload } from "../redux/Quiz/QuizSlice";

export function processObjectToFormData(obj:IQuizData | QuizSubmissionPayload, formData = new FormData(), path = '') {
  
//@ts-ignore
  function traverseAndExtractFiles(obj, currentPath) {
      if (Array.isArray(obj)) {
          obj.forEach((value, index) => {
              const newPath = `${currentPath}[${index}]`;
              if (value instanceof File) {
                  formData.append(newPath, value);
              } else if (typeof value === 'object' && value !== null) {
                  traverseAndExtractFiles(value, newPath);
              } else {
                  formData.append(newPath, value);
              }
          });
      } else if (typeof obj === 'object' && obj !== null) {
          // Если объект — это не массив, а объект
          for (const key in obj) {
              if (!obj.hasOwnProperty(key)) continue;

              const value = obj[key];
              const newPath = currentPath ? `${currentPath}.${key}` : key;

              if (value instanceof File) {
                  formData.append(newPath, value);
              } else if (typeof value === 'object' && value !== null) {
                  traverseAndExtractFiles(value, newPath);
              } else {
                  formData.append(newPath, value);
              }
          }
      } else {
          // Если это примитивное значение
          formData.append(currentPath, obj);
      }
  }


  traverseAndExtractFiles(obj, path);


  formData.append('data', JSON.stringify(obj));

  return formData;
}



export function hexToRgb(hex:string) {
  // Убираем символ #, если он есть
  hex = hex.replace('#', '');

  // Если короткий HEX (например, #f06), преобразуем его в полный (#ff0066)
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}