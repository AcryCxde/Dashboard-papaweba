import React, { useState } from 'react';
import '../styles/Constructor.css';

function Constructor() {
  const [title, setTitle] = useState('Конструктор');
  const [elements, setElements] = useState([]);
  const [newElement, setNewElement] = useState('');

  const handleAddElement = () => {
    if (newElement.trim()) {
      setElements([...elements, newElement]);
      setNewElement('');
    }
  };

  const handleRemoveElement = (index) => {
    const updatedElements = elements.filter((_, i) => i !== index);
    setElements(updatedElements);
  };

  return (
    <div className="page-container">
      <h1>{title}</h1>
      <div className="page-content">
        <p>Здесь можно создать или настроить различные элементы.</p>
        <div className="input-group">
          <input
            type="text"
            placeholder="Введите название элемента"
            value={newElement}
            onChange={(e) => setNewElement(e.target.value)}
          />
          <button onClick={handleAddElement}>Добавить элемент</button>
        </div>
        {elements.length > 0 ? (
          <ul className="elements-list">
            {elements.map((element, index) => (
              <li key={index} className="element-item">
                {element}
                <button
                  className="remove-button"
                  onClick={() => handleRemoveElement(index)}
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Элементы пока не добавлены.</p>
        )}
      </div>
    </div>
  );
}

export default Constructor;
