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

    // Consulta os documentos disponíveis
    $stmt = $pdo->prepare("SELECT id_disponibilidade, nome_doc FROM t_disponibilidade_doc WHERE status_atual != 'indisponivel' ORDER BY nome_doc");
    $stmt->execute();
    $docs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso' => true,
        'documentos' => $docs
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao conectar ou consultar o banco de dados: ' . $e->getMessage()
    ]);
    exit;
}
?>