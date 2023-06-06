import "./App.css";
import React, { useState, useEffect } from "react";
import { marked } from "marked";
import syntaxData from "./syntax.json";

function useLocalStorage(key, initialValue) {
  const storedItems = JSON.parse(localStorage.getItem(key)) || initialValue;
  const [value, setValue] = useState(storedItems);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);
  return [value, setValue];
}

// function useLocalStorage(key, initialValue) {
//   const [value, setValue] = useState(() => {
//     const storedValue = localStorage.getItem(key);
//     return storedValue ? JSON.parse(storedValue) : initialValue;
//   });

//   useEffect(() => {
//     localStorage.setItem(key, JSON.stringify(value));
//   }, [value]);

//   return [value, setValue];

const basicSyntax = syntaxData.basic_syntax; //Manually downloaded the JSON as API got no access

const App = () => {
  const [code, setCode] = useLocalStorage("localStorage", "## Hello");
  const [compiled, setCompiled] = useState('<h2 id="hello">Hello</h2>');
  const [activeButton, setActiveButton] = useState("markdown");

  const openSection = (section) => {
    setActiveButton(section);
  };

  const handleChange = (e) => {
    setCode(e.target.value);
    setCompiled(marked.parse(e.target.value));
  };

  let editorSection = null;
  if (activeButton === "markdown") {
    editorSection = (
      <div>
        <textarea onChange={handleChange} value={code} />
      </div>
    );
  } else if (activeButton === "preview") {
    editorSection = (
      <div>
        <textarea value={compiled} />
      </div>
    );
  } else if (activeButton === "docs") {
    editorSection = (
      <div className="docs">
        {basicSyntax.map((syntax, index) => (
          <div key={index}>
            <h2>{syntax.name}</h2>
            <h3>{syntax.description}</h3>
            <h2>Example</h2>
            {syntax.examples.map((example, sIndex) => (
              <div key={sIndex}>
                <h4>{example.markdown}</h4>
                <h4>{example.html}</h4>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <h1>MarkDown Previewer React App</h1>
      <div className="container">
        <div className="btns">
          <button onClick={() => openSection("markdown")}>MarkDown</button>
          <button onClick={() => openSection("preview")}>Preview</button>
          <button onClick={() => openSection("docs")}>Docs</button>
        </div>
        {editorSection}
      </div>
    </>
  );
};

export default App;
