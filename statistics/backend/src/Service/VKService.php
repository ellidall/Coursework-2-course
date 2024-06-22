<?php
declare(strict_types=1);

namespace App\Service;

use App\Adapter\VKApiAdapter;
use App\Model\User;
use GuzzleHttp\Exception\GuzzleException;

class VKService
{
    private const ISPRING_INSTITUTE_GROUP_ID = '210114453';
    private VKApiAdapter $adapter;

    public function __construct()
    {
        $this->adapter = new VKApiAdapter($_ENV['VK_TOKEN']);
    }

    /**
     * @return string[]
     * @throws GuzzleException
     */
    public function getHashtags(): array
    {
        $texts = $this->getWallPostsTexts();

        $hashtags = [];
        foreach ($texts as $text)
        {
            $pattern = '/#[\wа-яА-ЯёЁ]+/u';
            preg_match_all($pattern, $text, $matches);

            if (!empty($matches[0])) {
                $hashtags = array_merge($hashtags, $matches[0]);
            }
        }

        return $hashtags;
    }

    /**
     * @return string[]
     * @throws GuzzleException
     */
    public function getWallPostsTexts(): array
    {
        $userIds = $this->getGroupMemberIds();

        $texts = [];
        foreach ($userIds as $userId)
        {
            $wallData = $this->getWallPostsDataByUserId($userId);
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
                    $texts[] = $text;
                }
            }
        }

        return $texts;
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

//    /**
//     * @return User[]
//     * @throws GuzzleException
//     */
//    private function getUsersWithoutWallPosts(): array
//    {
//        $response = $this->adapter->getUsersData($this->getGroupMemberIds());
//
//        $users = [];
//        foreach ($response['response'] as $user)
//        {
//            if (!$user['is_closed'])
//            {
//                $users[] = new User(
//                    id: $user['id'],
//                    firstName: $user['first_name'],
//                    lastName: $user['last_name'],
//                );
//            }
//        }
//
//        return $users;
//    }

    /**
     * @return int[]
     * @throws GuzzleException
     */
    private function getGroupMemberIds(): array
    {
        $allMembers = [];
        $offset = 0;
        $count = 500;

        do {
            $groupMembers = $this->adapter->getGroupMembers(self::ISPRING_INSTITUTE_GROUP_ID, $offset, $count);
            $members = $groupMembers['response']['items'];

            $allMembers = array_merge($allMembers, $members);

            $offset += $count;
        } while (count($members) > 0);

        return array_values($allMembers);
    }
}