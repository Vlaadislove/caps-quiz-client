import { useState } from "react";
import styles from './StartPage.module.css'

export interface FileWithPreview {
  file: File;
  preview: string;
}

export interface FormData {
  companySlogan: string;
  title: string;
  description: string;
  buttonText: string;
  phoneNumber: string;
  companyName: string;
}

export interface IStartPage {
  backgroundImage: FileWithPreview | null;
  backgroundImageMobile: FileWithPreview | null;
  logoImage: FileWithPreview | null;
  formData: FormData;
  layout: "standard" | "centered" | "background";
  alignment: "left" | "right" | "center" | null;
  useStartPage: boolean;
}

interface StartPageProps {
  startPageData: IStartPage;
  setStartPageData: React.Dispatch<React.SetStateAction<IStartPage>>;
}

const StartPage: React.FC<StartPageProps> = ({ startPageData, setStartPageData }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStateChange = (key: string, value: FileWithPreview | null | string | boolean) => {
    setStartPageData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleFormDataChange = (name: string, value: string) => {
    setStartPageData((prevState) => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));
  };

  const handleFileUpload = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      handleStateChange(key, { file, preview });
    }
  };

  const removeFile = (key: string) => {
    handleStateChange(key, null);
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleFormDataChange(name, value);
  };

  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    handleStateChange("layout", value);

    if (value === "centered") {
      handleStateChange("alignment", null);
    } else {
      handleStateChange("alignment", "left");
    }
  };

  return (
    <div className={styles.startPage}>
      <div className={styles.upperPart}>
        <div className={styles.leftPart}>
          {startPageData.backgroundImage ? (
            <>
              <div className={styles.backgroundContainer}>
                <img src={startPageData.backgroundImage.preview} alt="Фон" className={styles.previewImage} />
                <button onClick={() => removeFile("backgroundImage")} className={styles.removeButton}>
                  Удалить фон
                </button>
                <button onClick={toggleModal} className={styles.mobileUploadButton}>
                  Добавить фон для мобильной версии
                </button>
              </div>
            </>
          ) : (
            <label htmlFor="background-upload" className={styles.uploadLabel}>
              <div className={styles.uploadBox}>Добавить фон</div>
              <input
                id="background-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileUpload("backgroundImage", e)}
              />
            </label>
          )}
        </div>

        {isModalOpen && (
          <div className={styles.modal} onClick={(e) => {
            if (e.target === e.currentTarget) {
              toggleModal();
            }
          }}>
            <div className={styles.modalContent}>
              <h3>Добавить фон для мобильной версии</h3>
              {startPageData.backgroundImageMobile ? (
                <div className={styles.mobilePreview}>
                  <img
                    src={startPageData.backgroundImageMobile.preview}
                    alt="Мобильный фон"
                    className={styles.mobileImage}
                  />
                  <button onClick={() => removeFile("backgroundImageMobile")} className={styles.removeButton}>
                    Удалить
                  </button>
                </div>
              ) : (
                <label htmlFor="mobile-background-upload" className={styles.uploadLabel}>
                  <div className={styles.uploadBox}>Загрузить изображение</div>
                  <input
                    id="mobile-background-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileUpload("backgroundImageMobile", e)}
                  />
                </label>
              )}
              <button onClick={toggleModal} className={styles.closeModalButton}>
                Закрыть
              </button>
            </div>
          </div>
        )}


        <div className={styles.rightPart}>
          <div className={styles.logoContainer}>
            {startPageData.logoImage ? (
              <div className={styles.logoPreview}>
                <img src={startPageData.logoImage.preview} alt="Логотип" className={styles.logoImage} />
                <button onClick={() => removeFile("logoImage")} className={styles.logoRemoveButton}>
                  ✕
                </button>
              </div>
            ) : (
              <label htmlFor="logo-upload" className={styles.uploadLabel}>
                <div className={styles.addLogoBox}>+</div>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileUpload("logoImage", e)}
                />
              </label>
            )}
            <input
              type="text"
              name="companySlogan"
              value={startPageData.formData.companySlogan}
              onChange={handleInputChange}
              placeholder="Название или слоган компании"
              className={styles.textInput}
            />
          </div>
          <input
            type="text"
            name="title"
            value={startPageData.formData.title}
            onChange={handleInputChange}
            placeholder="Введите заголовок страницы"
            className={styles.pageTitle}
          />
          <input
            name="description"
            value={startPageData.formData.description}
            onChange={handleInputChange}
            placeholder="Дополнительный текст-описание"
            className={styles.textarea}
          />
          <input
            type="text"
            name="buttonText"
            value={startPageData.formData.buttonText}
            onChange={handleInputChange}
            placeholder="Название кнопки для Начала"
            className={styles.textInput}
          />
          <input
            type="text"
            name="phoneNumber"
            value={startPageData.formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="+7-911-111-11-11"
            className={styles.textInput}
          />
          <input
            type="text"
            name="companyName"
            value={startPageData.formData.companyName}
            onChange={handleInputChange}
            placeholder='ООО "Название компании"'
            className={styles.textInput}
          />
        </div>
      </div>

      <div className={styles.bottomPanel}>
        <div>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={startPageData.useStartPage}
              onChange={(e) => handleStateChange("useStartPage", e.target.checked)}
              className={styles.checkbox}
            />
            Использовать стартовую страницу
          </label>
        </div>
        <div>
          <label htmlFor="layout-select">Расположение:</label>
          <select id="layout-select" value={startPageData.layout} onChange={handleLayoutChange} className={styles.selectBox}>
            <option value="standard">Стандартное</option>
            <option value="centered">По центру</option>
            <option value="background">Фоновая картинка</option>
          </select>
        </div>

        {startPageData.layout !== "centered" && (
          <div>
            <label htmlFor="alignment-select">Выравнивание:</label>
            <select
              id="alignment-select"
              value={startPageData.alignment || "left"}
              onChange={(e) => handleStateChange("alignment", e.target.value)}
              className={styles.selectBox}
            >
              {startPageData.layout === "standard" && (
                <>
                  <option value="left">Слева</option>
                  <option value="right">Справа</option>
                </>
              )}
              {startPageData.layout === "background" && (
                <>
                  <option value="left">Слева</option>
                  <option value="center">По центру</option>
                  <option value="right">Справа</option>
                </>
              )}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartPage;