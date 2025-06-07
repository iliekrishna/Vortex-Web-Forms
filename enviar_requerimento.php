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
    // Conexão com o banco usando PDO
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
$RADoc                    = trim($_POST['RADoc'] ?? '');
$telefone                 = trim($_POST['telefone'] ?? '');
$cursoDoc                 = trim($_POST['cursoDoc'] ?? '');
$nomeDoc                  = trim($_POST['nomeDoc'] ?? '');
$RG                       = trim($_POST['RG'] ?? '');
$emailDoc                 = trim($_POST['emailDoc'] ?? '');
$documento_solicitado     = trim($_POST['documento_solicitado'] ?? '');


// Validação dos campos
if (
    !$RADoc || !$telefone || !$cursoDoc|| !$nomeDoc ||
    !$RG || !$emailDoc || !$documento_solicitado
) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Por favor, preencha todos os campos.'
    ]);
    exit;
}

// Envia para o banco de dados
try {
    $stmt = $pdo->prepare("
        INSERT INTO requerimentos (RADoc, telefone, cursoDoc, nomeDoc, RG, emailDoc, documento_solicitado)
        VALUES (:RADoc, :telefone, :cursoDoc, :nomeDoc, :RG, :emailDoc, :documento_solicitado)
    ");

    $stmt->execute([
        ':RADoc' => $RADoc,
        ':telefone' => $telefone,
        ':cursoDoc' => $cursoDoc,
        ':nomeDoc' => $nomeDoc,
        ':RG' => $RG,
        ':emailDoc' => $emailDoc,
        ':documento_solicitado' => $documento_solicitado
    ]);

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Requerimento enviado com sucesso.'
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao enviar o requerimento: ' . $e->getMessage()
    ]);
}