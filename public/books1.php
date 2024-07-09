<?php
header('Content-Type: application/json');
echo json_encode([
    [
        "name" => "书籍A",
        "author" => "作者A",
        "year" => 2020,
        "category" => "同人奇幻",
        "subcategory" => "中土世界",
        "rating" => 4.5,
        "link" => "https://example.com/bookA"
    ],
    [
        "name" => "书籍B",
        "author" => "作者B",
        "year" => 2021,
        "category" => "国内历史",
        "subcategory" => "秦汉三国",
        "rating" => 3.5,
        "link" => "https://example.com/bookB"
    ]
    // Add more book records here
]);
?>
