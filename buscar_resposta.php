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

    // Tickets (status já vem como `status`)
    $stmt1 = $pdo->prepare("SELECT 'ticket' AS tipo, assunto AS titulo, resposta, data_resposta, `status` AS status
                            FROM t_tickets WHERE cpf = :cpf");
    $stmt1->execute(['cpf' => $cpf]);
    $resultados1 = $stmt1->fetchAll(PDO::FETCH_ASSOC);

    // Requerimentos (status_doc renomeado para `status`)
    $stmt2 = $pdo->prepare("SELECT 'requerimento' AS tipo, nome_doc AS titulo, resposta, data_resposta, status_doc AS status
                            FROM t_requerimentos WHERE cpf = :cpf");
    $stmt2->execute(['cpf' => $cpf]);
    $resultados2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    // Junta os dois conjuntos de resultados
    $historico = array_merge($resultados1, $resultados2);

    // Ordena pela data (mais recentes primeiro, nulos por último)
    usort($historico, function ($a, $b) {
        $dateA = $a['data_resposta'];
        $dateB = $b['data_resposta'];

        if ($dateA === null && $dateB !== null) {
            return 1; // $b vem antes
        }
        if ($dateA !== null && $dateB === null) {
            return -1; // $a vem antes
        }

        $timeA = $dateA ? strtotime($dateA) : PHP_INT_MAX;
        $timeB = $dateB ? strtotime($dateB) : PHP_INT_MAX;

        return $timeB - $timeA; // decrescente
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