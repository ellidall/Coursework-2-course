<?php
declare(strict_types=1);

namespace App\Database;

use App\Common\Database\Connection;
use App\Model\User;
use PDO;

class UserTable
{
    private Connection $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function findById(int $id): ?User
    {
        $query = <<<SQL
            SELECT 
                id,
                first_name,
                last_name
            FROM vk_statistics
            WHERE id = :id
            SQL;

        $statement = $this->connection->execute($query, [
            ':id' => $id,
        ]);
        $user = $statement->fetch(PDO::FETCH_ASSOC);

        return $user
            ? new User(
                $user['id'],
                $user['first_name'],
                $user['last_name'],
            )
            : null;
    }

    /**
     * @return User[]
     */
    public function listAll(): array
    {
        $query = <<<SQL
            SELECT id, first_name, last_name
            FROM user
            SQL;

        $statement = $this->connection->execute($query);
        $users = [];
        while ($row = $statement->fetch(PDO::FETCH_ASSOC))
        {
            $user = new User(
                $row['id'],
                $row['first_name'],
                $row['last_name'],
            );
            $users[] = $user;
        }

        return $users;
    }

    public function insert(User $user): int
    {
        $query = <<<SQL
        INSERT INTO user (id, first_name, last_name)
        VALUES (:id, :first_name, :last_name)
        SQL;

        $this->connection->execute($query, [
            ':id' => $user->getId(),
            ':first_name' => $user->getFirstName(),
            ':last_name' => $user->getLastName(),
        ]);

        return $this->connection->getLastInsertId();
    }

    public function createTable(): void
    {
        $query = <<<SQL
            CREATE TABLE user (
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL ,
            first_name VARCHAR(255) NOT NULL ,
            last_name VARCHAR(255) NOT NULL)
            SQL;

        $this->connection->execute($query);
    }

    public function dropTable(): void
    {
        $query = <<<SQL
        DROP TABLE user
        SQL;

        $this->connection->execute($query);
    }
}