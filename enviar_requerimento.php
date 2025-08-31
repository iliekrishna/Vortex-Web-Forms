<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Configurações do banco
$host = '162.241.40.214';
$db = 'miltonb_fatec_solicitacoes';
$user = 'miltonb_userVortex';
$pass = 'gWLQqb~dRO0M';
$charset = 'utf8mb4';

try {
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao conectar ao banco: ' . $e->getMessage()]);
    exit;
}

// Recebe campos
$ra = trim($_POST['ra'] ?? '');
$telefone = trim($_POST['telefone'] ?? '');
$curso = trim($_POST['curso'] ?? '');
$nome = trim($_POST['nome'] ?? '');
$cpf = trim($_POST['cpf'] ?? '');
$rg = trim($_POST['rg'] ?? '');
$email = trim($_POST['email'] ?? '');
$nome_doc = trim($_POST['nome_doc'] ?? '');
$motivo = trim($_POST['motivo_segunda_via'] ?? ''); // Este campo é o problema

// Validação básica
// Campos que são SEMPRE obrigatórios
if (!$ra || !$telefone || !$curso || !$nome || !$cpf || !$rg || !$email || !$nome_doc) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Por favor, preencha todos os campos obrigatórios.']);
    exit;
}

// Validação CONDICIONAL para o campo 'motivo'
if ($nome_doc === 'Carteira de Identidade Escolar (RA)' && !$motivo) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Por favor, selecione o motivo da segunda via.']);
    exit;
}

$id_imagem = null;
$uploadDir = "img_requerimentos/";
if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

// 1️⃣ Se for Carteira de Identidade Escolar (RA), processa os uploads
$endereco_bo = null;
$endereco_comprovante = null;

if ($nome_doc === 'Carteira de Identidade Escolar (RA)') {

    // Comprovante obrigatório
    if (!isset($_FILES['comprovante']) || $_FILES['comprovante']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Comprovante obrigatório.']);
        exit;
    }
    $compName = uniqid() . "_" . basename($_FILES['comprovante']['name']);
    $endereco_comprovante = $uploadDir . $compName;
    if (!move_uploaded_file($_FILES['comprovante']['tmp_name'], $endereco_comprovante)) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao mover o comprovante.']);
        exit;
    }

    // Se motivo for Roubo/Furto, B.O. também é obrigatório
    if ($motivo === 'Roubo/Furto') {
        if (!isset($_FILES['bo']) || $_FILES['bo']['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(['sucesso' => false, 'mensagem' => 'B.O. obrigatório para Roubo/Furto.']);
            exit;
        }
        $boName = uniqid() . "_" . basename($_FILES['bo']['name']);
        $endereco_bo = $uploadDir . $boName;
        if (!move_uploaded_file($_FILES['bo']['tmp_name'], $endereco_bo)) {
            echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao mover o B.O..']);
            exit;
        }
    }
    

    // Salva dados da imagem na tabela t_img_requerimento
    $stmtImg = $pdo->prepare("
        INSERT INTO t_img_requerimento (motivo_segunda_via, endereco_bo, endereco_comprovante)
        VALUES (:motivo, :bo, :comprovante)
    ");
    $stmtImg->execute([
        ':motivo' => $motivo,
        ':bo' => $endereco_bo,
        ':comprovante' => $endereco_comprovante
    ]);
    $id_imagem = $pdo->lastInsertId();
}

// 2️⃣ Insere o requerimento
try {
    $stmtReq = $pdo->prepare("
        INSERT INTO t_requerimentos (ra, telefone, curso, nome, cpf, rg, email, nome_doc, id_imagem)
        VALUES (:ra, :telefone, :curso, :nome, :cpf, :rg, :email, :nome_doc, :id_imagem)
    ");
    $stmtReq->execute([
        ':ra' => $ra,
        ':telefone' => $telefone,
        ':curso' => $curso,
        ':nome' => $nome,
        ':cpf' => $cpf,
        ':rg' => $rg,
        ':email' => $email,
        ':nome_doc' => $nome_doc,
        ':id_imagem' => $id_imagem
    ]);

    echo json_encode(['sucesso' => true, 'mensagem' => 'Requerimento enviado com sucesso.']);

} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao enviar o requerimento: ' . $e->getMessage()]);
}
