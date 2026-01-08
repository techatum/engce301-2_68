const BookDB = require('../database/books.db');

class BookService {
    
    static async getAllBooks() {
        return await BookDB.findAll();
    }

    static async getBookById(id) {
        const book = await BookDB.findById(id);
        if (!book) throw new Error('Book not found');
        return book;
    }

    static async searchBooks(keyword) {
        if (!keyword) throw new Error('Keyword is required');
        return await BookDB.search(keyword);
    }

    static async createBook(bookData) {
        // Validation: total_copies ต้องไม่ติดลบ
        if (bookData.total_copies < 0) {
            throw new Error('Total copies cannot be negative');
        }

        // หมายเหตุ: การเช็ค ISBN ซ้ำ ปกติ SQLite จะ throw error ให้เองถ้าเรา set UNIQUE ไว้
        // แต่ถ้าจะเช็คก่อนก็ได้ครับ (ในที่นี้ปล่อยให้ DB จัดการ Error จะง่ายกว่า)
        
        try {
            return await BookDB.create(bookData);
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                throw new Error('ISBN already exists');
            }
            throw error;
        }
    }

    static async updateBook(id, bookData) {
        // เช็คก่อนว่ามีหนังสือไหม
        const existingBook = await BookDB.findById(id);
        if (!existingBook) throw new Error('Book not found');

        // อัปเดตข้อมูล
        return await BookDB.update(id, bookData);
    }

    // [ใหม่]
    static async deleteBook(id) {
        const book = await BookDB.findById(id);
        if (!book) throw new Error('Book not found');
        
        // (Optional) อาจจะเช็คเพิ่มว่าหนังสือเล่มนี้ถูกยืมอยู่ไหม ถ้าถูกยืมห้ามลบ
        
        return await BookDB.delete(id);
    }
}

module.exports = BookService;