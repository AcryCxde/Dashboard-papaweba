import React, { useEffect, useState } from 'react';

   function Application() {
       const [text, setText] = useState('');

       useEffect(() => {
           fetch('http://localhost:8000/text')  // Замените на URL вашего FastAPI
               .then((response) => {
                   if (!response.ok) {
                       throw new Error('Network response was not ok');
                   }
                   return response.json();
               })
               .then((data) => setText(data.message))
               .catch((error) => console.error('There was a problem with the fetch operation:', error));
       }, []);

       return (
           <div>
               <h1>Текст из FastAPI:</h1>
               <p>{text}</p>
           </div>
       );
   }

   export default Application;