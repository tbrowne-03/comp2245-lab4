<?php
// books.php
header('Content-Type: application/json; charset=UTF-8');
require __DIR__ . '/db.php';

// 1. Read and sanitise q
$q = $_GET['q'] ?? '';
if (!is_string($q)) $q = '';
$q = trim($q);
$pattern = '%' . $q . '%';

// Base SQL (always present)
$sql = 'SELECT books.title,
               books.author,
               books.year,
               subjects.name AS subject,
               books.copies,
               (books.copies - books.on_loan) AS available
        FROM books
        JOIN subjects ON books.subject_id = subjects.id
        WHERE (books.title  LIKE :title
            OR books.author LIKE :author)';

// Two placeholders, same pattern bound to each
$params = [':title' => $pattern, ':author' => $pattern];

// subject filter, must be a whole number
$subject = filter_input(INPUT_GET, 'subject', FILTER_VALIDATE_INT);
if (is_int($subject) && $subject >= 1) {
    $sql .= ' AND books.subject_id = :subject';
    $params[':subject'] = $subject;
}

// available filter 
$available = filter_input(INPUT_GET, 'available', FILTER_VALIDATE_INT);
if ($available === 1) {
    $sql .= ' AND (books.copies - books.on_loan) > 0';
}

// Sort
$sql .= ' ORDER BY books.title ASC';

// Prepare, execute and return JSON
$stmt = $pdo->prepare($sql);
$stmt->execute($params);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));