import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import styles from "./Questions.module.css";
import { Question } from "../CreateQuizForm";

interface QuestionsProps {
  questionsData: Question[];
  setQuestionsData: React.Dispatch<React.SetStateAction<Question[]>>;
}

export type Answer =
  | { text: string; file: File | null; preview: string }
  | string;


interface ValidationError {
  id: string;
  type: "question" | "answers_empty" | "answer";
  index?: number;
}

const Questions: React.FC<QuestionsProps> = ({ questionsData, setQuestionsData }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [validationErrors,
    // setValidationErrors
  ] = useState<ValidationError[]>([]);
  // const [isQuizValid, setIsQuizValid] = useState<boolean>(true);

  useEffect(() => {
    // validateQuestions();
  }, [questionsData]);

  const handleAddQuestion = (type: Question["type"]) => {
    let typeFile = "any";
    let defaultAnswers: Answer[] = [];

    if (type === "fileUpload") {
      typeFile = "any";
    } else if (type === "imageText") {
      defaultAnswers = [{ text: "", file: null, preview: "" }];
    } else if (type === "imageUrl") {
      defaultAnswers = [{ text: "", file: null, preview: "" }];
    } else if (!["input", "calendar"].includes(type)) {
      defaultAnswers = [""];
    }

    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      question: "",
      type,
      required: false,
      answers: defaultAnswers,
      ...(type === "fileUpload" && { typeFile }),
    };

    setQuestionsData([...questionsData, newQuestion]);
    setIsModalOpen(false);
  };

  const handleUpdateQuestion = (id: string, updatedData: Partial<Question>) => {
    setQuestionsData((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, ...updatedData } : q))
    );
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestionsData((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
  };

  const handleDragEndQuestions = (result: DropResult) => {
    if (!result.destination) return;
    const reorderedQuestions = Array.from(questionsData);
    const [movedQuestion] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, movedQuestion);
    setQuestionsData(reorderedQuestions);
  };

  const handleDragEndAnswers = (id: string, result: DropResult) => {

    const { destination, source } = result;
    if (!destination || destination.index === source.index) {
      return;
    }

    setQuestionsData((prevQuestions) =>
      prevQuestions.map((q) => {
        if (q.id === id) {
          const reorderedAnswers = [...q.answers];
          const [movedAnswer] = reorderedAnswers.splice(source.index, 1);
          reorderedAnswers.splice(destination.index, 0, movedAnswer);

          return { ...q, answers: reorderedAnswers };
        }
        return q;
      })
    );
  };

  // const validateQuestions = () => {
  //   const errors: ValidationError[] = [];

  //   questionsData.forEach((question) => {
  //     if (!question.question.trim()) {
  //       errors.push({ id: question.id, type: "question" });
  //     }

  //     if (question.type !== "input") {
  //       if (question.answers.length === 0) {
  //         errors.push({ id: question.id, type: "answers_empty" });
  //       }

  //       question.answers.forEach((answer, index) => {
  //         if (question.type === "imageText") {
  //           if (
  //             typeof answer !== "string" &&
  //             "text" in answer &&
  //             (!answer.text.trim() || !answer.file)
  //           ) {
  //             errors.push({ id: question.id, type: "answer", index });
  //           }
  //         } else if (question.type === "imageUrl") {
  //           if (typeof answer !== "string" && !answer.file) {
  //             errors.push({ id: question.id, type: "answer", index });
  //           }
  //         } else if (typeof answer === "string") {
  //           if (!answer.trim()) {
  //             errors.push({ id: question.id, type: "answer", index });
  //           }
  //         }
  //       });
  //     }
  //   });

  //   setValidationErrors(errors);
  //   setIsQuizValid(errors.length === 0);
  // };


  const hasError = (id: string, type: ValidationError["type"], index?: number) => {
    return validationErrors.some(
      (error) => error.id === id && error.type === type && (index === undefined || error.index === index)
    );
  };

  const renderQuestionSettings = (question: Question) => (
    <div className={styles.questionSettings} key={question.id}>
      <div className={styles.questionHeader}>
        <h4>Настройки вопроса </h4>
        <button
          onClick={() => handleDeleteQuestion(question.id)}
          className={`${styles.button} ${styles.red}`}
        >
          Удалить вопрос
        </button>
      </div>

      <input
        type="text"
        value={question.question}
        onChange={(e) =>
          handleUpdateQuestion(question.id, { question: e.target.value })
        }
        placeholder="Введите текст вопроса"
        className={`${styles.questionInput} ${hasError(question.id, "question") ? styles.error : ""
          }`}
      />

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={question.required}
          onChange={(e) =>
            handleUpdateQuestion(question.id, { required: e.target.checked })
          }
        />
        Обязательный вопрос
      </label>

      {question.type === "fileUpload" && (
        <div>
          <label>Тип файла:</label>
          <select
            value={question.typeFile || "any"}
            onChange={(e) =>
              handleUpdateQuestion(question.id, { typeFile: e.target.value })
            }
            className={styles.select}
          >
            <option value="any">Любой файл</option>
            <option value="image">Изображение</option>
            <option value="video">Видео</option>
            <option value="audio">Аудио</option>
            <option value="document">Документ</option>
          </select>
        </div>
      )}

      <DragDropContext onDragEnd={(result) => handleDragEndAnswers(question.id, result)}>
        <Droppable droppableId={question.id}>
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={styles.answerList}
            >
              {question.answers.map((answer, index) => (
                <Draggable
                  key={`${question.id}-answer-${index}`}
                  draggableId={`${question.id}-answer-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${styles.answerItem} ${hasError(question.id, "answer", index) ? styles.error : ""
                        }`}
                    >
                      <span
                        {...provided.dragHandleProps}
                        className={styles.dragHandle}
                      >
                        ☰
                      </span>
                      {question.type === "imageText" && typeof answer === "object" && "text" in answer ? (
                        <>
                          <input
                            type="text"
                            value={answer.text}
                            onChange={(e) => {
                              const updatedAnswers = [...question.answers];
                              updatedAnswers[index] = {
                                ...answer,
                                text: e.target.value,
                              };
                              handleUpdateQuestion(question.id, {
                                answers: updatedAnswers,
                              });
                            }}
                            placeholder={`Введите текст ответа ${index + 1}`}
                            className={`${styles.questionInput} ${hasError(question.id, "answer", index)
                              ? styles.error
                              : ""
                              }`}
                          />
                          <input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              const preview = file ? URL.createObjectURL(file) : "";
                              const updatedAnswers = [...question.answers];
                              updatedAnswers[index] = {
                                ...answer,
                                file,
                                preview,
                              };
                              handleUpdateQuestion(question.id, {
                                answers: updatedAnswers,
                              });
                            }}
                            className={styles.questionInput}
                          />
                          {answer.preview && (
                            <img
                              src={answer.preview}
                              alt={`Preview ${index + 1}`}
                              style={{
                                width: "50px",
                                height: "50px",
                                marginLeft: "10px",
                              }}
                            />
                          )}
                        </>
                      ) : question.type === "imageUrl" && typeof answer === "object" && "file" in answer ? (
                        <>
                          <input
                            type="text"
                            value={answer.text}
                            onChange={(e) => {
                              const updatedAnswers = [...question.answers];
                              updatedAnswers[index] = {
                                ...answer,
                                text: e.target.value,
                              };
                              handleUpdateQuestion(question.id, {
                                answers: updatedAnswers,
                              });
                            }}
                            placeholder={`Введите текст ответа ${index + 1}`}
                            className={`${styles.questionInput} ${hasError(question.id, "answer", index) ? styles.error : ""}`}
                          />
                          <input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              const preview = file ? URL.createObjectURL(file) : "";
                              const updatedAnswers = [...question.answers];
                              updatedAnswers[index] = {
                                ...answer,
                                file,
                                preview,
                              };
                              handleUpdateQuestion(question.id, {
                                answers: updatedAnswers,
                              });
                            }}
                            className={styles.questionInput}
                          />
                          {answer.preview && (
                            <img
                              src={answer.preview}
                              alt={`Preview ${index + 1}`}
                              style={{
                                width: "50px",
                                height: "50px",
                                marginLeft: "10px",
                              }}
                            />
                          )}
                        </>
                      ) : (
                        typeof answer === "string" && (
                          <input
                            type="text"
                            value={answer}
                            onChange={(e) => {
                              const updatedAnswers = [...question.answers];
                              updatedAnswers[index] = e.target.value;
                              handleUpdateQuestion(question.id, {
                                answers: updatedAnswers,
                              });
                            }}
                            placeholder={`Введите текст ответа ${index + 1}`}
                            className={`${styles.questionInput} ${hasError(question.id, "answer", index)
                              ? styles.error
                              : ""
                              }`}
                          />
                        )
                      )}
                      <button
                        onClick={() => {
                          const updatedAnswers = question.answers.filter(
                            (_, i) => i !== index
                          );
                          handleUpdateQuestion(question.id, {
                            answers: updatedAnswers,
                          });
                        }}
                        className={styles.deleteButton}
                      >
                        Удалить
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>


      {!["input", "fileUpload", "calendar"].includes(question.type) && (
        <button
          onClick={() =>
            handleUpdateQuestion(question.id, {
              answers:
                question.type === "imageText"
                  ? [...question.answers, { text: "", file: null, preview: "" }]
                  : question.type === "imageUrl"
                    ? [...question.answers, { text: "", file: null, preview: "" }]
                    : [...question.answers, ""],
            })
          }
          className={styles.addAnswerButton}
        >
          Добавить ответ
        </button>
      )}
    </div>
  );


  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Конструктор опроса</h2>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h4>Выберите тип вопроса</h4>
            <div className={styles.modalButtonsContainer}>
              <button
                onClick={() => handleAddQuestion("multiple")}
                className={styles.button}
              >
                Множественный выбор
              </button>
              <button
                onClick={() => handleAddQuestion("single")}
                className={styles.button}
              >
                Одиночный выбор
              </button>
              <button
                onClick={() => handleAddQuestion("input")}
                className={styles.button}
              >
                Пользовательский ввод
              </button>
              <button
                onClick={() => handleAddQuestion("imageText")}
                className={styles.button}
              >
                Варианты и картинка
              </button>
              <button
                onClick={() => handleAddQuestion("imageUrl")}
                className={styles.button}
              >
                Варианты с картинками
              </button>
              <button
                onClick={() => handleAddQuestion("dropdownList")}
                className={styles.button}
              >
                Выпадающий список
              </button>
              <button onClick={() => handleAddQuestion("fileUpload")} className={styles.button}>
                Загрузка файла
              </button>
              <button onClick={() => handleAddQuestion("calendar")} className={styles.button}>
                Календарь
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`${styles.button} ${styles.red}`}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEndQuestions}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {questionsData.map((question, index) => (
                <Draggable
                  key={question.id}
                  draggableId={question.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        marginBottom: "10px",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px",
                          backgroundColor: "#f8f9fa",
                          border: "1px solid #ddd",
                          borderRadius: "5px",
                        }}
                      >
                        <span {...provided.dragHandleProps}>☰</span>
                        <span>{`${index + 1}. ${question.question || "Новый вопрос"}`}</span>
                      </div>
                      {renderQuestionSettings(question)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`${styles.button} ${styles.green}`}
      >
        Добавить вопрос
      </button>
    </div>
  );
};

export default Questions;
