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

    // Buscar todas as categorias + FAQs
    $sql = "SELECT f.id_faq, f.pergunta, f.resposta, f.categoria_id, c.nome
            FROM t_faq f
            INNER JOIN t_faq_categoria c ON f.categoria_id = c.id
            ORDER BY f.categoria_id, f.id_faq";

    $stmt = $pdo->query($sql);

    $faqs = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if (!isset($faqs[$row['categoria_id']])) {
            $faqs[$row['categoria_id']] = [
                "nome_categoria" => $row['nome'],
                "perguntas" => []
            ];
        }
        $faqs[$row['categoria_id']]["perguntas"][] = [
            "pergunta" => $row['pergunta'],
            "resposta" => $row['resposta']
        ];
    }

    echo json_encode(["success" => true, "faqs" => $faqs]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}