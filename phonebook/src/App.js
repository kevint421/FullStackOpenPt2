import { useState, useEffect } from 'react';
import phonebookService from './services/phonebook';

const Filter = ({ searchTerm, handleSearch }) => (
  <div>
    Filter shown with <input value={searchTerm} onChange={handleSearch} />
  </div>
);

const PersonForm = ({
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
  addPerson,
}) => (
  <form onSubmit={addPerson}>
    <div>
      Name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      Number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">Add</button>
    </div>
  </form>
);

const Persons = ({ persons, searchTerm, deletePerson }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ul>
      {filteredPersons.map((person) => (
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

const Notification = ({ message, success }) => {
  if (message === null) {
    return null;
  }

  const notificationStyle = {
    color: success ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  return <div style={notificationStyle}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    phonebookService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook. Replace the old number with a new one?`
        )
      ) {
        phonebookService
          .update(existingPerson.id, personObject)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : returnedPerson
              )
            );
            setSuccessMessage(`Updated ${newName}'s phone number`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 3000);
            setNewName('');
            setNewNumber('');
          })
          .catch((error) => {
            setErrorMessage(
              `Error updating ${newName}'s phone number: ${error.response.data.error}`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 3000);
          });
      }
    } else {
      phonebookService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setSuccessMessage(`Added ${newName}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
          setNewName('');
          setNewNumber('');
        })
        .catch((error) => {
          setErrorMessage(`Error adding ${newName}: ${error.response.data.error}`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        });
    }
  };

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id);

    if (window.confirm(`Delete ${person.name}?`)) {
      phonebookService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setSuccessMessage(`Deleted ${person.name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
        })
        .catch((error) => {
          setErrorMessage(`Error deleting ${person.name}: ${error.response.data.error}`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={errorMessage} success={false} />
      <Notification message={successMessage} success={true} />
      <Filter searchTerm={searchTerm} handleSearch={handleSearch} />
      <h2>Add a New Person</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} searchTerm={searchTerm} deletePerson={deletePerson} />
    </div>
  );
};

export default App;

