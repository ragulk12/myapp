import { useState } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [userName, setUserName] = useState(""); // State for the user's name
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const [loginName, setLoginName] = useState(""); // State for login form input

  function handleLogin(e) {
    e.preventDefault();
    if (loginName.trim() !== "") {
      setUserName(loginName.trim());
      setIsLoggedIn(true);
    }
  }

  async function generateAnswer(e) {
    e.preventDefault();
    setGeneratingAnswer(true);
    setAnswer("Loading your answer... It might take up to 10 seconds.");
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.REACT_APP_GENERATIVE_LANGUAGE_CLIENT}`,
        {
          contents: [{ parts: [{ text: question }] }],
        }
      );
      setAnswer(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    } finally {
      setGeneratingAnswer(false);
    }
  }

  return (
    <div className="container-fluid bg-light d-flex flex-column justify-content-center align-items-center vh-100">
      {!isLoggedIn ? (
        <form
          onSubmit={handleLogin}
          className="w-100 p-4 text-center bg-white shadow rounded"
          style={{ maxWidth: "500px" }}
        >  
          <h1 className="display-4 text-primary mb-4">Login</h1>
          <input
            type="text"
            required
            className="form-control mb-3"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            placeholder="Enter your name"
          />
          <button
            type="submit"
            className="btn btn-primary"
          >
            Login
          </button>
        </form>
      ) : (
        <>
          <h1 className="display-4 text-primary mb-4">Chat AI</h1>
          <h2 className="text-secondary mb-4">Welcome, {userName}!</h2>
          <form
            onSubmit={generateAnswer}
            className="w-100 p-4 text-center bg-white shadow rounded"
            style={{ maxWidth: "500px" }}
          >
            <textarea
              required
              className="form-control mb-3"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything"
              style={{ minHeight: "100px" }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={generatingAnswer}
            >
              {generatingAnswer ? "Generating..." : "Generate answer"}
            </button>
          </form>

          <div className="w-100 mt-4 p-4 bg-white shadow rounded" style={{ maxWidth: "500px" }}>
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
