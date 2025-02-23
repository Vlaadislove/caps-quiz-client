import React from "react";


export interface IDesign {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
}

interface DesignProps {
  designData: IDesign;
  setDesignData: React.Dispatch<React.SetStateAction<IDesign>>;
}

const Design: React.FC<DesignProps> = ({designData, setDesignData}) => {

  const handleChange: React.ChangeEventHandler<HTMLSelectElement | HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setDesignData((prevState)=>(
      { ...prevState, [name]: value }
    ));
  };

  return (
    <div
      style={{
        backgroundColor: designData.backgroundColor,
        color: designData.textColor,
        padding: "20px",
        borderRadius: "10px",
        maxWidth: "400px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Настройки дизайна</h2>


      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "10px" }}>Квиз</h3>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Цвет фона:
          <input
            type="color"
            name="backgroundColor"
            value={designData.backgroundColor}
            onChange={handleChange}
            style={{ marginLeft: "10px" }}
          />
        </label>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Цвет текста:
          <select
            name="textColor"
            value={designData.textColor}
            onChange={handleChange}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="#000000">Черный</option>
            <option value="#ffffff">Белый</option>
          </select>
        </label>
      </div>

      {/* Кнопки */}
      <div>
        <h3 style={{ marginBottom: "10px" }}>Кнопки</h3>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Цвет кнопки:
          <input
            type="color"
            name="buttonColor"
            value={designData.buttonColor}
            onChange={handleChange}
            style={{ marginLeft: "10px" }}
          />
        </label>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Цвет текста кнопки:
          <select
            name="buttonTextColor"
            value={designData.buttonTextColor}
            onChange={handleChange}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="#000000">Черный</option>
            <option value="#ffffff">Белый</option>
          </select>
        </label>
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          style={{
            backgroundColor: designData.buttonColor,
            color: designData.buttonTextColor,
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          Пример кнопки
        </button>
      </div>
    </div>
  );
};

export default Design;
