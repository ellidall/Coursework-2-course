<?php
declare(strict_types=1);

namespace App\Common\Database;

use PDO;
use PDOStatement;
use RuntimeException;

final class Connection
{
    private string $dsn;
    private string $user;
    private string $password;

    private ?PDO $handle = null;
    private int $transactionLevel = 0;

    public function __construct(string $dsn, string $user, string $password)
    {
        $this->dsn = $dsn;
        $this->user = $user;
        $this->password = $password;
    }

    public function execute(string $sql, array $params = []): PDOStatement
    {
        $statement = $this->getConnection()->prepare($sql);
        $statement->execute($params);

        return $statement;
    }

    public function getLastInsertId(): int
    {
        if ($lastInsertId = $this->getConnection()->lastInsertId())
        {
            return (int)$lastInsertId;
        }
        return throw new RuntimeException("Failed to get last insert id");
    }

    public function beginTransaction(): void
    {
        if ($this->transactionLevel === 0)
        {
            $this->getConnection()->beginTransaction();
        }
        ++$this->transactionLevel;
    }

    public function commit(): void
    {
        if ($this->transactionLevel <= 0)
        {
            throw new \RuntimeException('Cannot call ' . __METHOD__ . ': there is no open transaction');
        }

        --$this->transactionLevel;
        if ($this->transactionLevel === 0)
        {
            $this->getConnection()->commit();
        }
    }

    public function rollback(): void
    {
        if ($this->transactionLevel <= 0)
        {
            throw new \RuntimeException('Cannot call ' . __METHOD__ . ': there is no open transaction');
        }

        --$this->transactionLevel;
        if ($this->transactionLevel === 0)
        {
            $this->getConnection()->rollBack();
        }
    }

    private function getConnection(): PDO
    {
        if ($this->handle === null)
        {
            $this->handle = new PDO($this->dsn, $this->user, $this->password);
            $this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }

        return $this->handle;
    }
}