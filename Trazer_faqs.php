<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Configurações do banco de dados
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

    // Buscar todas as categorias + FAQs, ordenando para que "Outros" fique por último
    $sql = "SELECT f.id_faq, f.pergunta, f.resposta, f.categoria_id, c.nome
            FROM t_faq f
            INNER JOIN t_faq_categoria c ON f.categoria_id = c.id
            ORDER BY (c.nome = 'Outros') ASC, f.categoria_id, f.id_faq";

    $stmt = $pdo->query($sql);

    $faqs = [];
    $categoriasIndex = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $catId = $row['categoria_id'];
        if (!isset($categoriasIndex[$catId])) {
            $categoriasIndex[$catId] = count($faqs);
            $faqs[] = [
                "categoria_id" => $catId,
                "nome_categoria" => $row['nome'],
                "perguntas" => []
            ];
        }
        $faqs[$categoriasIndex[$catId]]["perguntas"][] = [
            "pergunta" => $row['pergunta'],
            "resposta" => $row['resposta']
        ];
    }

    echo json_encode(["success" => true, "faqs" => $faqs]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
