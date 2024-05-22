<?php
declare(strict_types = 1);

namespace App\Common;

use Symfony\Component\DependencyInjection\Exception\RuntimeException;

final class ConnectionProvider
{
    public function __construct() {}

    public static function getConnection(): Connection
    {
        static $connection = null;
        if ($connection === null)
        {
            $dsn = self::getEnvString('APP_DB_DSN');
            $user = self::getEnvString('APP_DB_NAME');
            $password = self::getEnvString('APP_DB_PASSWORD');
            $connection = new Connection($dsn, $user, $password);
        }

        return $connection;
    }

    private static function getEnvString(string $name): string
    {
        $value = $_ENV[$name];
        if ($value === false)
        {
            throw new RuntimeException("Environment variable " . $name . " not set");
        }

        return (string)$value;
    }
}