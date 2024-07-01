-- CreateTable
CREATE TABLE `municipio` (
    `id` INTEGER NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `codigo` CHAR(7) NOT NULL,
    `codigoUF` CHAR(2) NOT NULL,
    `UF` CHAR(2) NOT NULL,
    `padraoNFS` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `municipio_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produto` (
    `id` INTEGER NOT NULL,
    `descricao` VARCHAR(150) NOT NULL,
    `idTipoProduto` INTEGER NOT NULL,

    UNIQUE INDEX `produto_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pessoa` (
    `id` INTEGER NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `uf` CHAR(2) NOT NULL,
    `ativo` INTEGER NOT NULL,

    UNIQUE INDEX `pessoa_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesquisa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataVisita` DATETIME(3) NOT NULL,
    `uf` VARCHAR(191) NOT NULL,
    `cliente` VARCHAR(191) NOT NULL,
    `labPisoDeVendas` VARCHAR(191) NULL,
    `conPisoDeVendas` VARCHAR(191) NULL,
    `treinamento` VARCHAR(191) NULL,
    `vendaPremiada` VARCHAR(191) NOT NULL,
    `pagamento` VARCHAR(191) NULL,
    `merchandising` VARCHAR(191) NOT NULL,
    `reposicao` VARCHAR(191) NULL,
    `prazoEntregaCon` VARCHAR(191) NOT NULL,
    `campanhaDeVendaCon` VARCHAR(191) NULL,
    `produtoChave` VARCHAR(191) NULL,
    `linhasDeCredito` VARCHAR(191) NOT NULL,
    `observacao` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
