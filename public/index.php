<?php
include 'books.php';

$search_results = $books;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $category = $_POST['category'];
    $subcategory = $_POST['subcategory'];
    $rating = $_POST['rating'];
    
    $search_results = array_filter($books, function($book) use ($category, $subcategory, $rating) {
        return ($category === '' || $book['category'] === $category) &&
               ($subcategory === '' || $book['subcategory'] === $subcategory) &&
               ($rating === '' || ($rating === '4-5' && $book['rating'] >= 4 && $book['rating'] <= 5) ||
                ($rating === '3-4' && $book['rating'] >= 3 && $book['rating'] < 4) ||
                ($rating === '0-1' && $book['rating'] >= 0 && $book['rating'] < 1));
    });
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Book List</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Book List</h1>
    <form method="post">
        <label for="category">Category:</label>
        <input type="text" id="category" name="category">
        
        <label for="subcategory">Subcategory:</label>
        <input type="text" id="subcategory" name="subcategory">

        <label for="rating">Rating:</label>
        <select id="rating" name="rating">
            <option value="">All</option>
            <option value="4-5">4-5</option>
            <option value="3-4">3-4</option>
            <option value="0-1">0-1</option>
        </select>
        
        <button type="submit">Search</button>
    </form>

    <table>
        <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Website Affiliation</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Submitter</th>
            <th>Rating</th>
            <th>Link</th>
        </tr>
        <?php foreach ($search_results as $book): ?>
            <tr>
                <td><?php echo htmlspecialchars($book['title']); ?></td>
                <td><?php echo htmlspecialchars($book['author']); ?></td>
                <td><?php echo htmlspecialchars($book['website_affiliation']); ?></td>
                <td><?php echo htmlspecialchars($book['category']); ?></td>
                <td><?php echo htmlspecialchars($book['subcategory']); ?></td>
                <td><?php echo htmlspecialchars($book['submitter']); ?></td>
                <td><?php echo htmlspecialchars($book['rating']); ?></td>
                <td><a href="<?php echo htmlspecialchars($book['link']); ?>">Link</a></td>
            </tr>
        <?php endforeach; ?>
    </table>
</body>
</html>
