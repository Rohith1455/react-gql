import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useBookEvents } from '../CustomHooks/useBookEvents';

const GET_BOOKS = gql`
  query {
    books {
      id
      title
      author
    }
  }
`;



const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!) {
    addBook(title: $title, author: $author) {
      id
      title
      author
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: UUID!) {
    deleteBook(id: $id)
  }
`;

const UPDATE_BOOK = gql`
  mutation UpdateBook($id: UUID!, $title: String, $author: String) {
    updateBook(id: $id, title: $title, author: $author) {
      id
      title
      author
    }
  }
`;

const BookList = () => {
    const { loading, error, data, refetch } = useQuery(GET_BOOKS);
    const [addBook] = useMutation(ADD_BOOK);
    const [deleteBook] = useMutation(DELETE_BOOK);
    const [updateBook] = useMutation(UPDATE_BOOK);

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editAuthor, setEditAuthor] = useState('');
    const [addError, setAddError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [books, setBooks] = useState([]);
    const [highlightedBookId, setHighlightedBookId] = useState(null);

    const [bookToDelete, setBookToDelete] = useState(null);

    //const bookEvents = useBookEvents();
    const { bookEvents, lastAdded, lastDeleted } = useBookEvents();

    // Update book list on added book
    useEffect(() => {
        if (lastAdded) {
            setBooks(prev => [lastAdded, ...prev]);
        }
    }, [lastAdded]);

    // Remove book from list on deletion
    useEffect(() => {
        if (lastDeleted) {
            setBooks(prev => prev.filter(book => book.id !== lastDeleted.id));
        }
    }, [lastDeleted]);
    // Load books on first query
    useEffect(() => {
        if (data?.books) {
            setBooks(data.books);
        }
    }, [data]);

    useEffect(() => {
        if (addError) {
            const timer = setTimeout(() => setAddError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [addError]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleAddBook = async (e) => {
        e.preventDefault();
        setAddError('');

        try {
            setCurrentPage(1);
            const { data } = await addBook({ variables: { title, author } });
            const newBookId = data.addBook.id;

            setTitle('');
            setAuthor('');
            setAddError(null);
            //refetch();         // Refresh book list

            setHighlightedBookId(newBookId); // Highlight the new book

            // Remove highlight after 5 seconds
            setTimeout(() => {
                setHighlightedBookId(null);
            }, 5000);

        } catch (err) {
            const msg = err?.message || 'Failed to add book';
            console.error('Add Book Error:', msg);
            setAddError(msg);
        }
    };

    const handleUpdateBook = async (id) => {
        try {
            await updateBook({
                variables: { id, title: editTitle, author: editAuthor },
            });
            setEditingId(null);
            refetch();
        } catch (err) {
            const msg = err?.message || 'Failed to add book';
            console.error('Add Book Error:', msg);
            setAddError(msg);
        }
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;

    const filtereddata = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filtereddata.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filtereddata.length / itemsPerPage);

    return (
        <div className="container mt-4">


            <div>
                <h2>Live Book Events</h2>
                {bookEvents.length > 0 ? (
                    <div style={{
                        border: '1px solid #ccc',
                        padding: '10px',
                        marginBottom: '10px',
                    }}>
                        {bookEvents
                            .slice(0,5) 
                            .map((event, index) => (
                                <div key={`${event.book.id}-${index}`}>
                                    <p style={{ color: event.type === 'deleted' ? 'red' : 'green' }}>
                                        Book <strong>{event.book.title}</strong> was <strong>{event.type}</strong> on <strong>{new Date(event.time).toLocaleString()}</strong>.
                                    </p>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p>Waiting for book events...</p>
                )}
            </div>


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

            <h3>Search</h3>

            <div className="row mb-3">
                <div className="col-md-10">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by title or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="col-md-2">
                    <button
                        className="btn btn-secondary w-100"
                        onClick={() => setSearchQuery('')}
                    >
                        Clear
                    </button>
                </div>
            </div>


            <h3>Live Book List</h3>
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map(book => (
                        <tr key={book.id} className={book.id === highlightedBookId ? 'table-success' : ''}>

                            <td>{book.id}</td>
                            <td>
                                {editingId === book.id ? (
                                    <input
                                        className="form-control"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    />
                                ) : (
                                    book.title
                                )}
                            </td>
                            <td>
                                {editingId === book.id ? (
                                    <input
                                        className="form-control"
                                        value={editAuthor}
                                        onChange={(e) => setEditAuthor(e.target.value)}
                                    />
                                ) : (
                                    book.author
                                )}
                            </td>
                            <td>
                                {editingId === book.id ? (
                                    <>
                                        <button
                                            className="btn btn-success btn-sm me-2"
                                            onClick={() => handleUpdateBook(book.id)}
                                        >
                                            <FaSave />
                                        </button>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => setEditingId(null)}
                                        >
                                            <FaTimes />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => {
                                                setEditingId(book.id);
                                                setEditTitle(book.title);
                                                setEditAuthor(book.author);
                                            }}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => setBookToDelete(book)}
                                        >
                                            <FaTrash />
                                        </button>

                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-3 d-flex justify-content-center">
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                        </li>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                            </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
            {bookToDelete && (
                <>
                    {/* Modal Overlay */}
                    <div
                        className="modal-backdrop fade show"
                        style={{ zIndex: 1040 }}
                    ></div>

                    {/* Modal Box */}
                    <div
                        className="modal show fade d-block"
                        tabIndex="-1"
                        style={{ zIndex: 1050 }}
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Delete</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setBookToDelete(null)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete "<strong>{bookToDelete.title}</strong>"?</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setBookToDelete(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={async () => {
                                            await deleteBook({ variables: { id: bookToDelete.id } });
                                            setBookToDelete(null);
                                            refetch();
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </div>
    );
};

export default BookList;
