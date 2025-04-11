import React, { useEffect, useState } from "react";
import styles from "./FileUploadQuestion.module.css";

interface FileUploadQuestionProps {
  question: {
    id: string;
    question: string;
    required: boolean;
    type: string;
    typeFile: "any" | "image" | "video" | "audio" | "document";
  };
  answer: File | null;
  onAnswer: (file: File | null) => void;
}

const FileUploadQuestion: React.FC<FileUploadQuestionProps> = ({
  question,
  answer,
  onAnswer,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(answer);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const maxFileSize = 10 * 1024 * 1024; 

  useEffect(() => {
    setSelectedFile(answer || null);
  }, [answer]);


  const fileTypeMapping: { [key: string]: string } = {
    any: "*",
    image: "image/*",
    video: "video/*",
    audio: "audio/*",
    document: "application/pdf,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt"
  };

  const isValidFileType = (file: File): boolean => {
    if (question.typeFile === "any") return true;
    
    const allowedTypes = fileTypeMapping[question.typeFile].split(",").map(ext => ext.trim());
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

    // Проверка для "image/*", "video/*", "audio/*"
    if (question.typeFile === "image" && file.type.startsWith("image/")) return true;
    if (question.typeFile === "video" && file.type.startsWith("video/")) return true;
    if (question.typeFile === "audio" && file.type.startsWith("audio/")) return true;

    return allowedTypes.includes(`.${fileExtension}`) || allowedTypes.some(ext => file.type.includes(ext));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (!file) return;

    if (file.size > maxFileSize) {
      setErrorMessage("Файл слишком большой! Максимальный размер: 10MB.");
      setShowPopup(true);
      event.target.value = "";
      return;
    }

    if (!isValidFileType(file)) {
      setErrorMessage("Неверный формат файла! Пожалуйста, загрузите подходящий файл.");
      setShowPopup(true);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    onAnswer(file);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    if (file.size > maxFileSize) {
      setErrorMessage("Файл слишком большой! Максимальный размер: 10MB.");
      setShowPopup(true);
      return;
    }

    if (!isValidFileType(file)) {
      setErrorMessage("Неверный формат файла! Пожалуйста, загрузите подходящий файл.");
      setShowPopup(true);
      return;
    }

    setSelectedFile(file);
    onAnswer(file);
  };

  const closePopup = () => {
    setShowPopup(false);
    setErrorMessage(null);
  };

  return (
    <div className={styles.container}>
      <h2>{question.question}</h2>
      <div
        className={`${styles.fileUploadContainer} ${isDragging ? styles.dragging : ""}`}
        onClick={() => document.getElementById(`file-input-${question.id}`)?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
      >
        <svg
          className={styles.uploadIcon}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p>Нажмите или перетащите файл сюда</p>
      </div>
      <input
        type="file"
        id={`file-input-${question.id}`}
        accept={fileTypeMapping[question.typeFile] || "*"}
        onChange={handleFileChange}
        hidden
      />
      {selectedFile && (
        <div className={styles.fileTag}>
          <span className={styles.fileName}>{selectedFile.name}</span>
        </div>
      )}

      {showPopup && (
        <div className={styles.popup}>
          <span>{errorMessage}</span>
          <button onClick={closePopup} className={styles.popupButton}>
            OK
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadQuestion;
