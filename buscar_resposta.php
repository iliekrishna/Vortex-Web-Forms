<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Configurações do banco de dados
$host = '162.241.40.214';
$db = 'miltonb_fatec_solicitacoes';
$user = 'miltonb_userVortex';
$pass = 'gWLQqb~dRO0M';
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

    $historico = [];

    // Consulta na tabela t_tickets
    $stmt1 = $pdo->prepare("SELECT assunto AS titulo, resposta, data_resposta FROM t_tickets WHERE cpf = :cpf");
    $stmt1->execute(['cpf' => $cpf]);
    $resultados1 = $stmt1->fetchAll(PDO::FETCH_ASSOC);

    // Consulta na tabela t_requerimentos
    $stmt2 = $pdo->prepare("SELECT nome_doc AS titulo, resposta, data_resposta FROM t_requerimentos WHERE cpf = :cpf");
    $stmt2->execute(['cpf' => $cpf]);
    $resultados2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    // Junta os dois conjuntos de resultados
    $historico = array_merge($resultados1, $resultados2);

    // Ordena por data_resposta (mais recentes primeiro)
    usort($historico, function ($a, $b) {
        return strtotime($b['data_resposta']) - strtotime($a['data_resposta']);
    });

    echo json_encode([
        'sucesso' => true,
        'historico' => $historico
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao conectar ao banco de dados: ' . $e->getMessage()
    ]);
}
