// import { createContext, useState } from "react";
// import runChat from "../config/gemini";

// export const Context = createContext();

// const ContextProvider = (props) => {
//   const [input, setInput] = useState("");
//   const [recentPrompt, setRecentPrompt] = useState("");
//   const [prevPrompts, setPrevPrompts] = useState([]);
//   const [showResult, setShowResult] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [resultData, setResultData] = useState("");
//   const delayPara = (index, nextword) => {
//     setTimeout(function () {
//       setResultData = (prev) => prev + nextword;
//     }, 75 * index);
//   };
//   const newChat=(){
//     setLoading(false)
//     setShowResult(false)

//   }

//   const onSent = async (prompt) => {
//     setResultData("");
//     setLoading(true);
//     setShowResult(true);
//     let response;
//     if (prompt !== undefined) {
//       response = await runChat(prompt);
//       setRecentPrompt(prompt);
//     } else {
//       setPrevPrompts((prev) => [...prev, input]);
//       setRecentPrompt(input)
//       response=await runChat(input)
//     }

//     let responseArray = response.split("");
//     let newResponse = "";
//     for (let i = 0; i < responseArray.length; i++) {
//       if (i === 0 || i % 2 == 1) {
//         newResponse += responseArray[i];
//       } else {
//         newResponse += "<br>" + responseArray[i] + "</br>";
//       }
//     }
//     let newResponse2 = newResponse.split("*".join)("</br>");
//     let newResponseArray = newResponse2.split("");
//     for (let i = 0; i < newResponseArray.length; i++) {
//       const nextword = newResponseArray[i];
//       delayPara(i, nextword + " ");
//     }
//     setLoading(false);
//     setInput("");
//   };

//   const contextValue = {
//     prevPrompts,
//     setPrevPrompts,
//     onSent,
//     setRecentPrompt,
//     recentPrompt,
//     showResult,
//     loading,
//     resultData,
//     input,
//     setInput,
//     newChat,
//   };

//   return (
//     <Context.Provider value={contextValue}>{props.children}</Context.Provider>
//   );
// };

// export default ContextProvider;
import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // Simulate typing effect
  const delayPara = (index, nextWord, fullText) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
      // When it's the last word, turn off loading
      if (index === fullText.length - 1) {
        setLoading(false);
      }
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setInput("");
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    let response;
    if (prompt !== undefined) {
      response = await runChat(prompt);
      setRecentPrompt(prompt);
      // Add to history if it's not the same as the last prompt
      if (prevPrompts[prevPrompts.length - 1] !== prompt) {
        setPrevPrompts((prev) => [...prev, prompt]);
      }
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await runChat(input);
    }

    // Format response: replace newlines with <br> for HTML display
    const formattedResponse = response.replace(/\n/g, "<br>");
    const wordArray = formattedResponse.split(" ");

    // Stream word by word
    for (let i = 0; i < wordArray.length; i++) {
      delayPara(i, wordArray[i] + " ", wordArray);
    }

    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
