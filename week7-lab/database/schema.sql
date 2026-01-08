-- ============================================
-- Library Management System Database Schema
-- ============================================

PRAGMA foreign_keys = ON;

-- ===== BOOKS TABLE =====
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE,
    category TEXT,
    total_copies INTEGER NOT NULL DEFAULT 1 CHECK(total_copies >= 0),
    available_copies INTEGER NOT NULL DEFAULT 1 CHECK(available_copies >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== MEMBERS TABLE =====
-- TODO: นักศึกษาสร้าง table members
-- ต้องมี: id, name, email (UNIQUE), phone, membership_date, status
CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    membership_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive'))
);

-- ===== BORROWINGS TABLE =====
-- TODO: นักศึกษาสร้าง table borrowings
-- ต้องมี: id, book_id (FK), member_id (FK), borrow_date, due_date, return_date, status
CREATE TABLE IF NOT EXISTS borrowings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status TEXT DEFAULT 'borrowed' CHECK(status IN ('borrowed', 'returned', 'overdue')),
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (member_id) REFERENCES members(id)
);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);

-- TODO: สร้าง indexes สำหรับ members (email)
-- TODO: สร้าง indexes สำหรับ borrowings (book_id, member_id, status)
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_borrowings_search ON borrowings(book_id, member_id, status);

-- ===== SAMPLE DATA: Books =====
INSERT INTO books (title, author, isbn, category, total_copies, available_copies) VALUES
    ('Clean Code', 'Robert C. Martin', '978-0132350884', 'Programming', 3, 3),
    ('Design Patterns', 'Gang of Four', '978-0201633610', 'Programming', 2, 2),
    ('The Pragmatic Programmer', 'Hunt & Thomas', '978-0135957059', 'Programming', 2, 1),
    ('Introduction to Algorithms', 'CLRS', '978-0262033848', 'Computer Science', 5, 5),
    ('Database System Concepts', 'Silberschatz', '978-0078022159', 'Database', 3, 2);

-- ===== SAMPLE DATA: Members =====
-- TODO: Insert 3 members
INSERT INTO members (name, email, phone, membership_date, status) VALUES
    ('Somchai Jaidee', 'somchai@example.com', '081-111-1111', '2024-01-01', 'active'),
    ('Somsri Rakrian', 'somsri@example.com', '089-222-2222', '2024-02-15', 'active'),
    ('Mana Chujai', 'mana@example.com', '085-333-3333', '2023-12-01', 'inactive');

-- ===== SAMPLE DATA: Borrowings =====
-- TODO: Insert 3 borrowings (บางเล่มยืมอยู่, บางเล่มคืนแล้ว)
INSERT INTO borrowings (book_id, member_id, borrow_date, due_date, return_date, status) VALUES
    (3, 1, '2025-01-01', '2025-01-15', NULL, 'borrowed'),  -- สมชายยืม The Pragmatic Programmer (ยังไม่คืน)
    (5, 2, '2025-01-05', '2025-01-19', NULL, 'borrowed'),  -- สมศรีชื่อยืม DB Concepts (ยังไม่คืน)
    (1, 1, '2024-12-01', '2024-12-15', '2024-12-14', 'returned'); -- สมชายเคยยืม Clean Code (คืนแล้ว)