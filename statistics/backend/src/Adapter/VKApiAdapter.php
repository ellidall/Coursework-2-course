<?php
declare(strict_types=1);

namespace App\Adapter;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

class VKApiAdapter
{
    private const BASE_URI = 'https://api.vk.com/method/';
    private const VK_API_VERSION = '5.199';
    private Client $client;
    private string $accessToken;

    public function __construct($accessToken)
    {
        $this->client = new Client(['base_uri' => self::BASE_URI]);
        $this->accessToken = $accessToken;
    }

    /**
     * @param string $groupId
     * @param ?int $offset
     * @param ?int $count
     * @return array
     * @throws GuzzleException
     */
    public function getGroupMembers(string $groupId, ?int $offset = 0, ?int $count = 500): array
    {
        $response = $this->client->request('GET', 'groups.getMembers', [
            'query' => [
                'group_id' => $groupId,
                'offset' => $offset,
                'count' => $count,
                'access_token' => $this->accessToken,
                'v' => self::VK_API_VERSION,
            ],
            'curl' => [
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => 0,
            ]
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }

    /**
     * @param array $userIds
     * @return array
     * @throws GuzzleException
     */
    public function getUsersData(array $userIds): array
    {
        $allUserData = [];
        $chunkSize = 200;

        $chunks = array_chunk($userIds, $chunkSize);

        foreach ($chunks as $chunk) {
            $response = $this->client->request('GET', 'users.get', [
                'query' => [
                    'user_ids' => implode(',', $chunk),
                    'access_token' => $this->accessToken,
                    'v' => self::VK_API_VERSION,
                ],
                'curl' => [
                    CURLOPT_SSL_VERIFYPEER => false,
                    CURLOPT_SSL_VERIFYHOST => 0,
                ]
            ]);

            $data = json_decode($response->getBody()->getContents(), true);

            if (isset($data['response'])) {
                $allUserData = array_merge($allUserData, $data['response']);
            }
        }

        return $allUserData;
//
//        $response = $this->client->request('GET', 'users.get', [
//            'query' => [
//                'user_ids' => implode(',', $userIds),
//                'access_token' => $this->accessToken,
//                'v' => self::VK_API_VERSION,
//            ],
//            'curl' => [
//                CURLOPT_SSL_VERIFYPEER => false,
//                CURLOPT_SSL_VERIFYHOST => 0,
//            ]
//        ]);
//
//        return json_decode($response->getBody()->getContents(), true);
    }

    /**
     * @param int $ownerId
     * @param int $offset
     * @param int $count
     * @return array
     * @throws GuzzleException
     */
    public function getWallPosts(int $ownerId, int $offset = 0, int $count = 0): array
    {
        $response = $this->client->request('GET', 'wall.get', [
            'query' => [
                'owner_id' => $ownerId,
                'offset' => $offset,
                'count' => $count,
                'access_token' => $this->accessToken,
                'v' => self::VK_API_VERSION,
            ],
            'curl' => [
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => 0,
            ]
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }
}
