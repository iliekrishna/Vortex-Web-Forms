<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Configurações do banco de dados
$host = 'localhost';
$db = 'fatec_solicitacoes';
$user = 'root';
$pass = 'Patinhoborrachudo123';
$charset = 'utf8mb4';

try {
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao conectar ao banco de dados: ' . $e->getMessage()
    ]);
    exit;
}

// Limpa os dados do formulário
$nome         = trim($_POST['nome'] ?? '');
$cpf          = preg_replace('/\D/', '', $_POST['cpf'] ?? '');
$tipo_vinculo = trim($_POST['tipo_vinculo'] ?? '');
$ra           = trim($_POST['ra'] ?? '');
$email        = trim($_POST['email'] ?? '');
$curso        = trim($_POST['curso'] ?? '');
$assunto      = trim($_POST['assunto'] ?? '');

// Validação básica
if (!$nome || !$cpf || !$tipo_vinculo || !$email || !$assunto) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Por favor, preencha todos os campos obrigatórios.'
    ]);
    exit;
}

//Envia para o banco de dados
try {
    $stmt = $pdo->prepare("
        INSERT INTO tickets (nome, cpf, tipo_vinculo, ra, email, curso, assunto)
        VALUES (:nome, :cpf, :tipo_vinculo, :ra, :email, :curso, :assunto)
    ");

    $stmt->execute([
        ':nome' => $nome,
        ':cpf' => $cpf,
        ':tipo_vinculo' => $tipo_vinculo,
        ':ra' => $ra,
        ':email' => $email,
        ':curso' => $curso,
        ':assunto' => $assunto
    ]);

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Ticket enviado com sucesso.'
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao salvar o ticket: ' . $e->getMessage()
    ]);
}
