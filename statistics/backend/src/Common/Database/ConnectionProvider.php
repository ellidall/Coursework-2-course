<?php
declare(strict_types = 1);

namespace App\Common\Database;

use RuntimeException;

final class ConnectionProvider
{
    private const DATABASE_CONFIG_NAME = 'db.ini';
    private const KEY_DSN = 'dsn';
    private const KEY_USER = 'name';
    private const KEY_PASSWORD = 'password';

    public static function getConnection(): Connection
    {
        static $connection = null;
        if ($connection === null)
        {
            $config = self::loadDatabaseConfig();
            $connection = new Connection($config[self::KEY_DSN], $config[self::KEY_USER], $config[self::KEY_PASSWORD]);
        }

        return $connection;
    }

    private static function loadDatabaseConfig(): array
    {
        $configName = self::DATABASE_CONFIG_NAME;

        $configPath = self::getConfigPath($configName);
        if (!file_exists($configPath))
        {
            throw new RuntimeException("Could not find database configuration at '$configPath'");
        }
        $config = parse_ini_file($configPath);
        if (!$config)
        {
            throw new RuntimeException("Failed to parse database configuration from '$configPath'");
        }

        $expectedKeys = [self::KEY_DSN, self::KEY_USER, self::KEY_PASSWORD];
        $missingKeys = array_diff($expectedKeys, array_keys($config));
        if ($missingKeys)
        {
            throw new RuntimeException('Wrong database configuration: missing options ' . implode(' ', $missingKeys));
        }

        return $config;
    }

    private static function getConfigPath(string $configName): string
    {
        return self::joinPath(__DIR__, '..', '..', '..', 'config', $configName);
    }

    private static function joinPath(string ...$components): string
    {
        return implode(DIRECTORY_SEPARATOR, array_filter($components));
    }
}