<?php
declare(strict_types=1);

namespace App\Data;

class VertexData
{
    private string $user;
    private array $hashtags;

    public function __construct(string $user, array $hashtags)
    {
        $this->user = $user;
        $this->hashtags = $hashtags;
    }

    public function getUser(): string
    {
        return $this->user;
    }

    public function setUser(string $user): void
    {
        $this->user = $user;
    }

    public function getHashtags(): array
    {
        return $this->hashtags;
    }

    public function setHashtags(array $hashtags): void
    {
        $this->hashtags = $hashtags;
    }
}