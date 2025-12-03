import React, { useState, useEffect } from "react";
import { decode } from "html-entities";
import { clsx } from "clsx";

export default function App() {
  const [allData, setAllData] = useState([]);
  const [page, setPage] = useState("intro");
  const [checkAnswers, setCheckAnswers] = useState(false);
  const [selected, setSelected] = useState({});


  ///////* Derived variables*///////
  const correctAnswers = allData.map((item) => item.correct_answer);
  const selectedCorrectAnswers = correctAnswers.filter((item, index) => {
    return item === selected[index];
  });
  const numCorrect = selectedCorrectAnswers.length;

  ///////* Data from OTDB API  *///////
  const url = "https://opentdb.com/api.php?amount=5";

  useEffect(() => {
    if (page === "quiz") {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          ///////* Decode HTML Entities *///////
          const decodedData = data.results.map((item) => {
            const wrongAnswers = item.incorrect_answers.map((answer) =>
              decode(answer)
            );
            const correctAnswer = decode(item.correct_answer);

            // Insert the correct answer at a random position in the wrong answers
            const randomIndex = Math.floor(Math.random() * wrongAnswers.length);
            wrongAnswers.splice(randomIndex, 0, correctAnswer);

            return {
              ...item,
              question: decode(item.question),
              incorrect_answers: wrongAnswers,
              correct_answer: correctAnswer,
              multipleChoices: wrongAnswers,
            };
          });

          ///* Using state - setting my allData array to have the revised data w/out HTML entities *///
          setAllData(decodedData);
          //console.log(decodedData)
        })
        .catch((error) => console.error("Fetch failed:", error));
    }
  }, [page]);

  ///////*Handles Quizzical's start button, when clicked it will render the quiz page*///////
  function handleClick() {
    setCheckAnswers(false);
    setPage("quiz");
    //console.log("clicked!")
  }

  ///////*Handles play again button, when clicked it will render a new game*///////
  function handlePlayAgain() {
    setPage("intro");
    setAllData([]);
    setSelected({})
    console.log("clicked");
  }

  ///////*Handles choice selection*///////
  function handleSelected(choice, questionIndex) {
    // Update state: store selected answer for this question
    setSelected((prev) => ({
      ...prev,
      [questionIndex]: choice,
    }));
  }
  //console.log(selected)

  ///////* Runs when user clicks "Check answer" *///////
  function handleCheckAnswers() {
    setCheckAnswers(true);
  }

  return (
    <main>
      {/*First Page - Start  */}
      {page === "intro" && (
        <section className="firstPage">
          <h1>Quizzical</h1>
          <p>If you get stuck, just guess.</p>
          <p> We won’t tell anyone.</p>
          <button className="startQuiz" onClick={handleClick}>
            {" "}
            Start quiz{" "}
          </button>
        </section>
      )}

      {/*Second Page - 
        This section is a comibination of the quiz - following checked answers - Quiz */}
      {page === "quiz" && (
        <section className="quizPage">
          <div className="questionContainer">
            {allData.map((item, index) => (
            <>
              <div className="questionSection" key={index} >
                <p className="questionText">{item.question} </p>
                <div className="buttonsContainer">
                {item.multipleChoices.map((choice) => {
                  // console.log(item.correct_answer)

                  /* -After clicking "Check answers", we want all non-correct choices to fade (opacity). 
                        The STRICT NOT EQUAL operator (!==) is used to check 
                        if the choice is NOT the correct answer → TRUE   
                        if the choice IS the correct answer → FALSE 
                        notSelected: checkAnswers && → 
                                                    (is checkAnswers true- ref function handleCheckAnswers above.)
                                                    
                                    choice !== item.correct_answer → 
                                                    ( if the choice does NOT = correct answer )
                                                    
                So essentially in order for the clsx class (notSelected) to be applied in css we need the choice to result to TRUE in order to have opacity. */

                  return (
                    <button
                      key={choice}
                      disabled={checkAnswers === true && choice != item.correct_answer ? true : false}
                      onClick={() => handleSelected(choice, index)}
                     className={clsx("answersButtons",{ selected: checkAnswers === false && selected[index] === choice, notSelected: checkAnswers && choice !== item.correct_answer, wrong: checkAnswers && choice === selected[index], correct: checkAnswers && choice === item.correct_answer, })}
                    >
                      {choice}
                    </button>
                  );
                })}
                </div>
              </div>
              <hr/>
              </>
            ))}
          </div>

          {checkAnswers === false && allData.length > 0 && (
            <button 
              disabled={Object.keys(selected).length === allData.length ? false : true}
              className="checkAnswers"
              onClick={() => handleCheckAnswers()}
            >
              {" "}
              Check answers
            </button>
          )}

          {checkAnswers && (
            <div className="resultsContainer">
              <p className="resultsText">
                You scored {numCorrect} / {allData.length} correct answers{" "}
              </p>
              <button className="playAgain" onClick={() => handlePlayAgain()}>
                {" "}
                Play again{" "}
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
