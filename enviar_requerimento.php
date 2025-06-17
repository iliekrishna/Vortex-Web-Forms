<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Configura��es do banco de dados
$host = '162.241.40.214';
$db = 'miltonb_fatec_solicitacoes';
$user = 'miltonb_userVortex';
$pass = 'gWLQqb~dRO0M';
$charset = 'utf8mb4';

try {
    // Conex�o com o banco usando PDO
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

// Limpa os dados do formul�rio
$ra                       = trim($_POST['ra'] ?? '');
$telefone                 = trim($_POST['telefone'] ?? '');
$curso                    = trim($_POST['curso'] ?? '');
$nome                     = trim($_POST['nome'] ?? '');
$cpf                      = trim($_POST['cpf'] ?? '');
$rg                       = trim($_POST['rg'] ?? '');
$email                    = trim($_POST['email'] ?? '');
$nome_doc                 = trim($_POST['nome_doc'] ?? '');


// Valida��o dos campos
if (
    !$ra || !$telefone || !$curso || !$nome || !$cpf ||
    !$rg || !$email || !$nome_doc
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
        INSERT INTO t_requerimentos (ra, telefone, curso, nome, cpf, rg, email, nome_doc)
        VALUES (:ra, :telefone, :curso, :nome, :cpf, :rg, :email, :nome_doc)
    ");

    $stmt->execute([
        ':ra' => $ra,
        ':telefone' => $telefone,
        ':curso' => $curso,
        ':nome' => $nome,
        ':cpf' => $cpf,
        ':rg' => $rg,
        ':email' => $email,
        ':nome_doc' => $nome_doc
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