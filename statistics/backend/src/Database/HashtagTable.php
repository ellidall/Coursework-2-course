<?php
declare(strict_types=1);

namespace App\Database;

use App\Common\Database\Connection;
use App\Model\Hashtag;
use PDO;

class HashtagTable
{
    private Connection $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

//    public function getUserList(int $offset): array
//    {
//        $query = <<<SQL
//            SELECT id, first_name, last_name
//            FROM user
//            LIMIT 500 OFFSET :offset
//            SQL;
//
//        $statement = $this->connection->prepare($query);
//        $statement = $statement->execute([':offset' => $offset]);
//        $this->connection->execute($query, [
//            ':offset' => $offset,
//        ]);
//
//        return $statement->fetchAll(PDO::FETCH_ASSOC);
//    }

    /**
     * @param int $userId
     * @return Hashtag[]|null
     */
    public function findByUserId(int $userId): ?array
    {
        $query = <<<SQL
            SELECT 
                id,
                user_id,
                hashtag
            FROM hashtag
            WHERE user_id = :user_id
            SQL;

        $statement = $this->connection->execute($query, [
            ':user_id' => $userId,
        ]);
        $hashtags = $statement->fetchAll(PDO::FETCH_ASSOC);
        $result = [];
        if ($hashtags) {
            foreach ($hashtags as $hashtag) {
                $result[] = new Hashtag(
                    userId: $hashtag['user_id'],
                    hashtag: $hashtag['hashtag'],
                    id: $hashtag['id']
                );
            }
        }

        return $result;
    }

    /**
     * @return Hashtag[]
     */
    public function listAll(): array
    {
        $query = <<<SQL
            SELECT id, user_id, hashtag
            FROM hashtag
            SQL;

        $statement = $this->connection->execute($query);
        $hashtags = [];
        while ($row = $statement->fetch(PDO::FETCH_ASSOC))
        {
            $hashtag = new Hashtag(
                $row['id'],
                $row['user_id'],
                $row['hashtag'],
            );
            $hashtags[] = $hashtag;
        }

        return $hashtags;
    }

    public function insert(Hashtag $hashtag): int
    {
        $query = <<<SQL
        INSERT INTO hashtag (user_id, hashtag)
        VALUES (:user_id, :hashtag)
        SQL;

        $this->connection->execute($query, [
            ':user_id' => $hashtag->getUserId(),
            ':hashtag' => $hashtag->getHashtag(),
        ]);

        return $this->connection->getLastInsertId();
    }

    public function createTable(): void
    {
        $query = <<<SQL
            CREATE TABLE hashtag (
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL ,
            user_id INT NOT NULL ,
            hashtag VARCHAR(255) NOT NULL ,
            FOREIGN KEY (user_id) REFERENCES user(id))
            SQL;

        $this->connection->execute($query);
    }

    public function dropTable(): void
    {
        $query = <<<SQL
        DROP TABLE hashtag
        SQL;

        $this->connection->execute($query);
    }
}