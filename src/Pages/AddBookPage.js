import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!) {
    addBook(title: $title, author: $author) {
      id
      title
      author
    }
  }
`;

function AddBookPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [addBook] = useMutation(ADD_BOOK);
  const [addError, setAddError] = useState('');
  const navigate = useNavigate();

  const handleAddBook = async (e) => {
    e.preventDefault();
    setAddError('');

    try {
      await addBook({ variables: { title, author } });
      navigate('/'); // Navigate back to book list
    } catch (err) {
      setAddError(err?.message || 'Failed to add book');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add Book</h3>
      <form onSubmit={handleAddBook} className="mb-4">
        <div className="row g-2">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Add Book</button>
          </div>
        </div>

        {addError && (
          <div className="alert alert-danger mt-2" role="alert">
            {addError}
          </div>
        )}
      </form>
    </div>
  );
}

export default AddBookPage;
