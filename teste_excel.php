<?php
require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

// Criar planilha
$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();
$sheet->setCellValue('A1', 'Olá Mundo!');

// Salvar arquivo
$writer = new Xlsx($spreadsheet);
$writer->save('teste.xlsx');

echo "Arquivo teste.xlsx criado com sucesso!";
