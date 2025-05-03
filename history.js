document.addEventListener('DOMContentLoaded', () => {
    // Simulated borrowing history (could be fetched from a backend)
    const booksData = {
        books: [
            {
                id: 1,
                title: "Black Salt large",
                author: "Dr. F. Oyeyemi",
                genre: "Fiction",
                available: true,
                cover: "/Black_Salt_large.webp"
            },
            {
                id: 2,
                title: "Buying a Business",
                author: "Jonathan",
                genre: "Business",
                available: true,
                cover: "/image/buying a business.jpeg"
            },
            {
                id: 3,
                title: "Gate of Africa",
                author: "Harper Lee",
                genre: "History",
                available: false,
                cover: "/image/gate of africa.jpg"
            },
            {
                id: 4,
                title: "Roman Conquest of North Africa",
                author: "Nic Feild",
                genre: "History",
                available: true,
                cover: "/image/North-Africa.jpg"
            },
            {
                id: 5,
                title: "The Negroes",
                author: "J.R.R. Tolkien",
                genre: "History",
                available: true,
                cover: "/image/the book of negroes.jpeg"
            },
            {
                id: 6,
                title: "Bury The Chains",
                author: "Jane Austen",
                genre: "History",
                available: false,
                cover: "/image/Bury The Chains.jpg"
            },
            {
                id: 7,
                title: "Civil Engineering handbook",
                author: "Proveen Dwivedi | Prachi Brajpai",
                genre: "Engineering",
                available: true,
                cover: "/image/Civil-Engineering-handbook-gkp.jpg"
            },
            {
                id: 8,
                title: "Into Africa",
                author: "Mike Connell",
                genre: "History",
                available: true,
                cover: "/image/into Africa.jpg"
            },
            {
                id: 9,
                title: "Basic Mechanical Engineering",
                author: "M.P. Poonia | S.C. Sharma",
                genre: "Engineering",
                available: true,
                cover: "/image/basic mechanical engineering.jpeg"
            },
            {
                id: 10,
                title: "The Book of Africa",
                author: "Yuval Noah Harari",
                genre: "History",
                available: true,
                cover: "/image/The Book of Africa.jpg"
            },
            {
                id: 11,
                title: "The Aristotle Politics",
                author: "Carnes Lord",
                genre: "Politics",
                available: true,
                cover: "/image/Aristotle.jpg"
            },
            {
                id: 12,
                title: "The Political Class",
                author: "Peter Allens",
                genre: "Politics",
                available: true,
                cover: "/image/the political class.jpg"
            },
            {
                id: 13,
                title: "Kingdom of Africa",
                author: "Adedoyin Remilekun",
                genre: "History",
                available: false,
                cover: "/image/9780520395671.avif"
            },
            {
                id: 14,
                title: "The Handbook of Mechanical Engineering",
                author: "Rowland Wuzo",
                genre: "Engineering",
                available: false,
                cover: "/image/The Handbook of Mechanical engineering.jpeg"
            },
            {
                id: 15,
                title: "Politics on the Edge",
                author: "Rory Stewart",
                genre: "Politics",
                available: false,
                cover: "/image/politics on the Edge.jpg"
            },
            {
                id: 16,
                title: "Our Time is Now",
                author: "Stacy Adams",
                genre: "Politics",
                available: false,
                cover: "/image/Our Time is Now.jpg"
            },
            {
                id: 17,
                title: "Superstar Business Secrets",
                author: "Mark T. Moore",
                genre: "Business",
                available: false,
                cover: "/image/superstar business secrets.jpg"
            },
            {
                id: 18,
                title: "The First 90 Days",
                author: "Peter Allens",
                genre: "Business",
                available: true,
                cover: "/image/the first 90 days.webp"
            }
        ]
    };

    // Initialize borrowing history from localStorage or empty arrays
    let borrowingHistory = JSON.parse(localStorage.getItem('borrowingHistory')) || {
        current: [],
        past: []
    };

    const currentlyReadingSection = document.querySelector('.history-container');
    const emptyState = document.querySelector('.empty-state');

    // Function to calculate due date status
    const getDueDateStatus = (borrowDate) => {
        const borrow = new Date(borrowDate);
        const now = new Date();
        const due = new Date(borrow);
        due.setDate(borrow.getDate() + 14); // 14-day borrowing period
        const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

        if (now > due) {
            return { text: `Overdue by ${Math.abs(diffDays)} days`, class: 'status-overdue', progress: 'progress-danger', width: '100%' };
        } else if (diffDays <= 3) {
            return { text: `Due in ${diffDays} days`, class: 'status-active', progress: 'progress-warning', width: `${100 - (diffDays / 14) * 100}%` };
        } else {
            return { text: `Due in ${diffDays} days`, class: 'status-active', progress: 'progress-warning', width: `${100 - (diffDays / 14) * 100}%` };
        }
    };

    // Function to render borrowing history
    const renderHistory = () => {
        const currentContainer = currentlyReadingSection.querySelector('.history-item')?.parentNode;
        const pastContainer = currentlyReadingSection.querySelector('.history-item.status-returned')?.parentNode;

        // Clear existing items
        document.querySelectorAll('.history-item').forEach(item => item.remove());

        // Render currently reading
        borrowingHistory.current.forEach(borrow => {
            const book = booksData.books.find(b => b.id === borrow.bookId);
            if (!book) return;

            const status = getDueDateStatus(borrow.borrowDate);
            const item = document.createElement('div');
            item.className = `history-item ${status.class}`;
            item.innerHTML = `
                <img src="${book.cover}" class="book-cover-sm" alt="${book.title}">
                <div class="book-info">
                    <h6 class="book-title">${book.title}</h6>
                    <p class="book-author">${book.author}</p>
                    <div class="book-meta">
                        <span class="badge-genre"><i class="bi bi-tag"></i> ${book.genre}</span>
                        <span class="due-date"><i class="bi ${status.text.includes('Overdue') ? 'bi-exclamation-triangle' : 'bi-calendar-week'}"></i> ${status.text}</span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar ${status.progress}" style="width: ${status.width}"></div>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-return" data-id="${book.id}"><i class="bi bi-arrow-return-left"></i> Return</button>
                </div>
            `;
            currentContainer.appendChild(item);
        });

        // Render past borrowing
        borrowingHistory.past.forEach(borrow => {
            const book = booksData.books.find(b => b.id === borrow.bookId);
            if (!book) return;

            const item = document.createElement('div');
            item.className = 'history-item status-returned';
            item.innerHTML = `
                <img src="${book.cover}" class="book-cover-sm" alt="${book.title}">
                <div class="book-info">
                    <h6 class="book-title">${book.title}</h6>
                    <p class="book-author">${book.author}</p>
                    <div class="book-meta">
                        <span class="badge-genre"><i class="bi bi-tag"></i> ${book.genre}</span>
                        <span class="due-date"><i class="bi bi-check-circle"></i> Returned ${new Date(borrow.returnDate).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-return" disabled><i class="bi bi-check-lg"></i> Returned</button>
                </div>
            `;
            pastContainer.appendChild(item);
        });

        // Show/hide empty state
        if (borrowingHistory.current.length === 0 && borrowingHistory.past.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    };

    // Handle return button
    currentlyReadingSection.addEventListener('click', (e) => {
        if (e.target.closest('.btn-return') && !e.target.closest('.btn-return').disabled) {
            const bookId = parseInt(e.target.closest('.btn-return').dataset.id);
            const borrowIndex = borrowingHistory.current.findIndex(b => b.bookId === bookId);
            if (borrowIndex !== -1) {
                const borrow = borrowingHistory.current.splice(borrowIndex, 1)[0];
                borrowingHistory.past.push({
                    bookId: borrow.bookId,
                    borrowDate: borrow.borrowDate,
                    returnDate: new Date().toISOString()
                });

                // Update book availability
                const book = booksData.books.find(b => b.id === bookId);
                if (book) book.available = true;

                // Save to localStorage
                localStorage.setItem('borrowingHistory', JSON.stringify(borrowingHistory));

                // Re-render history
                renderHistory();
            }
        }
    });

    // Initial render
    renderHistory();
});