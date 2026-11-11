
import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
    const db = getDb();
    const collection = db.collection('books');

    return await collection.find({}).toArray();
};

const getBookById = async (bookId) => {
    const db = getDb();
    const collection = db.collection('books');

    return await collection.findOne({ id: bookId });
};

const createBook = async (book) => {
    const db = getDb();
    const collection = db.collection('books');

    await collection.insertOne(book);

    return book;
};

const updateBook = async (bookId, book) => {
    const db = getDb();
    const collection = db.collection('books');

    const result = await collection.updateOne(
        { id: bookId },
        { $set: book }
    );

    if (result.matchedCount === 0) {
        return null;
    }

    return await collection.findOne({ id: bookId });
};

const deleteBook = async (bookId) => {
    const db = getDb();
    const collection = db.collection('books');

    return await collection.deleteOne({ id: bookId });
};

const authorExists = async (authorId) => {
    const db = getDb();
    const collection = db.collection('authors');

    const author = await collection.findOne({ id: authorId });

    return Boolean(author);
};

export {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    authorExists
};
