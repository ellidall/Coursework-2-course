<?php
declare(strict_types=1);

namespace App\Service;

use App\Adapter\VKApiAdapter;
use App\Database\HashtagTable;
use App\Database\UserTable;
use App\Model\Hashtag;
use App\Model\User;
use Exception;
use GuzzleHttp\Exception\GuzzleException;

class VKService
{
    private const ISPRING_INSTITUTE_GROUP_ID = '210114453';
    private VKApiAdapter $adapter;
    private HashtagTable $hashtagTable;
    private UserTable $userTable;

    public function __construct(UserTable $userTable, HashtagTable $hashtagTable)
    {
        $this->adapter = new VKApiAdapter($_ENV['VK_TOKEN']);
        $this->hashtagTable = $hashtagTable;
        $this->userTable = $userTable;
    }

    /**
     * @throws GuzzleException
     */
    public function updateData(): void
    {
        $hashtags = $this->getWallPostsTexts();

        foreach ($hashtags as $hashtag)
        {
            $pattern = '/#[\wа-яА-ЯёЁ]+/u';
            preg_match_all($pattern, $hashtag->getHashtag(), $matches);

            if (!empty($matches[0])) {
                $chunks = array_chunk($matches[0], 1);

                foreach ($chunks as $chunk) {
                    $hashtag->setHashtag($chunk[0]);
                    $this->hashtagTable->insert($hashtag);
                }
            }
        }
    }

    /**
     * @return Hashtag[]
     * @throws GuzzleException
     */
    public function getWallPostsTexts(): array
    {
        $users = $this->getUsersWithoutWallPosts();

        $hashtags = [];
        foreach ($users as $user)
        {
            $wallData = $this->getWallPostsDataByUserId($user->getId());
            if (!$wallData) {
                continue;
            }
            foreach ($wallData as $itemData)
            {
                if (!isset($itemData['text'])) {
                    continue;
                }
                $text = $itemData['text'];
                if ($text) {
                    $hashtag = new Hashtag(
                        userId: $user->getId(),
                        hashtag: $text,
                        id: null,
                    );
                    $hashtags[] = $hashtag;
                }
            }
        }

        return $hashtags;
    }

    /**
     * @param int $ownerId
     * @return ?array
     * @throws GuzzleException
     */
    private function getWallPostsDataByUserId(int $ownerId): ?array
    {
        $wallData = $this->adapter->getWallPosts($ownerId);
        if (isset($wallData['error'])) {
            return null;
        }

        $wall = $wallData['response'];
        return $wall['items'];
    }

    /**
     * @return User[]
     * @throws GuzzleException
     */
    private function getUsersWithoutWallPosts(): array
    {
        $response = $this->adapter->getUsersData($this->getGroupMemberIds());

        $this->hashtagTable->dropTable();
        $this->userTable->dropTable();
        $this->userTable->createTable();
        $this->hashtagTable->createTable();

        $users = [];

        foreach ($response as $user)
        {
            if (!$user['is_closed'])
            {
                $user = new User(
                    id: $user['id'],
                    firstName: $user['first_name'],
                    lastName: $user['last_name'],
                );

                $users[] = $user;

                $this->userTable->insert($user);
            }
        }

        return $users;
    }

    /**
     * @return int[]
     * @throws GuzzleException
     */
    private function getGroupMemberIds(): array
    {
        $allMembers = [];
        $offset = 0;
        $count = 500;
        $maxRetries = 3;

        do {
            $retries = 0;
            do {
                try {
                    $groupMembers = $this->adapter->getGroupMembers(self::ISPRING_INSTITUTE_GROUP_ID, $offset, $count);
                    if (array_key_exists('response', $groupMembers)) {
                        $members = $groupMembers['response']['items'];
                        $allMembers = array_merge($allMembers, $members);
                    } elseif (array_key_exists('error', $groupMembers)) {
                        if ($groupMembers['error']['error_code'] === 6) {
                            if ($retries < $maxRetries) {
                                $retries++;
                                usleep(100000);
                                continue;
                            } else {
                                throw new Exception('Превышено максимальное количество попыток');
                            }
                        } else {
                            throw new Exception('Произошла ошибка: ' . $groupMembers['error']['error_msg']);
                        }
                    } else {
                        throw new Exception('Неожиданный ответ от API');
                    }
                    $offset += $count;
                    break;
                } catch (Exception $e) {
                    error_log($e->getMessage());
                    if ($retries < $maxRetries) {
                        $retries++;
                        usleep(100000);
                    } else {
                        throw $e;
                    }
                }
            } while ($retries < $maxRetries);
        } while (count($members) > 0);

        return array_values($allMembers);
    }
}