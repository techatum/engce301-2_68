const BookService = require('../services/book.service');

exports.getAll = async (req, res) => {
    try {
        const books = await BookService.getAllBooks();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const book = await BookService.getBookById(req.params.id);
        res.json(book);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.search = async (req, res) => {
    try {
        // รับ query param ?q=keyword
        const keyword = req.query.q;
        const books = await BookService.searchBooks(keyword);
        res.json(books);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newBook = await BookService.createBook(req.body);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updatedBook = await BookService.updateBook(req.params.id, req.body);
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// [ใหม่]
    exports.delete = async (req, res) => {
        try {
            await BookService.deleteBook(req.params.id);
            res.json({ message: 'Book deleted successfully' });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    };