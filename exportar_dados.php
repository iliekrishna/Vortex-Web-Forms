<?php
// Desliga erros visíveis para não corromper o XLSX
error_reporting(0);
ini_set('display_errors', 0);

require __DIR__ . '/vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Writer\Csv;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

// Configuração do banco
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

// Define tabela e formato
$tabela  = $_GET['tabela']  ?? 'tickets';
$formato = $_GET['formato'] ?? 'xlsx';

// Consulta dados
if ($tabela === 'tickets') {
    $stmt = $pdo->query("SELECT * FROM t_tickets");
    $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $colunas = ['ID', 'Nome do Aluno', 'CPF', 'Tipo de Vínculo', 'RA', 'Email', 'Curso', 'Categoria', 'Assunto'];
} else {
    $stmt = $pdo->query("SELECT * FROM t_requerimentos");
    $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $colunas = ['ID', 'RA', 'Telefone', 'Curso', 'Nome', 'CPF', 'RG', 'Email', 'Nome do Documento'];
}

// Cria planilha
$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();

// Cabeçalho
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

// Preenche dados
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

// Descobre última célula
$ultimaColuna = $sheet->getHighestColumn();
$ultimaLinha  = $sheet->getHighestRow();

// Ajusta largura
foreach (range('A', $ultimaColuna) as $columnID) {
    $sheet->getColumnDimension($columnID)->setAutoSize(true);
}

// Bordas
$sheet->getStyle("A1:{$ultimaColuna}{$ultimaLinha}")
      ->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

// Exporta
$filename = $tabela.'_'.date('Y-m-d_H-i-s');

if ($formato === 'csv') {
    header('Content-Type: text/csv');
    header("Content-Disposition: attachment; filename=\"{$filename}.csv\"");
    $writer = new Csv($spreadsheet);
} else {
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header("Content-Disposition: attachment; filename=\"{$filename}.xlsx\"");
    $writer = new Xlsx($spreadsheet);
}

$writer->save('php://output');
exit;
