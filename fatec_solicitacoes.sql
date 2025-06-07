-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 29/05/2025 às 03:04
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `fatec_solicitacoes`
--
CREATE DATABASE IF NOT EXISTS `fatec_solicitacoes` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `fatec_solicitacoes`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `tipo_vinculo` varchar(50) DEFAULT NULL,
  `ra` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `curso` varchar(100) DEFAULT NULL,
  `assunto` text DEFAULT NULL,
  `data_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `resposta` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pendente',
  `data_resposta` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tickets`
--

INSERT INTO `tickets` (`id`, `nome`, `cpf`, `tipo_vinculo`, `ra`, `email`, `curso`, `assunto`, `data_envio`, `resposta`, `status`, `data_resposta`) VALUES
(1, 'Teste Xampp', '518.162.218-64', 'Ex-aluno', '1234567890', 'teste@xamp.com', NULL, 'test xamp', '2025-05-24 03:07:56', 'teste', 'Respondida', NULL),
(2, 'Angelo', '51816221864', 'Aluno', '1670482412029', 'exemplo.teste@gmail.com', 'Análise e Desenvolvimento de Sistemas', 'Teste', '2025-05-29 00:00:53', 'TesteRespostaaaa', 'Respondida', NULL),
(3, 'TesteCPF', '05008776886', 'Comunidade externa', '1234567890', 'Teste@CPF', 'Logística Aeroportuária', '123456789', '2025-05-29 00:19:59', 'TESTE', 'Pendente', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `criado_em`) VALUES
(1, 'usuarioTeste', '', '$2a$11$M2ZVo3jvCmEt1dUUVN7DvuFa4VGIfJq/qCPpL4wUi2hFDc/YIMOky', '2025-05-29 00:46:51');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
