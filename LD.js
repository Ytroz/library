// shared-library.js
class LibraryManager {
    constructor() {
        this.STORAGE_KEY = 'books';
        this.initializeSampleData();
    }

    // Initialize with sample data if empty
    initializeSampleData() {
        if (!this.getAllBooks().length) {
            const sampleBooks = [
                { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", status: "Available", borrowedBy: null, dueDate: null, borrowCount: 0 },
                { id: 2, title: "Atomic Habits", author: "James Clear", genre: "Business", status: "Available", borrowedBy: null, dueDate: null, borrowCount: 0 },
                { id: 3, title: "Sapiens", author: "Yuval Noah Harari", genre: "History", status: "Borrowed", borrowedBy: "John Doe", dueDate: this.getFutureDate(7), borrowCount: 3 },
                { id: 4, title: "The Lean Startup", author: "Eric Ries", genre: "Business", status: "Available", borrowedBy: null, dueDate: null, borrowCount: 2 },
                { id: 5, title: "The Art of War", author: "Sun Tzu", genre: "History", status: "Borrowed", borrowedBy: "Jane Smith", dueDate: this.getFutureDate(3), borrowCount: 5 },
                { id: 6, title: "Clean Code", author: "Robert C. Martin", genre: "Engineering", status: "Available", borrowedBy: null, dueDate: null, borrowCount: 1 }
            ];
            this.saveAllBooks(sampleBooks);
        }
    }

    getFutureDate(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    }

    getAllBooks() {
        const books = localStorage.getItem(this.STORAGE_KEY);
        return books ? JSON.parse(books) : [];
    }

    saveAllBooks(books) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(books));
    }

    getBookById(id) {
        return this.getAllBooks().find(book => book.id === id);
    }

    updateBook(id, updates) {
        const books = this.getAllBooks();
        const index = books.findIndex(book => book.id === id);
        
        if (index !== -1) {
            books[index] = { ...books[index], ...updates };
            this.saveAllBooks(books);
            return true;
        }
        return false;
    }

    borrowBook(id, borrowerName) {
        const book = this.getBookById(id);
        if (book && book.status === "Available") {
            const updates = {
                status: "Borrowed",
                borrowedBy: borrowerName,
                dueDate: this.getFutureDate(14),
                borrowCount: book.borrowCount + 1
            };
            return this.updateBook(id, updates);
        }
        return false;
    }

    returnBook(id) {
        const book = this.getBookById(id);
        if (book && book.status === "Borrowed") {
            const updates = {
                status: "Available",
                borrowedBy: person,
                dueDate: null
            };
            return this.updateBook(id, updates);
        }
        return false;
    }

    getAvailableBooks() {
        return this.getAllBooks().filter(book => book.status === "Available");
    }

    getBorrowedBooks() {
        return this.getAllBooks().filter(book => book.status === "Borrowed");
    }

    getBooksByGenre(genre) {
        return this.getAllBooks().filter(book => book.genre === genre);
    }

    getMostBorrowedBooks(limit = 5) {
        return this.getAllBooks()
            .sort((a, b) => b.borrowCount - a.borrowCount)
            .slice(0, limit);
    }

    getUpcomingReturns(limit = 5) {
        return this.getBorrowedBooks()
            .filter(book => book.dueDate)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
       
     .slice(0, limit);
    }

    
}

const libraryManager = new LibraryManager();


// LD.js
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString();
    
    // Initialize dashboard
    updateDashboardStats();
    renderBorrowingChart();
    renderGenreChart();
    renderMostBorrowedBooks();
    renderUpcomingReturns();
    
    // Set up periodic refresh (every 5 minutes)
    setInterval(() => {
        updateDashboardStats();
        renderMostBorrowedBooks();
        renderUpcomingReturns();
    }, 300000);
});

function updateDashboardStats() {
    const books = libraryManager.getAllBooks();
    const availableBooks = libraryManager.getAvailableBooks().length;
    const borrowedThisMonth = books.filter(book => {
        // Simple approximation for "this month" - in a real app, track actual borrow dates
        return book.status === "Borrowed" && book.borrowCount > 0;
    }).length;
    const activeBorrowers = new Set(books.map(book => book.borrowedBy).filter(Boolean)).size;
    // 
    document.getElementById('totalBooks').textContent = books.length;
    document.getElementById('availableBooks').textContent = availableBooks;
    document.getElementById('borrowedThisMonth').textContent = borrowedThisMonth;
    document.getElementById('activeBorrowers').textContent = activeBorrowers;
}

function renderBorrowingChart() {
    const ctx = document.getElementById('borrowingChart').getContext('2d');
    
    // Sample data - in a real app, you'd track monthly borrowing data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const borrowData = [15, 22, 18, 25, 30, 28, 35];
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Books Borrowed',
                data: borrowData,
                backgroundColor: '#4361ee',
                borderColor: '#3f37c9',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderGenreChart() {
    const ctx = document.getElementById('genreChart').getContext('2d');
    const books = libraryManager.getAllBooks();
    
    // Count books by genre
    const genreCounts = books.reduce((acc, book) => {
        acc[book.genre] = (acc[book.genre] || 0) + 1;
        return acc;
    }, {});
    
    const genres = Object.keys(genreCounts);
    const counts = Object.values(genreCounts);
    
    // Generate colors based on genres
    const colors = genres.map((_, i) => {
        const hue = (i * 360 / genres.length) % 360;
        return `hsl(${hue}, 70%, 60%)`;
    });
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: genres,
            datasets: [{
                data: counts,
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
    
    // Render genre badges
    const genreBadges = document.getElementById('genreBadges');
    genreBadges.innerHTML = genres.map(genre => 
        `<span class="badge-genre me-2 mb-2">${genre} (${genreCounts[genre]})</span>`
    ).join('');
}

function renderMostBorrowedBooks() {
    const container = document.getElementById('mostBorrowedBooks');
    const books = libraryManager.getMostBorrowedBooks(5);
    
    if (books.length === 0) {
        container.innerHTML = '<p class="text-muted">No borrowing data available</p>';
        return;
    }
    
    container.innerHTML = books.map(book => `
        <div class="most-borrowed">
            <div class="book-cover-xs"></div>
            <div>
                <h6 class="mb-0">${book.title}</h6>
                <small class="text-muted">${book.author}</small>
                <div class="mt-1">
                    <span class="badge bg-primary">Borrowed ${book.borrowCount} times</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderUpcomingReturns() {
    const container = document.getElementById('upcomingReturns');
    const books = libraryManager.getUpcomingReturns(5);
    
    if (books.length === 0) {
        container.innerHTML = '<tr><td colspan="3" class="text-muted">No upcoming returns</td></tr>';
        return;
    }
    
    container.innerHTML = books.map(book => {
        const today = new Date();
        const dueDate = new Date(book.dueDate);
        const isOverdue = dueDate < today;
        
        return `
            <tr ${isOverdue ? 'class="overdue"' : ''}>
                <td>${book.title}</td>
                <td>${book.borrowedBy}</td>
                <td>
                    ${book.dueDate}
                    ${isOverdue ? '<span class="badge bg-danger ms-2">Overdue</span>' : ''}
                </td>
            </tr>
        `;
    }).join('');
}// Sample catalog.js content to get started
document.addEventListener('DOMContentLoaded', function() {
    // Sample book data - replace with your actual data source
    const books = [
        {
            id: 2,
            title: "Buying a Business",
            author: "Jonathan",
            genre: "Business",
            status: "Available",
            image: "/image/buying a business.jpeg"
        },
        // Add more books as needed
    ];

    // Function to render books
    function renderBooks(bookList) {
        const catalogElement = document.getElementById('bookCatalog');
        catalogElement.innerHTML = '';
        
        if (bookList.length === 0) {
            document.getElementById('emptyState').classList.remove('d-none');
            return;
        }
        
        document.getElementById('emptyState').classList.add('d-none');
        
        bookList.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'col';
            bookCard.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${book.image}" class="card-img-top" alt="${book.title}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text text-muted">${book.author}</p>
                        <span class="badge bg-primary">${book.genre}</span>
                        <span class="badge ${book.status === 'Available' ? 'bg-success' : 'bg-warning'} float-end">${book.status}</span>
                    </div>
                    <div class="card-footer bg-transparent">
                        <button class="btn btn-sm btn-outline-primary view-details" data-id="${book.id}">View Details</button>
                    </div>
                </div>
            `;
            catalogElement.appendChild(bookCard);
        });
    }

    // Initial render
    renderBooks(books);

    // Add event listeners for search/filter functionality
    // Add modal handling
    // Add borrow/return functionality
});

