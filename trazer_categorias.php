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

     $sql = "SELECT id, nome
            FROM t_faq_categoria
            ORDER BY (nome = 'Outros') ASC, nome ASC";

    $stmt = $pdo->query($sql);
    $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["success" => true, "categorias" => $categorias]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
