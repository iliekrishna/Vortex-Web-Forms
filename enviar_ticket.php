<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Configurações do banco de dados
$host = '162.241.40.214';
$db = 'miltonb_fatec_solicitacoes';
$user = 'miltonb_userVortex';
$pass = 'gWLQqb~dRO0M';
$charset = 'utf8mb4';


//conection bd
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
$nome_aluno   = trim($_POST['nome_aluno'] ?? '');
$cpf          = preg_replace('/\D/', '', $_POST['cpf'] ?? '');
$tipo_vinculo = trim($_POST['tipo_vinculo'] ?? '');
$ra           = trim($_POST['ra'] ?? '');
$email        = trim($_POST['email'] ?? '');
$curso        = trim($_POST['curso'] ?? '');
$categoria    = trim($_POST['categoria'] ?? '');
$assunto      = trim($_POST['assunto'] ?? '');

// Validação básica
if (!$nome_aluno || !$cpf || !$tipo_vinculo || !$email || !$categoria || !$assunto) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Por favor, preencha todos os campos obrigatórios.'
    ]);
    exit;
}

//Envia para o banco de dados
try {
    $stmt = $pdo->prepare("
        INSERT INTO t_tickets (nome_aluno, cpf, tipo_vinculo, ra, email, curso, categoria, assunto)
        VALUES (:nome_aluno, :cpf, :tipo_vinculo, :ra, :email, :curso, :categoria, :assunto)
    ");

    $stmt->execute([
        ':nome_aluno' => $nome_aluno,
        ':cpf' => $cpf,
        ':tipo_vinculo' => $tipo_vinculo,
        ':ra' => $ra,
        ':email' => $email,
        ':categoria' => $categoria,
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
