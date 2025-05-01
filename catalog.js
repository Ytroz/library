document.addEventListener('DOMContentLoaded', function() {
    // Book data
    const books = [
        {
            id: 1,
            title: "Black Salt",
            author: "Dr. F. Oyeyemi",
            genre: "History",
            status: "Available",
            image: "/Black_Salt_large.webp"
        },
        {
            id: 2,
            title: "Buying a Business",
            author: "Jonathan",
            genre: "Business",
            status: "Available",
            image: "/image/buying a business.jpeg"
        },
        {
            id: 3,
            title: "Gate of Africa",
            author: "Harper Lee",
            genre: "History",
            status: "Borrowed",
            image: "/image/gate of africa.jpg"
        },
        {
            id: 4,
            title: "Roman Conquest of North Africa",
            author: "Nic Feild",
            genre: "History",
            status: "Available",
            image: "/image/North-Africa.jpg"
        },
        {
            id: 5,
            title: "The Book of Negroes",
            author: "Lawrence Hill",
            genre: "History",
            status: "Available",
            image: "/image/the book of negroes.jpeg"
        },
        {
            id: 6,
            title: "Bury The Chains",
            author: "Adam Hochschild",
            genre: "History",
            status: "Borrowed",
            image: "/image/Bury The Chains.jpg"
        },
        {
            id: 7,
            title: "Civil Engineering Handbook",
            author: "Proveen Dwivedi | Prachi Brajpai",
            genre: "Engineering",
            status: "Available",
            image: "/image/Civil-Engineering-handbook-gkp.jpg"
        },
        {
            id: 8,
            title: "Into Africa",
            author: "Mike Connell",
            genre: "History",
            status: "Available",
            image: "/image/into Africa.jpg"
        },
        {
            id: 9,
            title: "Basic Mechanical Engineering",
            author: "M.P. Poonia | S.C. Sharma",
            genre: "Engineering",
            status: "Available",
            image: "/image/basic mechanical engineering.jpeg"
        },
        {
            id: 10,
            title: "The Book of Africa",
            author: "Various Authors",
            genre: "History",
            status: "Available",
            image: "/image/The Book of Africa.jpg"
        },
        {
            id: 11,
            title: "The Aristotle Politics",
            author: "Carnes Lord",
            genre: "Politics",
            status: "Available",
            image: "/image/Aristotle.jpg"
        },
        {
            id: 12,
            title: "The Political Class",
            author: "Peter Allens",
            genre: "Politics",
            status: "Available",
            image: "/image/the political class.jpg"
        },
        {
            id: 13,
            title: "Kingdom of Africa",
            author: "Adedoyin Remilekun",
            genre: "History",
            status: "Borrowed",
            image: "/image/9780520395671.avif"
        },
        {
            id: 14,
            title: "The Handbook of Mechanical Engineering",
            author: "Rowland Wuzo",
            genre: "Engineering",
            status: "Borrowed",
            image: "/image/The Handbook of Mechanical engineering.jpeg"
        },
        {
            id: 15,
            title: "Politics on the Edge",
            author: "Rory Stewart",
            genre: "Politics",
            status: "Borrowed",
            image: "/image/politics on the Edge.jpg"
        },
        {
            id: 16,
            title: "Our Time is Now",
            author: "Stacy Adams",
            genre: "Politics",
            status: "Borrowed",
            image: "/image/Our Time is Now.jpg"
        },
        {
            id: 17,
            title: "Superstar Business Secrets",
            author: "Mark T. Moore",
            genre: "Business",
            status: "Borrowed",
            image: "/image/superstar business secrets.jpg"
        },
        {
            id: 18,
            title: "The First 90 Days",
            author: "Michael D. Watkins",
            genre: "Business",
            status: "Available",
            image: "/image/the first 90 days.webp"
        }
    ];

    // DOM Elements
    const bookCatalog = document.getElementById('bookCatalog');
    const searchInput = document.getElementById('searchInput');
    const genreFilter = document.getElementById('genreFilter');
    const statusFilter = document.getElementById('statusFilter');
    const resetFilters = document.getElementById('resetFilters');
    const resetFiltersEmpty = document.getElementById('resetFiltersEmpty');
    const bookCount = document.getElementById('bookCount');
    const emptyState = document.getElementById('emptyState');
    
    // Modal Elements
    const bookModal = new bootstrap.Modal(document.getElementById('bookModal'));
    const bookModalTitle = document.getElementById('bookModalTitle');
    const bookModalImage = document.getElementById('bookModalImage');
    const bookModalName = document.getElementById('bookModalName');
    const bookModalAuthor = document.getElementById('bookModalAuthor');
    const bookModalGenre = document.getElementById('bookModalGenre');
    const bookModalStatus = document.getElementById('bookModalStatus');
    const borrowBtn = document.getElementById('borrowBtn');
    const returnBtn = document.getElementById('returnBtn');

    let currentBookId = null;

    // Initialize the app
    function init() {
        renderBooks(books);
        setupEventListeners();
    }

    // Render books to the DOM
    function renderBooks(booksToRender) {
        bookCatalog.innerHTML = '';
        
        if (booksToRender.length === 0) {
            emptyState.classList.remove('d-none');
            bookCatalog.classList.add('d-none');
            bookCount.textContent = 'No books found';
            return;
        }
        
        emptyState.classList.add('d-none');
        bookCatalog.classList.remove('d-none');
        
        booksToRender.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'col';
            bookCard.innerHTML = `
                <div class="card book-card" data-id="${book.id}">
                    <img src="${book.image}" class="card-img-top book-cover" alt="${book.title} Cover">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text text-muted">${book.author}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge" data-genre="${book.genre}">${book.genre}</span>
                            <span class="${book.status === 'Available' ? 'available' : 'borrowed'}">
                                <i class="bi ${book.status === 'Available' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i> ${book.status}
                            </span>
                        </div>
                    </div>
                </div> 
            `;
            bookCatalog.appendChild(bookCard);
            
            // Add click event to each book card
            bookCard.querySelector('.book-card').addEventListener('click', () => openBookModal(book.id));
        });
        
        // Update book count
        bookCount.textContent = `Showing ${booksToRender.length} of ${books.length} books`;
    }

    // Filter books based on search and filters
    function filterBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        const genreValue = genreFilter.value;
        const statusValue = statusFilter.value;gyl
        
        const filteredBooks = books.filter(book => {
            const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                                book.author.toLowerCase().includes(searchTerm) ||
                                book.genre.toLowerCase().includes(searchTerm);
            const matchesGenre = genreValue === 'all' || book.genre === genreValue;
            const matchesStatus = statusValue === 'all' || book.status === statusValue;
            
            return matchesSearch && matchesGenre && matchesStatus;
        });
        
        renderBooks(filteredBooks);
    }

    // Open book modal with details
    function openBookModal(bookId) {
        const book = books.find(b => b.id === bookId);
        if (!book) return;
        
        currentBookId = bookId;
        bookModalTitle.textContent = book.title;
        bookModalName.textContent = book.title;
        bookModalAuthor.textContent = book.author;
        bookModalImage.src = book.image;
        bookModalImage.alt = `${book.title} Cover`;
        bookModalGenre.textContent = book.genre;
        bookModalGenre.className = 'badge';
        bookModalGenre.setAttribute('data-genre', book.genre);
        
        if (book.status === 'Available') {
            bookModalStatus.innerHTML = `<i class="bi bi-check-circle-fill text-success"></i> Available`;
            borrowBtn.classList.remove('d-none');
            returnBtn.classList.add('d-none');
        } else {
            bookModalStatus.innerHTML = `<i class="bi bi-x-circle-fill text-danger"></i> Borrowed`;
            borrowBtn.classList.add('d-none');
            returnBtn.classList.remove('d-none');
        }
        
        bookModal.show();
    }

    // Toggle book status (borrow/return)
    function toggleBookStatus() {
        const bookIndex = books.findIndex(b => b.id === currentBookId);
        if (bookIndex === -1) return;
        
        books[bookIndex].status = books[bookIndex].status === 'Available' ? 'Borrowed' : 'Available';
        filterBooks();
        bookModal.hide();
    }

    // Setup event listeners
    function setupEventListeners() {
        searchInput.addEventListener('input', filterBooks);
        genreFilter.addEventListener('change', filterBooks);
        statusFilter.addEventListener('change', filterBooks);
        resetFilters.addEventListener('click', resetAllFilters);
        resetFiltersEmpty.addEventListener('click', resetAllFilters);
        borrowBtn.addEventListener('click', toggleBookStatus);
        returnBtn.addEventListener('click', toggleBookStatus);
    }

    // Reset all filters
    function resetAllFilters() {
        searchInput.value = '';
        genreFilter.value = 'all';
        statusFilter.value = 'all';
        filterBooks();
    }

    // Initialize the application
    init();
});