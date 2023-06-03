const Header = ({ course }) => <h2>{course.name}</h2>;

const Total = ({ parts }) => {
  const sum = parts.reduce((total, part) => total + part.exercises, 0);
  return <p><b>total of {sum} exercises</b></p>;
};

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
);

const Course = ({ course }) => (
  <div>
    <Header course={course} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
);

export default Course;
