
import {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    authorExists
} from '../models/books.js';

const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();

        return res.status(200).json(books);
    } catch (error) {
        console.error('GET /books failed:', error.message);

        return res.status(500).json({
            message: 'Unable to retrieve books.'
        });
    }
};

const getBookByIdHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await getBookById(id);

        if (!book) {
            return res.status(404).json({
                message: 'Book not found.'
            });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error('GET /books/:id failed:', error.message);

        return res.status(500).json({
            message: 'Unable to retrieve book.'
        });
    }
};

const createBookHandler = async (req, res) => {
    try {
        const { id, authorId, title, publicationDate } = req.body ?? {};

        if (
            typeof id !== 'string' ||
            !id.trim() ||
            typeof authorId !== 'string' ||
            !authorId.trim() ||
            typeof title !== 'string' ||
            !title.trim() ||
            typeof publicationDate !== 'string' ||
            !publicationDate.trim()
        ) {
            return res.status(400).json({
                message: 'Invalid or missing book fields.'
            });
        }

        const cleanId = id.trim();
        const cleanAuthorId = authorId.trim();

        const existingBook = await getBookById(cleanId);

        if (existingBook) {
            return res.status(400).json({
                message: 'Book ID already exists.'
            });
        }

        const validAuthor = await authorExists(cleanAuthorId);

        if (!validAuthor) {
            return res.status(400).json({
                message: 'Author ID does not match an existing author.'
            });
        }

        const newBook = {
            id: cleanId,
            authorId: cleanAuthorId,
            title: title.trim(),
            publicationDate: publicationDate.trim()
        };

        const createdBook = await createBook(newBook);

        return res.status(201).json(createdBook);
    } catch (error) {
        console.error('POST /books failed:', error.message);

        return res.status(500).json({
            message: 'Unable to create book.'
        });
    }
};

const updateBookHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { authorId, title, publicationDate } = req.body ?? {};

        if (
            typeof authorId !== 'string' ||
            !authorId.trim() ||
            typeof title !== 'string' ||
            !title.trim() ||
            typeof publicationDate !== 'string' ||
            !publicationDate.trim()
        ) {
            return res.status(400).json({
                message: 'Invalid or missing book fields.'
            });
        }

        const existingBook = await getBookById(id);

        if (!existingBook) {
            return res.status(404).json({
                message: 'Book not found.'
            });
        }

        const cleanAuthorId = authorId.trim();

        const validAuthor = await authorExists(cleanAuthorId);

        if (!validAuthor) {
            return res.status(400).json({
                message: 'Author ID does not match an existing author.'
            });
        }

        const updatedBook = await updateBook(id, {
            authorId: cleanAuthorId,
            title: title.trim(),
            publicationDate: publicationDate.trim()
        });

        if (!updatedBook) {
            return res.status(404).json({
                message: 'Book not found.'
            });
        }

        return res.status(200).json(updatedBook);
    } catch (error) {
        console.error('PUT /books/:id failed:', error.message);

        return res.status(500).json({
            message: 'Unable to update book.'
        });
    }
};

const deleteBookHandler = async (req, res) => {
    try {
        const { id } = req.params;

        const existingBook = await getBookById(id);

        if (!existingBook) {
            return res.status(404).json({
                message: 'Book not found.'
            });
        }

        await deleteBook(id);

        return res.status(204).send();
    } catch (error) {
        console.error('DELETE /books/:id failed:', error.message);

        return res.status(500).json({
            message: 'Unable to delete book.'
        });
    }
};

export {
    getBooksHandler,
    getBookByIdHandler,
    createBookHandler,
    updateBookHandler,
    deleteBookHandler
};
