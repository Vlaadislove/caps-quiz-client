import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

export interface FileWithPreview {
  file: File;
  preview: string;
}

interface ILeftInputs {
  id: string;
  placeholder: string;
  value: string;
}

interface IRightInputs {
  id: string;
  placeholder: string;
  required: boolean;
}

export interface IContactForm {
  leftInputs: ILeftInputs[];
  rightInputs: IRightInputs[];
  backgroundImage: FileWithPreview | null;
}

interface ContactFormProps {
  contactFormData: IContactForm;
  setContactFormData: React.Dispatch<React.SetStateAction<IContactForm>>;
}

const ContactForm: React.FC<ContactFormProps> = ({contactFormData, setContactFormData}) => {
  const [removedFields, setRemovedFields] = useState<IRightInputs[]>([]);
  const [addFieldModalVisible, setAddFieldModalVisible] = useState(false);
  const [editFieldModalVisible, setEditFieldModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<IRightInputs | null>(null);


  useEffect(() => {
    console.log(contactFormData)
  }, [contactFormData])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(contactFormData.rightInputs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setContactFormData((prevState) => ({
      ...prevState,
      rightInputs: items,
    }));
  };

  const handleRemoveField = (fieldId: string) => {
    const removedField = contactFormData.rightInputs.find((input) => input.id === fieldId);
    
    if (removedField) {
      setContactFormData((prevState) => ({
        ...prevState,
        rightInputs: prevState.rightInputs.filter((input) => input.id !== fieldId),
      }));
      setRemovedFields((prev) => [...prev, removedField]);
    } else {
      console.warn(`Field with id "${fieldId}" not found.`);
    }
  };

  const handleAddField = (fieldId: string) => {
    const restoredField = removedFields.find((field) => field.id === fieldId)
  
    if (restoredField) {
      setContactFormData((prevState) => ({
        ...prevState,
        rightInputs: [...prevState.rightInputs, restoredField],
      }));
      setRemovedFields((prev) => prev.filter((field) => field.id !== fieldId));
    }
  };

  const toggleAddFieldModal = () => {
    setAddFieldModalVisible((prev) => !prev);
  };

  const openEditFieldModal = (field:IRightInputs) => {
    setCurrentField(field);
    setEditFieldModalVisible(true);
  };

  const closeEditFieldModal = () => {
    setEditFieldModalVisible(false);
    setCurrentField(null);
  };

const handleToggleRequired = (checked: boolean) => {
  if (currentField) {
    setCurrentField((prev) => (prev ? { ...prev, required: checked } : null));

    setContactFormData((prevState) => ({
      ...prevState,
      rightInputs: prevState.rightInputs.map((input) =>
        input.id === currentField.id ? { ...input, required: checked } : input
      ),
    }));
  }
};

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      if (contactFormData.backgroundImage?.preview) {
        URL.revokeObjectURL(contactFormData.backgroundImage.preview);
      }

      const preview = URL.createObjectURL(file);
      setContactFormData((prevState) => ({
        ...prevState,
        backgroundImage: { file, preview },
      }));

      event.target.value = "";
    }
  };

  const handleRemoveBackground = () => {
    if (contactFormData.backgroundImage?.preview) {
      URL.revokeObjectURL(contactFormData.backgroundImage.preview);
    }
    setContactFormData((prevState) => ({
      ...prevState,
      backgroundImage: null,
    }));
  };

  const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setContactFormData((prevState) => ({
      ...prevState,
      leftInputs: [
        { ...prevState.leftInputs[0], value: e.target.value },
        prevState.leftInputs[1],
      ],
    }));
  };

  const handleSubtitleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setContactFormData((prevState) => ({
      ...prevState,
      leftInputs: [
        prevState.leftInputs[0],
        { ...prevState.leftInputs[1], value: e.target.value },
      ],
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "70%",
        height: "auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        paddingBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "20px",
            backgroundColor: "#fff",
            borderRight: "1px solid #ddd",
          }}
        >
          <input
            type="text"
            placeholder={contactFormData.leftInputs[0].placeholder}
            value={contactFormData.leftInputs[0].value}
            onChange={handleTitleChange}
            style={{
              display: "block",
              width: "100%",
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#555",
              border: "none",
              outline: "none",
            }}
          />
          <input
            type="text"
            placeholder={contactFormData.leftInputs[1].placeholder}
            value={contactFormData.leftInputs[1].value}
            onChange={handleSubtitleChange}
            style={{
              display: "block",
              width: "100%",
              fontSize: "14px",
              color: "#888",
              border: "none",
              outline: "none",
            }}
          />
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "flex-start", }}>
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontSize: "14px",
                color: "#555",
              }}
            >
              Использовать изображение:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              style={{ marginBottom: "10px" }}
            />
            {contactFormData.backgroundImage && (
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={contactFormData.backgroundImage.preview}
                  alt="preview"
                  style={{ width: "100px", height: "100px", marginBottom: "10px", borderRadius: "5px" }}
                />
                <button
                  onClick={handleRemoveBackground}
                  style={{
                    backgroundColor: "#ff4081",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="right-inputs">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {contactFormData.rightInputs.map((input, index) => (
                    <Draggable key={input.id} draggableId={input.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "15px",
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            padding: "10px",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <span
                            {...provided.dragHandleProps}
                            style={{
                              marginRight: "10px",
                              cursor: "grab",
                              color: "#888",
                            }}
                          >
                            ☰
                          </span>
                          <input
                            type="text"
                            placeholder={input.placeholder}
                            // defaultValue={input.defaultValue}
                            readOnly={true}
                            style={{
                              flex: 1,
                              border: "none",
                              outline: "none",
                              fontSize: "14px",
                              color: "#000",
                            }}
                          />
                          <button
                            onClick={() => openEditFieldModal(input)}
                            style={{
                              marginLeft: "10px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#888",
                            }}
                          >
                            ⚙️
                          </button>
                          <button
                            onClick={() => handleRemoveField(input.id)}
                            style={{
                              marginLeft: "10px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#888",
                            }}
                          >
                            ❌
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {removedFields.length > 0 && (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <button
            onClick={toggleAddFieldModal}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "10px 20px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Добавить поле
          </button>
        </div>
      )}

      {editFieldModalVisible && currentField && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "20px" }}>Настройки поля</h3>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <span>Обязательное поле</span>
              <input
                type="checkbox"
                checked={currentField.required || false}
                onChange={(e) => handleToggleRequired(e.target.checked)}
              />
            </label>
            <button
              onClick={closeEditFieldModal}
              style={{
                marginTop: "20px",
                backgroundColor: "#ff4081",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                padding: "10px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {addFieldModalVisible && removedFields.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "20px" }}>Выберите поле для добавления</h3>
            {removedFields.map((field) => (
              <button
                key={field.id}
                onClick={() => {
                  handleAddField(field.id);
                  toggleAddFieldModal();
                }}
                style={{
                  display: "block",
                  margin: "10px auto",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                {field.placeholder}
              </button>
            ))}
            <button
              onClick={toggleAddFieldModal}
              style={{
                marginTop: "20px",
                backgroundColor: "#ff4081",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                padding: "10px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
