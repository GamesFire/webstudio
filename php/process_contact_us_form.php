<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './phpmailer/vendor/phpmailer/phpmailer/src/Exception.php';
require './phpmailer/vendor/phpmailer/phpmailer/src/PHPMailer.php';
require './phpmailer/vendor/phpmailer/phpmailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = $_POST["name"];
  $email = $_POST["email"];
  $comment = $_POST["comment"];
  $dateTime = date("Y-m-d H:i:s");

  $databaseFolder = "../database/contact_us/";
  if (!file_exists($databaseFolder)) {
    mkdir($databaseFolder, 0777, true);
  }

  $databaseFolder = "../database/contact_us/";
  $lastSubmittedFile = scandir(
    $databaseFolder,
    SCANDIR_SORT_DESCENDING
  );
  $lastSerialNumber = 0;
  $nextSerialNumber = 0;

  foreach ($lastSubmittedFile as $filename) {
    if (preg_match('/^\[CONTACT\](\d+)\.txt$/', $filename, $matches)) {
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

  $data = "№: $nextSerialNumber\nName: $name\nEmail: $email\nComment: $comment\nDate and time: $dateTime\n\n";
  $filename = $databaseFolder . "[CONTACT]" . time() . ".txt";
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
    $mail->Subject = 'New Contact Us Submission';
    $mail->Body = "Name: $name\nEmail: $email\nComment: $comment";

    // Send email
    $mail->send();

    // Email sent successfully
    $response = array("success" => true, "message" => "Form submitted successfully and email sent");
  } catch (Exception $e) {
    // Email sending failed
    $response = array("success" => false, "message" => "Form submission failed. Email sending failed.");
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
  $databaseFolder = "../database/contact_us/";
  $lastSubmittedFile = scandir(
    $databaseFolder,
    SCANDIR_SORT_DESCENDING
  );
  $lastSerialNumber = 0;
  $nextSerialNumber = 0;

  foreach ($lastSubmittedFile as $filename) {
    if (preg_match(
      '/^\[CONTACT\](\d+)\.txt$/',
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

  $totalContacts = $nextSerialNumber;
  $lastOrderFile = "";

  foreach ($lastSubmittedFile as $filename) {
    if (preg_match('/^\[CONTACT\]\d+\.txt$/', $filename)) {
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
  echo "CONTACTS STATISTICS:\n";
  echo "Total contacts: $totalContacts\n";
  echo "Last contact: $lastOrderFile\n";
  echo "\nCurrent date and time: " . date("Y-m-d H:i:s");
} else {
  http_response_code(405);
  echo "Method Not Allowed";
}
