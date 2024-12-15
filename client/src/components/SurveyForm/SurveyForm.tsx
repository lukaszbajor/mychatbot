import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faX } from "@fortawesome/free-solid-svg-icons";
import styles from "./SurveyForm.module.css";
import { useEffect, useState } from "react";
import { useChat } from "../../context/ChatbotContext";

function SurveyForm() {
  const { socket, isShowSurveyForm, setIsShowSurveyForm } = useChat();
  const [rating, setRating] = useState<number>(0);
  const [surveyFields, setSurveyFields] = useState<any[]>([]);
  const [comment, setComment] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = [
      { input: "Ocena bota", value: rating },
      { input: "Komentarz", value: comment },
    ];

    socket?.emit("submit_survey", formData);

    setIsShowSurveyForm(false);
  };

  useEffect(() => {
    socket?.on("get_survey_response", (data) => {
      console.log(data);
      setSurveyFields(data);
    });

    return () => {
      socket?.off("get_survey_response");
    };
  }, [socket]);

  return (
    <form className={styles.ratingForm} onSubmit={handleSubmit}>
      <button
        className={styles.closeSurvey}
        onClick={() => {
          setIsShowSurveyForm(!isShowSurveyForm);
        }}
      >
        <FontAwesomeIcon icon={faX} />
      </button>

      {surveyFields.map((field) => {
        if (field.type === "number") {
          return (
            <div key={field.label} className={styles.field}>
              <label className={styles.title}>{field.label}:</label>
              <div>
                {[...Array(field.length)].map((_, index) => (
                  <FontAwesomeIcon
                    key={index + 1}
                    icon={faStar}
                    className={
                      rating >= index + 1 ? styles.activeStar : styles.star
                    }
                    onClick={() => setRating(index + 1)}
                  />
                ))}
              </div>
            </div>
          );
        }

        if (field.type === "textarea") {
          return (
            <div key={field.label} className={styles.field}>
              <label className={styles.title}>{field.label}:</label>
              <textarea
                maxLength={field.length}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className={styles.textarea}
                placeholder="Napisz komentarz..."
              />
            </div>
          );
        }

        return null;
      })}
      <button type="submit" className={styles.submit}>
        Wyślij
      </button>
    </form>
  );
}

export default SurveyForm;
