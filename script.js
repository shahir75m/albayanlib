  
        // No Firebase SDK imports needed as backend is removed.

        // --- Configuration ---
        // No INTERNAL_AUTH_DOMAIN needed as Firebase Auth is removed.

        // Global variables (no Firebase app, db, auth)
        let isAppReady = false; // Flag to ensure app is ready

        // --- DOM Elements ---
        // Removed appContainer as it's no longer the main wrapper
        const currentLoggedInUserIdDisplay = document.getElementById('currentLoggedInUserIdDisplay');
        const loadingOverlay = document.getElementById('loadingOverlay');

        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section-content');

        // Catalog Section Elements
        const bookForm = document.getElementById('bookForm');
        const bookFormTitle = document.getElementById('bookFormTitle'); // New: Form title for Add/Edit
        const bookFormSubmitBtn = document.getElementById('bookFormSubmitBtn'); // New: Submit button for Add/Edit
        const cancelBookEditBtn = document.getElementById('cancelBookEditBtn'); // New: Cancel button for Edit
        const bookListDiv = document.getElementById('bookList');
        const noBooksMessage = document.getElementById('noBooksMessage');

        // Issue Section Elements
        const issueBookForm = document.getElementById('issueBookForm');
        const catalogNumberSearchInput = document.getElementById('catalogNumberSearch');
        const searchBookBtn = document.getElementById('searchBookBtn');
        const issueUserIdSearchInput = document.getElementById('issueUserIdSearch'); // User ID search in Issue section
        const searchUserInIssueBtn = document.getElementById('searchUserInIssueBtn'); // Search button for user lookup in Issue section
        const issueLibrarianSelect = document.getElementById('issueLibrarianSelect'); // New: Librarian select dropdown
        const selectedBookDisplay = document.getElementById('selectedBookDisplay');
        const selectedBookTitle = document.getElementById('selectedBookTitle');
        const selectedBookAuthor = document.getElementById('selectedBookAuthor');
        const selectedBookISBN = document.getElementById('selectedBookISBN');
        const selectedBookCatalogNumber = document.getElementById('selectedBookCatalogNumber');
        const selectedBookAvailableCopies = document.getElementById('selectedBookAvailableCopies');
        const selectedUserDisplay = document.getElementById('selectedUserDisplay');
        const selectedUserName = document.getElementById('selectedUserName');
        const selectedUserClass = document.getElementById('selectedUserClass');
        const issueBookSubmitBtn = document.getElementById('issueBookSubmitBtn');
        const issuedBooksListDiv = document.getElementById('issuedBooksList');
        const noIssuedBooksMessage = document.getElementById('noIssuedBooksMessage');

        // History Section Elements
        const historyTableBody = document.getElementById('historyTableBody'); // Changed from historyLogListDiv
        const noHistoryMessage = document.getElementById('noHistoryMessage');

        // User Management Section (now includes add user form)
        const addUserForm = document.getElementById('addUserForm');
        const userFormTitle = document.getElementById('userFormTitle'); // New: Form title for Add/Edit
        const userFormSubmitBtn = document.getElementById('userFormSubmitBtn'); // New: Submit button for Add/Edit
        const cancelUserEditBtn = document.getElementById('cancelUserEditBtn'); // New: Cancel button for Edit
        const newUserIdInput = document.getElementById('newUserId'); // New User ID input field
        const newUserNameInput = document.getElementById('newUserName');
        const newUserClassSelect = document.getElementById('newUserClass');
        const userListDiv = document.getElementById('userList'); // This will now be the container for class columns
        const noUsersMessage = document.getElementById('noUsersMessage');

        // Librarian Section Elements
        const addLibrarianForm = document.getElementById('addLibrarianForm');
        const librarianFormTitle = document.getElementById('librarianFormTitle');
        const librarianFormSubmitBtn = document.getElementById('librarianFormSubmitBtn');
        const cancelLibrarianEditBtn = document.getElementById('cancelLibrarianEditBtn');
        const newLibrarianIdInput = document.getElementById('newLibrarianId');
        const newLibrarianNameInput = document.getElementById('newLibrarianName');
        const librarianListDiv = document.getElementById('librarianList');
        const noLibrariansMessage = document.getElementById('noLibrariansMessage');


        // Dashboard Elements
        const totalBooksCount = document.getElementById('totalBooksCount');
        const issuedBooksCount = document.getElementById('issuedBooksCount');
        const totalUsersCount = document.getElementById('totalUsersCount');
        const totalLibrariansCount = document.getElementById('totalLibrariansCount'); // New: Librarian count element

        // Confirmation Modal Elements
        const confirmationModal = document.getElementById('confirmationModal');
        const confirmationModalTitle = document.getElementById('confirmationModalTitle');
        const confirmationModalMessage = document.getElementById('confirmationModalMessage');
        const confirmYesBtn = document.getElementById('confirmYesBtn');
        const confirmNoBtn = document.getElementById('confirmNoBtn');

        // --- Data Models (Local Arrays for quick lookup) ---
        let myLibrary = []; // Represents all books in the catalog
        let users = []; // Stores user data (id, name, class)
        let issuedBooks = []; // Stores currently issued book records
        let historyLog = []; // Stores all issue/return transactions
        let librarians = []; // Stores librarian data (id, name)

        // For edit mode
        let editingBookId = null;
        let editingUserId = null;
        let editingLibrarianId = null; // New: For librarian edit mode

        // For issue/return section
        let selectedBookForIssue = null;
        let selectedUserForIssue = null; // Stores the selected user object from the input field
        let selectedLibrarianForIssue = null; // New: Stores the selected librarian object

        // Callback for confirmation modal
        let confirmationCallback = null;

        // Message box utility
        function showMessage(message, type = 'success') {
            const messageBox = document.getElementById('messageBox');
            messageBox.textContent = message;
            messageBox.className = `message-box show ${type}`;
            setTimeout(() => {
                messageBox.classList.remove('show');
            }, 3000);
        }

        // Custom confirmation modal function
        function showConfirmationModal(title, message, callback) {
            confirmationModalTitle.textContent = title;
            confirmationModalMessage.textContent = message;
            confirmationCallback = callback;
            confirmationModal.classList.add('show');
        }

        function hideConfirmationModal() {
            confirmationModal.classList.remove('show');
            confirmationCallback = null;
        }

        function showLoading() {
            loadingOverlay.classList.remove('hidden');
        }

        function hideLoading() {
            loadingOverlay.classList.add('hidden');
        }

        // --- Application Initialization ---
        async function initializeApp() {
            showLoading();
            try {
                // Simulate loading time
                await new Promise(resolve => setTimeout(resolve, 500)); 
                
                isAppReady = true;
                // appContainer.classList.remove('hidden'); // Removed as app-container is no longer the main hidden wrapper
                currentLoggedInUserIdDisplay.textContent = 'Status: Local Admin Access (No Backend)'; // Generic status
                showSection('dashboard-section'); // Show dashboard on load
                
                // Initial renders
                renderCatalog();
                renderUserManagement();
                renderIssuedBooks();
                renderHistoryLog();
                renderDashboard();
                populateNewUserClassDropdown(); // Populate dropdown for adding new users
                renderLibrarianManagement(); // Render librarian list
                populateLibrarianDropdownForIssue(); // Populate librarian dropdown in issue section

            } catch (error) {
                console.error("Error initializing application:", error);
                showMessage("Failed to initialize the application. Please try again.", "error");
            } finally {
                hideLoading();
            }
        }

        // --- User Management (Add/Edit/Delete User) Handlers ---
        async function handleAddOrUpdateUser(userId, name, userClass) {
            showLoading();
            try {
                // Simulate async operation
                await new Promise(resolve => setTimeout(resolve, 300));

                let finalUserId = userId.trim();
                if (!finalUserId && !editingUserId) { // Only auto-generate if adding new user and ID is empty
                    finalUserId = 'user-' + Date.now();
                }

                if (editingUserId) {
                    // Update existing user
                    const userIndex = users.findIndex(user => user.id === editingUserId);
                    if (userIndex !== -1) {
                        users[userIndex] = { ...users[userIndex], name, userClass };
                        showMessage('User updated successfully!');
                    } else {
                        showMessage('Error: User not found for update.', 'error');
                    }
                    editingUserId = null; // Exit edit mode
                } else {
                    // Add new user
                    if (users.some(user => user.id === finalUserId)) {
                        showMessage('User ID already exists. Please choose a different one or leave it empty for auto-generation.', 'error');
                        hideLoading();
                        return;
                    }

                    const newUser = {
                        id: finalUserId,
                        name: name,
                        userClass: userClass,
                    };
                    users.push(newUser);
                    showMessage('User registered successfully!');
                }
                
                addUserForm.reset();
                resetUserFormForAdd(); // Reset form to 'Add New User' state
                renderUserManagement(); // Re-render user list
                renderDashboard(); // Update dashboard counts
            } catch (error) {
                console.error("Error adding/updating user:", error);
                showMessage('Failed to save user. Please try again.', 'error');
            } finally {
                hideLoading();
            }
        }

        async function handleEditUser(userId) {
            const userToEdit = users.find(user => user.id === userId);
            if (userToEdit) {
                editingUserId = userId; // Set edit mode
                newUserIdInput.value = userToEdit.id;
                newUserNameInput.value = userToEdit.name;
                newUserClassSelect.value = userToEdit.userClass;

                // Disable User ID field when editing
                newUserIdInput.disabled = true;
                
                userFormTitle.textContent = 'Edit User';
                userFormSubmitBtn.textContent = 'Update User';
                cancelUserEditBtn.classList.remove('hidden');
            } else {
                showMessage('User not found for editing.', 'error');
            }
        }

        function resetUserFormForAdd() {
            editingUserId = null;
            addUserForm.reset();
            newUserIdInput.disabled = false; // Enable User ID field
            newUserNameInput.disabled = false;
            newUserClassSelect.disabled = false;
            userFormTitle.textContent = 'Add New User';
            userFormSubmitBtn.textContent = 'Add User';
            cancelUserEditBtn.classList.add('hidden');
        }

        async function handleRemoveUser(userId, userName) {
            console.log(`Attempting to remove user: ID=${userId}, Name=${userName}`); // Debugging log

            showConfirmationModal(`Delete User`, `Are you sure you want to remove user "${userName}"? This action cannot be undone.`, async (confirmed) => {
                if (!confirmed) {
                    console.log('User deletion cancelled by user.');
                    return;
                }

                showLoading();
                try {
                    // Simulate async operation
                    await new Promise(resolve => setTimeout(resolve, 300));

                    // Check if the user has any issued books
                    const issuedCount = issuedBooks.filter(issued => issued.userId === userId).length;
                    if (issuedCount > 0) {
                        showMessage('Cannot remove user. User has outstanding issued books. Please return them first.', 'error');
                        hideLoading();
                        return;
                    }

                    users = users.filter(user => user.id !== userId);
                    
                    showMessage(`User "${userName}" removed successfully!`);
                    renderUserManagement(); // Re-render user list
                    renderDashboard(); // Update dashboard counts
                    resetIssueUserSelection(); // Clear selected user in issue section if removed user was selected
                } catch (error) {
                    console.error("Error removing user:", error);
                    showMessage('Failed to remove user. Please try again.', 'error');
                } finally {
                    hideLoading();
                }
            });
        }

        // --- Book Management (Add/Edit/Delete Book) Handlers ---
        async function handleAddOrUpdateBook(bookData) {
            showLoading();
            try {
                // Simulate async operation
                await new Promise(resolve => setTimeout(resolve, 300));

                if (editingBookId) {
                    // Update existing book
                    const bookIndex = myLibrary.findIndex(book => book.id === editingBookId);
                    if (bookIndex !== -1) {
                        // Preserve original totalCopies and calculate new availableCopies based on current issued
                        const currentIssuedCopies = issuedBooks.filter(item => item.bookId === editingBookId).length;
                        const newAvailableCopies = bookData.totalCopies - currentIssuedCopies;
                        if (newAvailableCopies < 0) {
                             showMessage(`Cannot reduce total copies below currently issued copies (${currentIssuedCopies}).`, 'error');
                             hideLoading();
                             return;
                        }

                        myLibrary[bookIndex] = { 
                            ...myLibrary[bookIndex], 
                            ...bookData,
                            availableCopies: newAvailableCopies // Update available copies based on new total and existing issued
                        };
                        showMessage('Book updated successfully!');
                    } else {
                        showMessage('Error: Book not found for update.', 'error');
                    }
                    editingBookId = null; // Exit edit mode
                } else {
                    // Add new book
                    // Check if book with same ISBN or Catalog Number already exists
                    const existingISBN = myLibrary.find(book => book.isbn === bookData.isbn);
                    const existingCatalogNumber = myLibrary.find(book => book.catalogNumber === bookData.catalogNumber);

                    if (existingISBN) {
                        showMessage('A book with this ISBN already exists.', 'error');
                        hideLoading();
                        return;
                    }
                    if (existingCatalogNumber) {
                        showMessage('A book with this Catalog Number already exists.', 'error');
                        hideLoading();
                        return;
                    }

                    const newBook = {
                        id: 'book-' + Date.now(), // Unique ID for local storage
                        ...bookData,
                        availableCopies: bookData.totalCopies // Initial available copies
                    };
                    myLibrary.push(newBook);
                    showMessage('Book added successfully!');
                }
                
                bookForm.reset();
                resetBookFormForAdd(); // Reset form to 'Add New Book' state
                renderCatalog(); // Re-render book list
                renderDashboard(); // Update dashboard counts
            }
            catch (error) {
                console.error("Error adding/updating book:", error);
                showMessage('Failed to save book. Please try again.', 'error');
            } finally {
                hideLoading();
            }
        }

        async function handleEditBook(bookId) {
            const bookToEdit = myLibrary.find(book => book.id === bookId);
            if (bookToEdit) {
                editingBookId = bookId; // Set edit mode
                document.getElementById('title').value = bookToEdit.title;
                document.getElementById('author').value = bookToEdit.author;
                document.getElementById('isbn').value = bookToEdit.isbn;
                document.getElementById('catalogNumber').value = bookToEdit.catalogNumber;
                document.getElementById('publishingDate').value = bookToEdit.publishingDate;
                document.getElementById('category').value = bookToEdit.category;
                document.getElementById('totalCopies').value = bookToEdit.totalCopies;
                document.getElementById('read').checked = bookToEdit.read;

                // Disable ISBN and Catalog Number fields when editing to prevent changing unique identifiers
                document.getElementById('isbn').disabled = true;
                document.getElementById('catalogNumber').disabled = true;
                
                bookFormTitle.textContent = 'Edit Book';
                bookFormSubmitBtn.innerHTML = '<i class="fas fa-edit mr-3"></i> Update Book';
                cancelBookEditBtn.classList.remove('hidden');
            } else {
                showMessage('Book not found for editing.', 'error');
            }
        }

        function resetBookFormForAdd() {
            editingBookId = null;
            bookForm.reset();
            document.getElementById('isbn').disabled = false; // Enable fields
            document.getElementById('catalogNumber').disabled = false;
            bookFormTitle.textContent = 'Add New Book';
            bookFormSubmitBtn.innerHTML = '<i class="fas fa-plus-circle mr-3"></i> Add Book';
            cancelBookEditBtn.classList.add('hidden');
        }

        async function handleDeleteBook(bookId, bookTitle) {
            showConfirmationModal(`Delete Book`, `Are you sure you want to delete "${bookTitle}" from the catalog? This cannot be undone.`, async (confirmed) => {
                if (!confirmed) {
                    console.log('Book deletion cancelled by user.');
                    return;
                }

                showLoading();
                try {
                    // Simulate async operation
                    await new Promise(resolve => setTimeout(resolve, 300));

                    // Check if there are any issued copies of this book
                    const issuedCopies = issuedBooks.filter(issued => issued.bookId === bookId).length;
                    if (issuedCopies > 0) {
                        showMessage('Cannot delete book. There are currently issued copies of this book. Please return them first.', 'error');
                        hideLoading();
                        return;
                    }

                    myLibrary = myLibrary.filter(book => book.id !== bookId);
                    
                    showMessage(`"${bookTitle}" deleted successfully!`);
                    renderCatalog(); // Re-render book list
                    renderDashboard(); // Update dashboard counts
                } catch (error) {
                    console.error("Error deleting book:", error);
                    showMessage('Failed to delete book. Please try again.', 'error');
                } finally {
                    hideLoading();
                }
            });
        }

        // --- Issue/Return Handlers ---
        async function handleIssueBook() {
            showLoading();
            try {
                // Simulate async operation
                await new Promise(resolve => setTimeout(resolve, 300));

                if (!selectedBookForIssue) {
                    showMessage('Please select a book to issue.', 'error');
                    hideLoading();
                    return;
                }
                if (!selectedUserForIssue) {
                    showMessage('Please select a user to issue the book to.', 'error');
                    hideLoading();
                    return;
                }
                if (!selectedLibrarianForIssue) { // New validation for librarian
                    showMessage('Please select a librarian to record the issue.', 'error');
                    hideLoading();
                    return;
                }

                if (selectedBookForIssue.availableCopies <= 0) {
                    showMessage('No available copies of this book to issue.', 'error');
                    hideLoading();
                    return;
                }

                const issueDate = new Date();
                const dueDate = new Date();
                dueDate.setDate(issueDate.getDate() + 14); // Set due date 14 days from issue date

                // Create an issued record
                const newIssuedBook = {
                    id: 'issued-' + Date.now(), // Unique ID for local storage
                    bookId: selectedBookForIssue.id,
                    bookTitle: selectedBookForIssue.title,
                    bookAuthor: selectedBookForIssue.author,
                    bookISBN: selectedBookForIssue.isbn,
                    bookCatalogNumber: selectedBookForIssue.catalogNumber,
                    userId: selectedUserForIssue.id, // Use local user ID
                    userName: selectedUserForIssue.name,
                    issueDate: issueDate.toISOString(),
                    dueDate: dueDate.toISOString(), // Store due date
                    librarianId: selectedLibrarianForIssue.id, // New: Store librarian ID
                    librarianName: selectedLibrarianForIssue.name // New: Store librarian name
                };
                issuedBooks.push(newIssuedBook);

                // Decrement availableCopies in the local myLibrary array
                const bookIndex = myLibrary.findIndex(book => book.id === selectedBookForIssue.id);
                if (bookIndex !== -1) {
                    myLibrary[bookIndex].totalCopies--; // Decrement totalCopies to reflect availability
                    myLibrary[bookIndex].availableCopies--; // Also decrement availableCopies
                }

                // Add to history log
                historyLog.push({
                    id: 'history-' + Date.now(),
                    type: 'issue',
                    bookId: selectedBookForIssue.id,
                    bookTitle: selectedBookForIssue.title,
                    bookAuthor: selectedBookForIssue.author,
                    userId: selectedUserForIssue.id,
                    userName: selectedUserForIssue.name,
                    timestamp: new Date().toISOString(), // This is the transaction timestamp
                    issueDate: newIssuedBook.issueDate, // Add issue date to history log
                    dueDate: newIssuedBook.dueDate,     // Add due date to history log
                    librarianId: newIssuedBook.librarianId, // New: Add librarian ID to history
                    librarianName: newIssuedBook.librarianName, // New: Add librarian name to history
                    issuedBookDocId: newIssuedBook.id // Link to the issued book record
                });

                showMessage(`"${selectedBookForIssue.title}" issued to "${selectedUserForIssue.name}" by ${selectedLibrarianForIssue.name} successfully!`);
                resetIssueForm();
                renderCatalog(); // Re-render catalog to show updated available copies
                renderIssuedBooks(); // Re-render issued books list
                renderHistoryLog(); // Re-render history log
                renderDashboard(); // Update dashboard counts
            } catch (error) {
                console.error("Error issuing book:", error);
                showMessage('Failed to issue book. Please try again.', 'error');
            } finally {
                hideLoading();
            }
        }

        async function handleReturnBook(issuedBookId, bookId, bookTitle, userName) {
            showConfirmationModal(`Return Book`, `Are you sure you want to return "${bookTitle}" from "${userName}"?`, async (confirmed) => {
                if (!confirmed) {
                    console.log('Book return cancelled by user.');
                    return;
                }

                showLoading();
                try {
                    // Simulate async operation
                    await new Promise(resolve => setTimeout(resolve, 300));

                    // Find the issued book record to get its issueDate, dueDate, and librarian info
                    const returnedIssuedBook = issuedBooks.find(issued => issued.id === issuedBookId);
                    let originalIssueDate = 'N/A';
                    let originalDueDate = 'N/A';
                    let librarianIdOnIssue = 'unknown';
                    let librarianNameOnIssue = 'Unknown Librarian';

                    if (returnedIssuedBook) {
                        originalIssueDate = returnedIssuedBook.issueDate;
                        originalDueDate = returnedIssuedBook.dueDate;
                        librarianIdOnIssue = returnedIssuedBook.librarianId || 'unknown';
                        librarianNameOnIssue = returnedIssuedBook.librarianName || 'Unknown Librarian';
                    }

                    // Remove the issued record
                    issuedBooks = issuedBooks.filter(issued => issued.id !== issuedBookId);

                    // Increment availableCopies in the local myLibrary array
                    const bookIndex = myLibrary.findIndex(book => book.id === bookId);
                    if (bookIndex !== -1) {
                        myLibrary[bookIndex].totalCopies++; // Increment totalCopies to reflect return
                        myLibrary[bookIndex].availableCopies++; // Also increment availableCopies
                    } else {
                        console.warn(`Book with ID ${bookId} not found in local library array. Cannot update totalCopies.`);
                        showMessage('Book not found in catalog for updating copies. Data might be inconsistent.', 'warning');
                    }

                    // Add to history log
                    historyLog.push({
                        id: 'history-' + Date.now(),
                        type: 'return',
                        bookId: bookId,
                        bookTitle: bookTitle,
                        userId: returnedIssuedBook ? returnedIssuedBook.userId : 'unknown', // Use userId from the found record
                        userName: userName,
                        timestamp: new Date().toISOString(),
                        issueDate: originalIssueDate, // Add original issue date to history log
                        dueDate: originalDueDate,     // Add original due date to history log
                        librarianId: librarianIdOnIssue, // Add librarian ID from issue to history
                        librarianName: librarianNameOnIssue, // Add librarian name from issue to history
                        issuedBookDocId: issuedBookId // Link to the original issued book record
                    });

                    showMessage(`"${bookTitle}" returned by "${userName}" successfully!`);
                    renderCatalog(); // Re-render catalog to show updated available copies
                    renderIssuedBooks(); // Re-render issued books list
                    renderHistoryLog(); // Re-render history log
                    renderDashboard(); // Update dashboard counts
                } catch (error) {
                    console.error("Error returning book:", error);
                    showMessage('Failed to return book. Please try again.', 'error');
                } finally {
                    hideLoading();
                }
            });
        }

        // --- Rendering Functions ---

        function renderCatalog() {
            bookListDiv.innerHTML = ''; // Clear previous entries
            if (myLibrary.length === 0) {
                noBooksMessage.classList.remove('hidden');
            } else {
                noBooksMessage.classList.add('hidden');
                myLibrary.forEach(book => {
                    const bookCard = `
                        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-300">
                            <h3 class="text-xl font-semibold text-gray-800 mb-2">${book.title}</h3>
                            <p class="text-gray-700 mb-1"><strong>Author:</strong> ${book.author}</p>
                            <p class="text-gray-700 mb-1"><strong>ISBN:</strong> ${book.isbn}</p>
                            <p class="text-gray-700 mb-1"><strong>Catalog No.:</strong> ${book.catalogNumber}</p>
                            <p class="text-gray-700 mb-1"><strong>Category:</strong> ${book.category}</p>
                            <p class="text-gray-700 mb-1"><strong>Published:</strong> ${new Date(book.publishingDate).toLocaleDateString()}</p>
                            <p class="text-gray-800 font-bold mt-2">Available Copies: <span class="${book.availableCopies <= 0 ? 'text-red-600' : 'text-green-600'}">${book.availableCopies}</span> / ${book.totalCopies}</p>
                            <div class="mt-4 flex justify-end space-x-2">
                                <button class="edit-book-btn bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out"
                                        data-book-id="${book.id}">
                                    <i class="fas fa-edit"></i> <span class="sr-only">Edit</span>
                                </button>
                                <button class="delete-book-btn bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out"
                                        data-book-id="${book.id}" data-book-title="${book.title}">
                                    <i class="fas fa-trash-alt"></i> <span class="sr-only">Delete</span>
                                </button>
                            </div>
                        </div>
                    `;
                    bookListDiv.insertAdjacentHTML('beforeend', bookCard);
                });

                // Attach event listeners to edit and delete buttons
                bookListDiv.querySelectorAll('.edit-book-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const bookId = event.target.dataset.bookId || event.target.closest('button').dataset.bookId;
                        handleEditBook(bookId);
                    });
                });
                bookListDiv.querySelectorAll('.delete-book-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const bookId = event.target.dataset.bookId || event.target.closest('button').dataset.bookId;
                        const bookTitle = event.target.dataset.bookTitle || event.target.closest('button').dataset.bookTitle;
                        handleDeleteBook(bookId, bookTitle);
                    });
                });
            }
        }

        function renderIssuedBooks() {
            issuedBooksListDiv.innerHTML = ''; // Clear previous entries
            if (issuedBooks.length === 0) {
                noIssuedBooksMessage.classList.remove('hidden');
            } else {
                noIssuedBooksMessage.classList.add('hidden');
                issuedBooks.forEach(issued => {
                    const issueDate = new Date(issued.issueDate).toLocaleDateString();
                    const dueDate = new Date(issued.dueDate).toLocaleDateString();
                    const issuedCard = `
                        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-300">
                            <h3 class="text-xl font-semibold text-gray-800 mb-2">${issued.bookTitle}</h3>
                            <p class="text-gray-700 mb-1"><strong>Issued to:</strong> ${issued.userName}</p>
                            <p class="text-gray-700 mb-1"><strong>Catalog No.:</strong> ${issued.bookCatalogNumber}</p>
                            <p class="text-gray-700 mb-1"><strong>Issue Date:</strong> ${issueDate}</p>
                            <p class="text-gray-700 mb-1"><strong>Due Date:</strong> ${dueDate}</p>
                            <div class="mt-4 flex justify-end">
                                <button class="return-book-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out"
                                        data-issued-book-id="${issued.id}"
                                        data-book-id="${issued.bookId}"
                                        data-book-title="${issued.bookTitle}"
                                        data-user-name="${issued.userName}">
                                    <i class="fas fa-undo-alt mr-2"></i> Return Book
                                </button>
                            </div>
                        </div>
                    `;
                    issuedBooksListDiv.insertAdjacentHTML('beforeend', issuedCard);
                });

                // Attach event listeners to return buttons
                issuedBooksListDiv.querySelectorAll('.return-book-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const issuedBookId = event.target.dataset.issuedBookId || event.target.closest('button').dataset.issuedBookId;
                        const bookId = event.target.dataset.bookId || event.target.closest('button').dataset.bookId;
                        const bookTitle = event.target.dataset.bookTitle || event.target.closest('button').dataset.bookTitle;
                        const userName = event.target.dataset.userName || event.target.closest('button').dataset.userName;
                        handleReturnBook(issuedBookId, bookId, bookTitle, userName);
                    });
                });
            }
        }

        function renderHistoryLog() {
            historyTableBody.innerHTML = ''; // Clear previous entries
            if (historyLog.length === 0) {
                noHistoryMessage.classList.remove('hidden');
            } else {
                noHistoryMessage.classList.add('hidden');
                historyLog.forEach(log => {
                    const issueDateFormatted = log.issueDate ? new Date(log.issueDate).toLocaleDateString() : 'N/A';
                    // For return type, the return date is the 'timestamp' of the log entry.
                    // For issue type, there's no return date yet, so it's 'N/A'.
                    const returnDateFormatted = log.type === 'return' ? new Date(log.timestamp).toLocaleDateString() : 'N/A';
                    const librarianName = log.librarianName || 'N/A'; // Get librarian name

                    const row = `
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-2 border-b border-gray-200 text-sm text-gray-800">${log.bookTitle}</td>
                            <td class="px-4 py-2 border-b border-gray-200 text-sm text-gray-800">${log.userName}</td>
                            <td class="px-4 py-2 border-b border-gray-200 text-sm text-gray-800">${issueDateFormatted}</td>
                            <td class="px-4 py-2 border-b border-gray-200 text-sm text-gray-800">${returnDateFormatted}</td>
                            <td class="px-4 py-2 border-b border-gray-200 text-sm text-gray-800">${librarianName}</td>
                        </tr>
                    `;
                    historyTableBody.insertAdjacentHTML('beforeend', row);
                });
            }
        }

        function renderUserManagement() {
            userListDiv.innerHTML = ''; // Clear previous entries
            
            // Group users by class
            const usersByClass = {};
            for (let i = 1; i <= 6; i++) {
                usersByClass[i] = [];
            }
            users.forEach(user => {
                if (user.userClass >= 1 && user.userClass <= 6) {
                    usersByClass[user.userClass].push(user);
                }
            });

            let allClassesEmpty = true;
            for (let i = 1; i <= 6; i++) {
                if (usersByClass[i].length > 0) {
                    allClassesEmpty = false;
                    break;
                }
            }

            if (users.length === 0 || allClassesEmpty) {
                noUsersMessage.classList.remove('hidden');
            } else {
                noUsersMessage.classList.add('hidden');
                
                // Create columns for each class
                for (let i = 1; i <= 6; i++) {
                    const classColumn = document.createElement('div');
                    classColumn.className = 'flex flex-col bg-gray-200 p-4 rounded-lg shadow-sm border border-gray-300';
                    classColumn.innerHTML = `<h4 class="text-lg font-bold text-gray-800 mb-4 text-center">Class ${i}</h4>`;
                    
                    if (usersByClass[i].length === 0) {
                        classColumn.innerHTML += `<p class="text-center text-gray-500 text-sm">No users in this class.</p>`;
                    } else {
                        usersByClass[i].forEach(user => {
                            const userCard = `
                                <div class="bg-white p-4 rounded-lg shadow-md border border-gray-300 mb-3 last:mb-0">
                                    <h5 class="text-md font-semibold text-gray-800 mb-1">${user.name}</h5>
                                    <p class="text-gray-700 text-sm"><strong>User ID:</strong> ${user.id}</p>
                                    <div class="mt-3 flex justify-end space-x-2">
                                        <button class="edit-user-btn bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded-md text-sm transition duration-150 ease-in-out"
                                                data-user-id="${user.id}">
                                            <i class="fas fa-edit"></i> <span class="sr-only">Edit</span>
                                        </button>
                                        <button class="remove-user-btn bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition duration-150 ease-in-out"
                                                data-user-id="${user.id}" data-user-name="${user.name}">
                                            <i class="fas fa-trash-alt"></i> <span class="sr-only">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            `;
                            classColumn.insertAdjacentHTML('beforeend', userCard);
                        });
                    }
                    userListDiv.appendChild(classColumn);
                }

                // Attach event listeners to edit and delete user buttons
                userListDiv.querySelectorAll('.edit-user-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const userId = event.target.dataset.userId || event.target.closest('button').dataset.userId;
                        handleEditUser(userId);
                    });
                });
                userListDiv.querySelectorAll('.remove-user-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const userId = event.target.dataset.userId || event.target.closest('button').dataset.userId;
                        const userName = event.target.dataset.userName || event.target.closest('button').dataset.userName;
                        handleRemoveUser(userId, userName);
                    });
                });
            }
        }

        // --- Librarian Management Handlers and Renderers ---
        async function handleAddOrUpdateLibrarian(librarianId, name) {
            showLoading();
            try {
                await new Promise(resolve => setTimeout(resolve, 300));

                let finalLibrarianId = librarianId.trim();
                if (!finalLibrarianId && !editingLibrarianId) {
                    finalLibrarianId = 'lib-' + Date.now();
                }

                if (editingLibrarianId) {
                    const libIndex = librarians.findIndex(lib => lib.id === editingLibrarianId);
                    if (libIndex !== -1) {
                        librarians[libIndex] = { ...librarians[libIndex], name };
                        showMessage('Librarian updated successfully!', 'success');
                    } else {
                        showMessage('Error: Librarian not found for update.', 'error');
                    }
                    editingLibrarianId = null;
                } else {
                    if (librarians.some(lib => lib.id === finalLibrarianId)) {
                        showMessage('Librarian ID already exists. Please choose a different one or leave it empty for auto-generation.', 'error');
                        hideLoading();
                        return;
                    }
                    const newLibrarian = {
                        id: finalLibrarianId,
                        name: name,
                    };
                    librarians.push(newLibrarian);
                    showMessage('Librarian added successfully!', 'success');
                }
                addLibrarianForm.reset();
                resetLibrarianFormForAdd();
                renderLibrarianManagement();
                populateLibrarianDropdownForIssue(); // Update dropdown in issue section
                renderDashboard(); // Update dashboard counts
            } catch (error) {
                console.error("Error adding/updating librarian:", error);
                showMessage('Failed to save librarian. Please try again.', 'error');
            } finally {
                hideLoading();
            }
        }

        async function handleEditLibrarian(librarianId) {
            const librarianToEdit = librarians.find(lib => lib.id === librarianId);
            if (librarianToEdit) {
                editingLibrarianId = librarianId;
                newLibrarianIdInput.value = librarianToEdit.id;
                newLibrarianNameInput.value = librarianToEdit.name;

                newLibrarianIdInput.disabled = true; // Disable ID when editing

                librarianFormTitle.textContent = 'Edit Librarian';
                librarianFormSubmitBtn.innerHTML = '<i class="fas fa-edit mr-3"></i> Update Librarian';
                cancelLibrarianEditBtn.classList.remove('hidden');
            } else {
                showMessage('Librarian not found for editing.', 'error');
            }
        }

        function resetLibrarianFormForAdd() {
            editingLibrarianId = null;
            addLibrarianForm.reset();
            newLibrarianIdInput.disabled = false; // Enable ID field
            librarianFormTitle.textContent = 'Add New Librarian';
            librarianFormSubmitBtn.innerHTML = '<i class="fas fa-user-plus mr-3"></i> Add Librarian';
            cancelLibrarianEditBtn.classList.add('hidden');
        }

        async function handleRemoveLibrarian(librarianId, librarianName) {
            showConfirmationModal(`Delete Librarian`, `Are you sure you want to remove librarian "${librarianName}"? This action cannot be undone.`, async (confirmed) => {
                if (!confirmed) {
                    console.log('Librarian deletion cancelled by user.');
                    return;
                }

                showLoading();
                try {
                    await new Promise(resolve => setTimeout(resolve, 300));
                    librarians = librarians.filter(lib => lib.id !== librarianId);
                    showMessage(`Librarian "${librarianName}" removed successfully!`, 'success');
                    renderLibrarianManagement();
                    populateLibrarianDropdownForIssue(); // Update dropdown in issue section
                    renderDashboard(); // Update dashboard counts
                } catch (error) {
                    console.error("Error removing librarian:", error);
                    showMessage('Failed to remove librarian. Please try again.', 'error');
                } finally {
                    hideLoading();
                }
            });
        }

        function renderLibrarianManagement() {
            librarianListDiv.innerHTML = '';
            if (librarians.length === 0) {
                noLibrariansMessage.classList.remove('hidden');
            } else {
                noLibrariansMessage.classList.add('hidden');
                librarians.forEach(librarian => {
                    const librarianCard = `
                        <div class="bg-white p-4 rounded-lg shadow-md border border-gray-300 mb-3 last:mb-0">
                            <h5 class="text-md font-semibold text-gray-800 mb-1">${librarian.name}</h5>
                            <p class="text-gray-700 text-sm"><strong>Librarian ID:</strong> ${librarian.id}</p>
                            <div class="mt-3 flex justify-end space-x-2">
                                <button class="edit-librarian-btn bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded-md text-sm transition duration-150 ease-in-out"
                                        data-librarian-id="${librarian.id}">
                                    <i class="fas fa-edit"></i> <span class="sr-only">Edit</span>
                                </button>
                                <button class="remove-librarian-btn bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition duration-150 ease-in-out"
                                        data-librarian-id="${librarian.id}" data-librarian-name="${librarian.name}">
                                    <i class="fas fa-trash-alt"></i> <span class="sr-only">Delete</span>
                                </button>
                            </div>
                        </div>
                    `;
                    librarianListDiv.insertAdjacentHTML('beforeend', librarianCard);
                });

                librarianListDiv.querySelectorAll('.edit-librarian-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const librarianId = event.target.dataset.librarianId || event.target.closest('button').dataset.librarianId;
                        handleEditLibrarian(librarianId);
                    });
                });
                librarianListDiv.querySelectorAll('.remove-librarian-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const librarianId = event.target.dataset.librarianId || event.target.closest('button').dataset.librarianId;
                        const librarianName = event.target.dataset.librarianName || event.target.closest('button').dataset.librarianName;
                        handleRemoveLibrarian(librarianId, librarianName);
                    });
                });
            }
        }

        function renderDashboard() {
            totalBooksCount.textContent = myLibrary.length;
            issuedBooksCount.textContent = issuedBooks.length;
            totalUsersCount.textContent = users.length;
            totalLibrariansCount.textContent = librarians.length; // Update librarian count
        }

        // --- Dropdown Population ---
        function populateNewUserClassDropdown() {
            newUserClassSelect.innerHTML = '<option value="">-- Select Class --</option>';
            for (let i = 1; i <= 6; i++) { // Changed loop limit from 10 to 6
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `Class ${i}`;
                newUserClassSelect.appendChild(option);
            }
        }

        function populateLibrarianDropdownForIssue() {
            issueLibrarianSelect.innerHTML = '<option value="">-- Select Librarian --</option>';
            librarians.forEach(librarian => {
                const option = document.createElement('option');
                option.value = librarian.id;
                option.textContent = librarian.name;
                issueLibrarianSelect.appendChild(option);
            });
            // Reset selected librarian if the current one is no longer in the list
            if (selectedLibrarianForIssue && !librarians.some(lib => lib.id === selectedLibrarianForIssue.id)) {
                selectedLibrarianForIssue = null;
                issueLibrarianSelect.value = '';
            }
        }

        // --- UI State Management ---
        function showSection(sectionId) {
            sections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');

            navLinks.forEach(link => {
                link.classList.remove('bg-gray-700', 'text-white'); /* Changed from indigo-200, text-indigo-800 */
                link.classList.add('text-gray-300', 'hover:bg-gray-700', 'hover:text-white'); /* Changed from text-gray-700 */
                if (link.dataset.section === sectionId) {
                    link.classList.add('bg-gray-700', 'text-white'); /* Changed from indigo-200, text-indigo-800 */
                    link.classList.remove('text-gray-300', 'hover:bg-gray-700', 'hover:text-white'); /* Changed from text-gray-700 */
                }
            });
        }

        function updateIssueButtonState() {
            if (selectedBookForIssue && selectedUserForIssue && selectedLibrarianForIssue && selectedBookForIssue.availableCopies > 0) {
                issueBookSubmitBtn.disabled = false;
            } else {
                issueBookSubmitBtn.disabled = true;
            }
        }

        function resetIssueForm() {
            catalogNumberSearchInput.value = '';
            issueUserIdSearchInput.value = ''; // Clear the user ID search input
            issueLibrarianSelect.value = ''; // Clear librarian selection
            selectedBookForIssue = null;
            selectedUserForIssue = null;
            selectedLibrarianForIssue = null;
            selectedBookDisplay.classList.add('hidden');
            selectedUserDisplay.classList.add('hidden');
            updateIssueButtonState();
        }

        function resetIssueUserSelection() {
            issueUserIdSearchInput.value = '';
            selectedUserForIssue = null;
            selectedUserDisplay.classList.add('hidden');
            updateIssueButtonState();
        }


        // --- Event Listeners ---
        document.addEventListener('DOMContentLoaded', () => {
            initializeApp(); // Call local initializer
            
            // Navigation
            navLinks.forEach(link => {
                link.addEventListener('click', (event) => {
                    showSection(event.target.dataset.section);
                });
            });

            // Confirmation Modal Buttons
            confirmYesBtn.addEventListener('click', () => {
                if (confirmationCallback) {
                    confirmationCallback(true);
                }
                hideConfirmationModal();
            });

            confirmNoBtn.addEventListener('click', () => {
                if (confirmationCallback) {
                    confirmationCallback(false);
                }
                hideConfirmationModal();
            });

            // Add/Update Book Form Submission
            bookForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const bookData = {
                    title: document.getElementById('title').value,
                    author: document.getElementById('author').value,
                    isbn: document.getElementById('isbn').value,
                    catalogNumber: document.getElementById('catalogNumber').value,
                    publishingDate: document.getElementById('publishingDate').value,
                    category: document.getElementById('category').value,
                    totalCopies: parseInt(document.getElementById('totalCopies').value, 10),
                    read: document.getElementById('read').checked,
                };
                handleAddOrUpdateBook(bookData);
            });

            // Cancel Book Edit
            cancelBookEditBtn.addEventListener('click', resetBookFormForAdd);


            // Add/Update User Form Submission
            addUserForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const userId = newUserIdInput.value.trim();
                const name = newUserNameInput.value.trim();
                const userClass = parseInt(newUserClassSelect.value, 10);
                handleAddOrUpdateUser(userId, name, userClass);
            });

            // Cancel User Edit
            cancelUserEditBtn.addEventListener('click', resetUserFormForAdd);

            // Auto-populate user details when User ID is entered in Add User form
            newUserIdInput.addEventListener('input', () => {
                if (editingUserId) return; // Do not auto-populate if in edit mode

                const enteredUserId = newUserIdInput.value.trim();
                const foundUser = users.find(user => user.id === enteredUserId);

                if (foundUser) {
                    newUserNameInput.value = foundUser.name;
                    newUserClassSelect.value = foundUser.userClass;
                    // Disable fields if user found
                    newUserNameInput.disabled = true;
                    newUserClassSelect.disabled = true;
                    showMessage('User ID found. Editing existing user.', 'info');
                } else {
                    // Clear and enable fields if no user found or ID is cleared
                    newUserNameInput.value = '';
                    newUserClassSelect.value = '';
                    newUserNameInput.disabled = false;
                    newUserClassSelect.disabled = false;
                }
            });

            // Search Book in Issue Section - Auto-select on input
            catalogNumberSearchInput.addEventListener('input', () => {
                const catalogNum = catalogNumberSearchInput.value.trim();
                selectedBookForIssue = myLibrary.find(book => book.catalogNumber === catalogNum);

                if (selectedBookForIssue) {
                    selectedBookTitle.textContent = selectedBookForIssue.title;
                    selectedBookAuthor.textContent = selectedBookForIssue.author;
                    selectedBookISBN.textContent = selectedBookForIssue.isbn;
                    selectedBookCatalogNumber.textContent = selectedBookForIssue.catalogNumber;
                    selectedBookAvailableCopies.textContent = `${selectedBookForIssue.availableCopies} / ${selectedBookForIssue.totalCopies}`;
                    selectedBookDisplay.classList.remove('hidden');
                } else {
                    // Only show error if input is not empty, otherwise just hide display
                    if (catalogNum !== '') {
                        showMessage('Book not found with this catalog number.', 'error');
                    }
                    selectedBookDisplay.classList.add('hidden');
                    selectedBookForIssue = null;
                }
                updateIssueButtonState();
            });

            // Search Book in Issue Section - On button click (redundant but kept for explicit search)
            searchBookBtn.addEventListener('click', () => {
                const catalogNum = catalogNumberSearchInput.value.trim();
                if (catalogNum === '') {
                    showMessage('Please enter a catalog number to search.', 'error');
                    return;
                }
                // The input event listener already handles the search and display
                // This button click will just re-trigger the same logic
                catalogNumberSearchInput.dispatchEvent(new Event('input'));
            });


            // Search User in Issue Section - Auto-select on input
            issueUserIdSearchInput.addEventListener('input', () => {
                const userIdToSearch = issueUserIdSearchInput.value.trim();
                const foundUser = users.find(user => user.id === userIdToSearch);

                if (foundUser) {
                    selectedUserForIssue = foundUser;
                    selectedUserName.textContent = foundUser.name;
                    selectedUserClass.textContent = foundUser.userClass;
                    selectedUserDisplay.classList.remove('hidden');
                } else {
                    // Only show error if input is not empty, otherwise just hide display
                    if (userIdToSearch !== '') {
                        showMessage('User not found with this ID.', 'error');
                    }
                    selectedUserDisplay.classList.add('hidden');
                    selectedUserForIssue = null;
                }
                updateIssueButtonState();
            });

            // Search User in Issue Section - On button click (redundant but kept for explicit search)
            searchUserInIssueBtn.addEventListener('click', () => {
                const userIdToSearch = issueUserIdSearchInput.value.trim();
                if (userIdToSearch === '') {
                    showMessage('Please enter a User ID to search.', 'error');
                    return;
                }
                // The input event listener already handles the search and display
                // This button click will just re-trigger the same logic
                issueUserIdSearchInput.dispatchEvent(new Event('input'));
            });

            // New: Librarian selection in Issue Section
            issueLibrarianSelect.addEventListener('change', () => {
                const librarianId = issueLibrarianSelect.value;
                selectedLibrarianForIssue = librarians.find(lib => lib.id === librarianId);
                updateIssueButtonState();
            });


            // Issue Book Form Submission
            issueBookForm.addEventListener('submit', (event) => {
                event.preventDefault();
                handleIssueBook();
            });

            // Add/Update Librarian Form Submission
            addLibrarianForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const librarianId = newLibrarianIdInput.value.trim();
                const name = newLibrarianNameInput.value.trim();
                handleAddOrUpdateLibrarian(librarianId, name);
            });

            // Cancel Librarian Edit
            cancelLibrarianEditBtn.addEventListener('click', resetLibrarianFormForAdd);

            // Auto-populate librarian details when Librarian ID is entered in Add Librarian form
            newLibrarianIdInput.addEventListener('input', () => {
                if (editingLibrarianId) return; // Do not auto-populate if in edit mode

                const enteredLibrarianId = newLibrarianIdInput.value.trim();
                const foundLibrarian = librarians.find(lib => lib.id === enteredLibrarianId);

                if (foundLibrarian) {
                    newLibrarianNameInput.value = foundLibrarian.name;
                    newLibrarianNameInput.disabled = true;
                    showMessage('Librarian ID found. Editing existing librarian.', 'info');
                } else {
                    newLibrarianNameInput.value = '';
                    newLibrarianNameInput.disabled = false;
                }
            });
        });
        Tabletop.init({
    key: 'https://docs.google.com/spreadsheets/d/1lMVz2013u0BCGE1Yz0dfMmQWyQLEdgczeijrS_15N3w/pubhtml',
    callback: function(data) {
      const container = document.getElementById("book-list");
      data.forEach(book => {
        container.innerHTML += `
          <div style="margin-bottom: 20px; border-bottom: 1px solid gray;">
            <h3>${book.Title}</h3>
            <p><strong>Author:</strong> ${book.Author}</p>
            <p><strong>Category:</strong> ${book.Category}</p>
            <p><strong>Year:</strong> ${book.Year}</p>
            ${book.CoverImageURL ? `<img src="${book.CoverImageURL}" width="100">` : ''}
          </div>
        `;
      });
    },
    simpleSheet: true
  });
  
