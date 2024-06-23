<?php
declare(strict_types=1);

namespace App\Model;

class Hashtag
{
    private ?int $id;
    private int $userId;
    private string $hashtag;

    public function __construct(
        int $userId,
        string $hashtag,
        ?int $id,
    )
    {
        $this->userId = $userId;
        $this->hashtag = $hashtag;
        $this->id = $id;
    }

    public function setHashtag(string $hashtag): void
    {
        $this->hashtag = $hashtag;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function getHashtag(): string
    {
        return $this->hashtag;
    }
}