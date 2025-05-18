<?php
// chat-handler.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle OPTIONS request (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
$api_key = $_ENV['OPENAI_API_KEY'];

// Get and validate the request body
$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Message is required']);
    exit();
}

$message = $input['message'];

// The same system prompt from your original chat.js
$systemPrompt = <<<EOT
You are a chatbot for Gemba Indonesia Karya, a consultancy and training company based in Indonesia (website: https://www.gembaindonesia.com/). Your role is to assist users by providing information about the company and its services, and answering questions within your expertise areas.

About Gemba Indonesia Karya:
Gemba Indonesia Karya helps companies unleash their potential to take their organization to the next level. They focus on both "hard potentials" (such as work-in-progress, rework, and inefficiencies) and "softer potentials" (such as customer satisfaction, employee engagement, creativity, and communication effectiveness). They offer consultancy and training services, using tools and assignments that are relatable to clients' industries, encouraging interaction among trainees, and providing a positive and respectful training environment.

Areas of Expertise:
1. AI
2. Machine Learning
3. Data Analysis
4. Lean and Six Sigma
5. Project Management
6. Change Management

Rules:
1. Always provide short and precise answers to any questions.
2. Never, under any circumstances, give answers to questions outside of your expertise field.
3. Always finish off with asking if there are any other questions.
4. Format responses with clear line breaks: use two newlines (\\n\\n) between sentences or list items, and three newlines (\\n\\n\\n) between paragraphs or sections.
5. When asked what the company offers (e.g., "What can your company offer me"), respond with the following formatted list:
  Gemba Indonesia Karya helps unleash your organization's potential through:\\n\\n
  - 1. AI: We can provide solutions and consultancy to help implement artificial intelligence strategies in your business.\\n\\n
  - 2. Machine Learning: We offer services to develop and deploy machine learning models tailored to your needs.\\n\\n
  - 3. Data Analysis: We provide data analysis services to help you derive insights and make informed decisions.\\n\\n
  - 4. Lean and Six Sigma: We offer training and consultancy to improve efficiency and quality through Lean and Six Sigma methodologies.\\n\\n
  - 5. Project Management: Our services include project management support and training to ensure successful project delivery.\\n\\n
  - 6. Change Management: We help manage the people side of change to achieve desired business outcomes effectively.\\n\\n
  Is there anything specific you would like more information about?
EOT;

// Prepare the request to OpenAI
$data = [
    'model' => 'gpt-3.5-turbo',
    'messages' => [
        ['role' => 'system', 'content' => $systemPrompt],
        ['role' => 'user', 'content' => $message]
    ],
    'max_tokens' => 600,
    'temperature' => 0.7
];

// Make the request to OpenAI
$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $api_key
]);

$response = curl_exec($ch);

if ($response === false) {
    error_log('Curl error: ' . curl_error($ch));
}

error_log('OpenAI raw response: ' . $response);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($http_code === 200) {
    $result = json_decode($response, true);

    // Check if OpenAI returned a valid response
    if (isset($result['choices'][0]['message']['content'])) {
        $botResponse = $result['choices'][0]['message']['content'];

        // Apply the same formatting rules as in the original chat.js
        $botResponse = trim($botResponse);

        // Enforce rules: append closing question if not present
        $closingQuestion = 'If you have any more questions, feel free to ask.';
        if (substr($botResponse, -strlen($closingQuestion)) !== $closingQuestion) {
            $botResponse .= "\n\n\n" . $closingQuestion;
        }

        // Enhance formatting (removed /g modifiers)
        $botResponse = preg_replace('/\.(\s+)(?=[A-Z])/', ".\n\n", $botResponse);
        $botResponse = preg_replace('/\n(?!\n)/', "\n\n", $botResponse);
        $botResponse = preg_replace('/\n{3,}/', "\n\n\n", $botResponse);
        $botResponse = preg_replace('/(Gemba Indonesia Karya helps unleash your organization\'s potential through:)/', "$1\n\n", $botResponse);
        $botResponse = preg_replace('/(\d+\.\s[^:]+:)/', "\n\n- $1", $botResponse);
        $botResponse = preg_replace('/(Is there anything specific you would like more information about\?)/', "\n\n\n$1", $botResponse);

        echo json_encode(['response' => trim($botResponse)]);
    } else {
        // Log the full OpenAI response for debugging
        error_log('OpenAI API error or empty response: ' . $response);
        http_response_code(500);
        echo json_encode([
            'error' => 'OpenAI API returned an unexpected response.',
            'details' => $result
        ]);
    }
} else {
    // Log the error response from OpenAI
    error_log('OpenAI HTTP error: ' . $response);
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to get response from AI',
        'details' => $response
    ]);
}

curl_close($ch);
?>
