<?php
ini_set('display_errors', 0);
error_reporting(0);

require 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

// Conexão com o banco de dados
$host = '162.241.40.214';
$db   = 'miltonb_fatec_solicitacoes';
$user = 'miltonb_userVortex';
$pass = 'gWLQqb~dRO0M';
$charset = 'utf8mb4';

try {
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    exit("Erro na conexão com o banco de dados.");
}

// Escolha da tabela: tickets ou requerimentos
$tabela = $_GET['tabela'] ?? 'tickets';

if ($tabela === 'tickets') {
    $stmt = $pdo->query("SELECT * FROM t_tickets");
    $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $colunas = ['ID', 'Nome do Aluno', 'CPF', 'Tipo de Vínculo', 'RA', 'Email', 'Curso', 'Categoria', 'Assunto'];
} else {
    $stmt = $pdo->query("SELECT * FROM t_requerimentos");
    $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $colunas = ['ID', 'RA', 'Telefone', 'Curso', 'Nome', 'CPF', 'RG', 'Email', 'Nome do Documento'];
}

// Criar planilha
$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();

// Cabeçalho: negrito, fundo cinza e alinhamento central
$col = 'A';
foreach ($colunas as $c) {
    $sheet->setCellValue($col.'1', $c);
    $sheet->getStyle($col.'1')->getFont()->setBold(true);
    $sheet->getStyle($col.'1')->getFill()
        ->setFillType(Fill::FILL_SOLID)
        ->getStartColor()->setRGB('D9D9D9');
    $sheet->getStyle($col.'1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    $col++;
}
$ultimaColuna = chr(ord('A') + count($colunas) - 1);

// Preencher dados
$row = 2;
if ($tabela === 'tickets') {
    foreach ($dados as $d) {
        $sheet->setCellValue('A'.$row, $d['id']);
        $sheet->setCellValue('B'.$row, $d['nome_aluno']);
        $sheet->setCellValue('C'.$row, $d['cpf']);
        $sheet->setCellValue('D'.$row, $d['tipo_vinculo']);
        $sheet->setCellValue('E'.$row, $d['ra']);
        $sheet->setCellValue('F'.$row, $d['email']);
        $sheet->setCellValue('G'.$row, $d['curso']);
        $sheet->setCellValue('H'.$row, $d['categoria']);
        $sheet->setCellValue('I'.$row, $d['assunto']);
        $row++;
    }
} else {
    foreach ($dados as $d) {
        $sheet->setCellValue('A'.$row, $d['id']);
        $sheet->setCellValue('B'.$row, $d['ra']);
        $sheet->setCellValue('C'.$row, $d['telefone']);
        $sheet->setCellValue('D'.$row, $d['curso']);
        $sheet->setCellValue('E'.$row, $d['nome']);
        $sheet->setCellValue('F'.$row, $d['cpf']);
        $sheet->setCellValue('G'.$row, $d['rg']);
        $sheet->setCellValue('H'.$row, $d['email']);
        $sheet->setCellValue('I'.$row, $d['nome_doc']);
        $row++;
    }
}
$ultimaLinha = $row - 1;

// Ajustar largura das colunas automaticamente
foreach (range('A', $ultimaColuna) as $columnID) {
    $sheet->getColumnDimension($columnID)->setAutoSize(true);
}

// Adicionar bordas em todas as células
$sheet->getStyle("A1:{$ultimaColuna}{$ultimaLinha}")
    ->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

// Ativar filtros automáticos na primeira linha
$sheet->setAutoFilter("A1:{$ultimaColuna}1");

// Forçar download
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment; filename="'.$tabela.'_'.date('Y-m-d_H-i-s').'.xlsx"');
header('Cache-Control: max-age=0');

$writer = new Xlsx($spreadsheet);
$writer->save('php://output');
exit;
