import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { answerQuestion, askQuestion, getQuestions } from "../api/questionApi";

export default function QuestionThread({ petId, isOwnerNgo }) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [answerDrafts, setAnswerDrafts] = useState({});
  const [error, setError] = useState("");

  const load = () => {
    getQuestions(petId).then((res) => setQuestions(res.data));
  };

  useEffect(load, [petId]);

  const handleAsk = async (e) => {
    e.preventDefault();
    setError("");
    if (!newQuestion.trim()) return;
    try {
      await askQuestion(petId, newQuestion);
      setNewQuestion("");
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not post your question.");
    }
  };

  const handleAnswer = async (questionId) => {
    const text = answerDrafts[questionId];
    if (!text?.trim()) return;
    await answerQuestion(questionId, text);
    setAnswerDrafts((d) => ({ ...d, [questionId]: "" }));
    load();
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-3">Questions & Answers</h2>

      {user ? (
        <form onSubmit={handleAsk} className="flex gap-2 mb-6">
          <input
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask something about this pet..."
            className="flex-1 border rounded-xl px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-primary-500 text-white px-4 rounded-xl text-sm hover:bg-primary-600"
          >
            Ask
          </button>
        </form>
      ) : (
        <p className="text-sm text-neutral-500 mb-6">
          <a href="/login" className="text-primary-600 underline">
            Log in
          </a>{" "}
          to ask a question.
        </p>
      )}

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="space-y-4">
        {questions.length === 0 && (
          <p className="text-sm text-neutral-500">
            No questions yet — be the first to ask!
          </p>
        )}

        {questions.map((q) => (
          <div key={q.id} className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm font-medium">{q.askedByName} asked:</p>
            <p className="text-sm text-neutral-700 mb-2">{q.question}</p>

            {q.answer ? (
              <div className="bg-primary-50 rounded-lg p-3 mt-2">
                <p className="text-xs font-medium text-primary-600 mb-1">
                  Shelter's reply:
                </p>
                <p className="text-sm text-primary-700">{q.answer}</p>
              </div>
            ) : isOwnerNgo ? (
              <div className="flex gap-2 mt-2">
                <input
                  value={answerDrafts[q.id] || ""}
                  onChange={(e) =>
                    setAnswerDrafts((d) => ({ ...d, [q.id]: e.target.value }))
                  }
                  placeholder="Write a reply..."
                  className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
                />
                <button
                  onClick={() => handleAnswer(q.id)}
                  className="bg-primary-500 text-white px-3 rounded-lg text-sm hover:bg-primary-600"
                >
                  Reply
                </button>
              </div>
            ) : (
              <p className="text-xs text-neutral-400 italic">
                Awaiting a reply from the shelter
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
