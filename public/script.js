let currentPage = 1;
const rowsPerPage = 20;
let filteredBooks = [];
let allBooks = [];
const books3FilePath = './txt/books3.txt';
const bookLinksFilePath = './txt/bookLinks.txt';
let bookLinks = {};

const bookLinks = {};

async function loadBookLinks() {
    const response = await fetch('path/to/bookLinks.txt');
    const data = await response.text();
    const lines = data.split('\n');

    lines.forEach(line => {
        const [name, link] = line.split(',');
        if (name && link) {
            bookLinks[name.trim()] = link.trim();
        }
    });
}

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
    const categoryFilter = document.getElementById('categoryFilter').value;
    const subCategorySelect = document.getElementById('subCategoryFilter');

    subCategorySelect.innerHTML = '<option value="">所有子类别</option>';

    if (categoryFilter === "同人奇幻") {
        subCategorySelect.innerHTML += '<option value="中土世界">中土世界</option>';
        subCategorySelect.innerHTML += '<option value="权力游戏">权力游戏</option>';
        subCategorySelect.innerHTML += '<option value="魔兽争霸">魔兽争霸</option>';
        subCategorySelect.innerHTML += '<option value="同人种田">同人种田</option>';
        subCategorySelect.innerHTML += '<option value="第四天灾">第四天灾</option>';
        subCategorySelect.innerHTML += '<option value="奇幻种田">奇幻种田</option>';
    } else if (categoryFilter === "国内历史") {
        subCategorySelect.innerHTML += '<option value="上古历史">上古历史</option>';
        subCategorySelect.innerHTML += '<option value="先秦历史">先秦历史</option>';
        subCategorySelect.innerHTML += '<option value="秦汉三国">秦汉三国</option>';
        subCategorySelect.innerHTML += '<option value="魏晋南北">魏晋南北</option>';
        subCategorySelect.innerHTML += '<option value="隋唐五代">隋唐五代</option>';
        subCategorySelect.innerHTML += '<option value="宋元风月">宋元风月</option>';
        subCategorySelect.innerHTML += '<option value="大明王朝">大明王朝</option>';
        subCategorySelect.innerHTML += '<option value="清朝以后">清朝以后</option>';
    } else if (categoryFilter === "外国历史") {
        subCategorySelect.innerHTML += '<option value="罗马/西罗马帝国">罗马/西罗马帝国</option>';
        subCategorySelect.innerHTML += '<option value="东罗马">东罗马</option>';
        subCategorySelect.innerHTML += '<option value="奥地利帝国/奥匈帝国/哈布斯堡王朝">奥地利帝国/奥匈帝国/哈布斯堡王朝</option>';
        subCategorySelect.innerHTML += '<option value="北海帝国">北海帝国</option>';
        subCategorySelect.innerHTML += '<option value="希腊（近代以前）">希腊（近代以前）</option>';
        subCategorySelect.innerHTML += '<option value="葡萄牙">葡萄牙</option>';
        subCategorySelect.innerHTML += '<option value="西班牙">西班牙</option>';
        subCategorySelect.innerHTML += '<option value="法国">法国</option>';
        subCategorySelect.innerHTML += '<option value="游牧">游牧</option>';
        subCategorySelect.innerHTML += '<option value="玛雅">玛雅</option>';
        subCategorySelect.innerHTML += '<option value="美国">美国</option>';
        subCategorySelect.innerHTML += '<option value="低地">低地</option>';
        subCategorySelect.innerHTML += '<option value="斯堪纳">斯堪纳</option>';
        subCategorySelect.innerHTML += '<option value="意大利">意大利</option>';
        subCategorySelect.innerHTML += '<option value="苏联">苏联</option>';
        subCategorySelect.innerHTML += '<option value="波兰">波兰</option>';
        subCategorySelect.innerHTML += '<option value="爱尔兰">爱尔兰</option>';
        subCategorySelect.innerHTML += '<option value="乌克兰">乌克兰</option>';
        subCategorySelect.innerHTML += '<option value="匈牙利">匈牙利</option>';
        subCategorySelect.innerHTML += '<option value="条顿骑士团国">条顿骑士团国</option>';
        subCategorySelect.innerHTML += '<option value="冰岛">冰岛</option>';
        subCategorySelect.innerHTML += '<option value="巴尔干">巴尔干</option>';
        subCategorySelect.innerHTML += '<option value="教皇国">教皇国</option>';
        subCategorySelect.innerHTML += '<option value="两西西里">两西西里</option>';
        subCategorySelect.innerHTML += '<option value="捷克斯洛伐克">捷克斯洛伐克</option>';
        subCategorySelect.innerHTML += '<option value="越南">越南</option>';
        subCategorySelect.innerHTML += '<option value="耶路撒冷王国">耶路撒冷王国</option>';
        subCategorySelect.innerHTML += '<option value="伊拉克">伊拉克</option>';
        subCategorySelect.innerHTML += '<option value="波斯">波斯</option>';
        subCategorySelect.innerHTML += '<option value="巴基斯坦">巴基斯坦</option>';
        subCategorySelect.innerHTML += '<option value="奥斯曼帝国">奥斯曼帝国</option>';
        subCategorySelect.innerHTML += '<option value="古巴比伦">古巴比伦</option>';
        subCategorySelect.innerHTML += '<option value="泰国">泰国</option>';
        subCategorySelect.innerHTML += '<option value="缅甸">缅甸</option>';
        subCategorySelect.innerHTML += '<option value="柬埔寨">柬埔寨</option>';
        subCategorySelect.innerHTML += '<option value="英国">英国</option>';
        subCategorySelect.innerHTML += '<option value="朝鲜">朝鲜</option>';
        subCategorySelect.innerHTML += '<option value="以色列（现代）">以色列（现代）</option>';
        subCategorySelect.innerHTML += '<option value="德国">德国</option>';
        subCategorySelect.innerHTML += '<option value="澳大利亚">澳大利亚</option>';
        subCategorySelect.innerHTML += '<option value="埃及">埃及</option>';
        subCategorySelect.innerHTML += '<option value="利比亚">利比亚</option>';
        subCategorySelect.innerHTML += '<option value="莫桑比克">莫桑比克</option>';
        subCategorySelect.innerHTML += '<option value="迦太基">迦太基</option>';
        subCategorySelect.innerHTML += '<option value="埃塞俄比亚">埃塞俄比亚</option>';
        subCategorySelect.innerHTML += '<option value="苏丹">苏丹</option>';
        subCategorySelect.innerHTML += '<option value="南非">南非</option>';
        subCategorySelect.innerHTML += '<option value="多米尼加">多米尼加</option>';
        subCategorySelect.innerHTML += '<option value="大航海">大航海</option>';
        subCategorySelect.innerHTML += '<option value="南美">南美</option>';
        subCategorySelect.innerHTML += '<option value="巴西">巴西</option>';
        subCategorySelect.innerHTML += '<option value="墨西哥">墨西哥</option>';
        subCategorySelect.innerHTML += '<option value="日本">日本</option>';
    }

    filterTable();
}

function switchTab(tabName) {
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
tabs.forEach(tab => {
    if (tab.id === tabName) {
        tab.classList.add('active');
    } else {
        tab.classList.remove('active');
    }
});
    tabContents.forEach(content => {
    if (content.id === tabName) {
        content.style.display = 'block';
    } else {
        content.style.display = 'none';
    }
});
}
    

async function init() {
    const filePaths = ['./txt/books1.txt', './txt/books2.txt', books3FilePath];
    const [books1Content, books2Content, books3Content, bookLinksContent] = await fetchTextFiles([...filePaths, bookLinksFilePath]);

    const weights = [0.4, 0.2, 0.2];
    allBooks = parseTextFiles([books1Content, books2Content, books3Content], weights);

    bookLinksContent.split('\n').forEach(line => {
        const [name, link] = line.split(':');
        if (name && link) {
            bookLinks[name.trim()] = link.trim();
        }
    });

    filterTable();
}

init();

document.getElementById('categoryFilter').addEventListener('change', loadSubCategories);
document.getElementById('categoryFilter').addEventListener('change', filterTable);
document.getElementById('subCategoryFilter').addEventListener('change', filterTable);
document.getElementById('ratingFilter').addEventListener('change', filterTable);
document.getElementById('nameFilter').addEventListener('input', filterTable);
document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
document.getElementById('nextPage').addEventListener('click', () => changePage(1));
document.addEventListener('DOMContentLoaded', () => {
    loadBookLinks().then(() => {
        // 初始化表格或其他操作
    });
});
