<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "markhording@gmail.com"; // <-- Change to your email
    $subject = "New Contact Form Submission";
    $name = strip_tags($_POST["name"]);
    $email = strip_tags($_POST["email"]);
    $subjectField = strip_tags($_POST["subject"]);
    $message = strip_tags($_POST["message"]);

    $body = "Name: $name\nEmail: $email\nSubject: $subjectField\nMessage:\n$message";

    $headers = "From: $email\r\nReply-To: $email\r\n";

    if (mail($to, $subject, $body, $headers)) {
        echo "Message sent!";
    } else {
        echo "Error sending message.";
    }
}
?>
