<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './phpmailer/vendor/phpmailer/phpmailer/src/Exception.php';
require './phpmailer/vendor/phpmailer/phpmailer/src/PHPMailer.php';
require './phpmailer/vendor/phpmailer/phpmailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $phone = $_POST["phone"];
    $email = $_POST["email"];
    $comment = $_POST["comment"];
    $terms = isset($_POST["terms"]) ? "Accepted" : "Not Accepted";
    $dateTime = date("Y-m-d H:i:s");

    $databaseFolder = "../database/order_services/";
    if (!file_exists($databaseFolder)) {
        mkdir($databaseFolder, 0777, true);
    }

    $databaseFolder = "../database/order_services/";
    $lastSubmittedFile = scandir(
        $databaseFolder,
        SCANDIR_SORT_DESCENDING
    );
    $lastSerialNumber = 0;
    $nextSerialNumber = 0;

    foreach ($lastSubmittedFile as $filename) {
        if (preg_match('/^\[ORDER\](\d+)\.txt$/', $filename, $matches)) {
            $lastSerialFile = $databaseFolder . $filename;
            $fileLines = file($lastSerialFile);
            $lastSerialNumber = (int) explode(" ", $fileLines[0])[1];
            break;
        }
    }

    if (
        $lastSerialNumber === 0 && empty($fileLines)
    ) {
        $lastSerialNumber = 0;
    } else {
        $nextSerialNumber = $lastSerialNumber + 1;
    }

    $serialFile = $databaseFolder . "serial_number.txt";
    file_put_contents($serialFile, $nextSerialNumber);

    $data = "№: $nextSerialNumber\nName: $name\nPhone number: $phone\nEmail: $email\nComment: $comment\nTerms and conditions of the Privacy Policy: $terms\nDate and time: $dateTime\n\n";
    $filename = $databaseFolder . "[ORDER]" . time() . ".txt";
    file_put_contents($filename, $data, FILE_APPEND);

    $mail = new PHPMailer(true);

    try {
        // SMTP configuration
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'lobix2005@gmail.com';
        $mail->Password = 'ntzevqwzstwwrvkm';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        // Sender and recipient
        $mail->setFrom($email, $name);
        $mail->addAddress('gamesfire2005@gmail.com', 'Yevhenii');

        // Email content
        $mail->Subject = "Service order $nextSerialNumber";
        $mail->Body = "Name: $name\nPhone number: $phone\nEmail: $email\nComment: $comment\n\nDate and time: $dateTime";

        // Send email
        $mail->send();

        // Email sent successfully
        $response = array("success" => true, "message" => "Form submitted successfully and email sent");
    } catch (Exception $e) {
        // Email sending failed
        $response = array("success" => false, "message" => "Form submitted successfully but email sending failed");
    }

    // Set CORS headers to allow requests from specific origins
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    // Send JSON response to the client
    echo json_encode($response);
} else if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Calculate the next serial number based on the existing order files
    $databaseFolder = "../database/order_services/";
    $lastSubmittedFile = scandir(
        $databaseFolder,
        SCANDIR_SORT_DESCENDING
    );
    $lastSerialNumber = 0;
    $nextSerialNumber = 0;

    foreach ($lastSubmittedFile as $filename) {
        if (preg_match(
            '/^\[ORDER\](\d+)\.txt$/',
            $filename,
            $matches
        )) {
            $lastSerialFile = $databaseFolder . $filename;
            $fileLines = file($lastSerialFile);
            $lastSerialNumber = (int) explode(" ", $fileLines[0])[1];
            break;
        }
    }

    if (
        $lastSerialNumber === 0 && empty($fileLines)
    ) {
        $lastSerialNumber = 0;
    } else {
        $nextSerialNumber = $lastSerialNumber + 1;
    }

    $totalOrders = $nextSerialNumber;
    $lastOrderFile = "";

    foreach ($lastSubmittedFile as $filename) {
        if (preg_match('/^\[ORDER\]\d+\.txt$/', $filename)) {
            $lastOrderFile = $filename;
            break;
        }
    }

    // Set CORS headers to allow requests from specific origins
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: text/plain");

    // Echo order statistics
    echo "ORDER STATISTICS:\n";
    echo "Total orders: $totalOrders\n";
    echo "Last order: $lastOrderFile\n";
    echo "\nCurrent date and time: " . date("Y-m-d H:i:s");
} else {
    http_response_code(405);
    echo "Method Not Allowed";
}
