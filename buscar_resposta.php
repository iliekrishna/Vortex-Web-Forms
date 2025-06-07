<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permite requisições de qualquer origem (útil para testes locais)

// Configurações do banco de dados
$host = 'localhost';
$db = 'fatec_solicitacoes';
$user = 'root';
$pass = 'Patinhoborrachudo123'; // Ajuste a senha conforme seu ambiente
$charset = 'utf8mb4';

// Sanitização do CPF recebido
$cpf = isset($_GET['cpf']) ? preg_replace('/\D/', '', $_GET['cpf']) : '';

// Validação básica do CPF
if (strlen($cpf) !== 11) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'CPF inválido.'
    ]);
    exit;
}

try {
    // Conexão com o banco usando PDO
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // Consulta dos tickets associados ao CPF
    $stmt = $pdo->prepare("SELECT assunto, resposta, data_resposta FROM tickets WHERE cpf = :cpf ORDER BY data_envio DESC");
    $stmt->execute(['cpf' => $cpf]);
    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso' => true,
        'historico' => $resultados
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao conectar ao banco de dados: ' . $e->getMessage()
    ]);
}
