import { Link } from 'react-router-dom';


const quizzes = [
  { id: "1737968779441-774542429", name: 'Quiz 1' },
  { id: 2, name: 'Quiz 2' },
  { id: 3, name: 'Quiz 3' },
];

const MyQuizes = () => {
  return (
    <div>
      <h1>My Quizes</h1>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <Link to={`/my-quiz/${quiz.id}`}>{quiz.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyQuizes;
