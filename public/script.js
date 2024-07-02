let currentPage = 1;
const rowsPerPage = 20;
let filteredBooks = [];
let allBooks = [];
const books3FilePath = './txt/books3.txt';
const bookLinksFilePath = './txt/bookLinks.txt';
let bookLinks = {};

async function fetchTextFiles(filePaths) {
    const fetchPromises = filePaths.map(path => fetch(path).then(response => response.text()));
    return Promise.all(fetchPromises);
}

function parseTextFiles(contents, weights) {
    const bookMap = new Map();
    
    contents.forEach((content, index) => {
        const lines = content.split('\n');
        const weight = weights[index];
        lines.forEach(line => {
            const [name, author, year, category, subcategory, rating] = line.split(',');
            if (name && author && year && category && subcategory && rating) {
                const bookKey = name.toLowerCase(); // use lowercase for case-insensitive comparison
                const currentRating = parseFloat(rating);

                if (bookMap.has(bookKey)) {
                    const bookData = bookMap.get(bookKey);
                    bookData.totalWeight += weight;
                    bookData.weightedSum += currentRating * weight;
                } else {
                    bookMap.set(bookKey, {
                        name, author, year, category, subcategory,
                        totalWeight: weight,
                        weightedSum: currentRating * weight
                    });
                }
            }
        });
    });

    return Array.from(bookMap.values()).map(book => ({
        ...book,
        rating: (book.weightedSum / book.totalWeight).toFixed(2)
    }));
}

function populateTable(books) {
    const tbody = document.getElementById('bookTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedBooks = books.slice(start, end);

    paginatedBooks.forEach(book => {
        const tr = document.createElement('tr');
        const bookLink = bookLinks[book.name] || `https://www.yousuu.com/search/?search_type=title&search_value=${encodeURIComponent(book.name)}&from=search`;
        tr.innerHTML = `
            <td data-label="书名"><a href="${bookLink}" target="_blank">${book.name}</a></td>
            <td data-label="网站">${book.author}</td>
            <td data-label="提交者">${book.year}</td>
            <td data-label="类别">${book.category}</td>
            <td data-label="子类别">${book.subcategory}</td>
            <td data-label="评分">${book.rating}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = end >= books.length;
}

function filterTable() {
    const categoryFilter = document.getElementById('categoryFilter').value.toLowerCase();
    const subCategoryFilter = document.getElementById('subCategoryFilter').value.toLowerCase();
    const ratingFilter = document.getElementById('ratingFilter').value;
    const nameFilter = document.getElementById('nameFilter').value.toLowerCase();

    filteredBooks = allBooks.filter(book => {
        const matchCategory = !categoryFilter || book.category.toLowerCase().includes(categoryFilter);
        const matchSubCategory = !subCategoryFilter || book.subcategory.toLowerCase().includes(subCategoryFilter);
        const matchRating = !ratingFilter || parseFloat(book.rating) >= parseFloat(ratingFilter) - 1 && parseFloat(book.rating) < parseFloat(ratingFilter);
        const matchName = !nameFilter || book.name.toLowerCase().includes(nameFilter);

        return matchCategory && matchSubCategory && matchRating && matchName;
    });

    currentPage = 1;
    populateTable(filteredBooks);
}

function changePage(delta) {
    currentPage += delta;
    populateTable(filteredBooks);
}

function loadSubCategories() {
    const categoryFilter = document.getElementById('categoryFilter').value.toLowerCase();
    const subCategoryFilter = document.getElementById('subCategoryFilter');

    const uniqueSubCategories = new Set(allBooks.filter(book => book.category.toLowerCase().includes(categoryFilter)).map(book => book.subcategory));
    subCategoryFilter.innerHTML = '<option value="">所有子类别</option>';
    uniqueSubCategories.forEach(subCategory => {
        const option = document.createElement('option');
        option.value = subCategory;
        option.textContent = subCategory;
        subCategoryFilter.appendChild(option);
    });
}

async function init() {
    const [books3Content, bookLinksContent] = await fetchTextFiles([books3FilePath, bookLinksFilePath]);
    
    const weights = [0.8, 0.2];
    allBooks = parseTextFiles([books3Content, bookLinksContent], weights);

    bookLinksContent.split('\n').forEach(line => {
        const [name, link] = line.split(':');
        if (name && link) {
            bookLinks[name.trim()] = link.trim();
        }
    });

    filterTable();
}

init();

function switchTab(tabName) {
    const tabs = document.getElementsByClassName('tab');
    const tabContents = document.getElementsByClassName('tab-content');

    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
        tabContents[i].style.display = 'none';
    }

    document.querySelector(`.tab[onclick="switchTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName).style.display = 'block';
}
