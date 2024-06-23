<?php
declare(strict_types=1);

namespace App\Controller;

use App\Common\Database\ConnectionProvider;
use App\Data\VertexData;
use App\Database\HashtagTable;
use App\Database\UserTable;
use App\Service\VKService;
use Exception;
use GuzzleHttp\Exception\GuzzleException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class VKController extends AbstractController
{

    private VKService $service;
    private HashtagTable $hashtagTable;
    private UserTable $userTable;

    public function __construct()
    {
        $connectionProvider = new ConnectionProvider();
        $connection = $connectionProvider->getConnection();
        $this->hashtagTable = new HashtagTable($connection);
        $this->userTable = new UserTable($connection);
        $this->service = new VKService($this->userTable, $this->hashtagTable);
    }

    public function updateData(): Response
    {
        set_time_limit(1000 * 60);

        try
        {
            $this->service->updateData();
            return new Response('Success', Response::HTTP_OK);
        }
        catch (GuzzleException $e)
        {
            return new Response('Ошибка при выполнении запроса', Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        catch (Exception $e)
        {
            return new Response($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getGroupMembers(): Response
    {
        set_time_limit(1000 * 60);

        $vertexes = [];

        try {
            $users = $this->userTable->listAll();
            foreach ($users as $user) {
                $userId = $user->getId();
                $userName = $user->getFirstName() . ' ' . $user->getLastName() . ' (' . $userId . ')';
                $hashtagsData = $this->hashtagTable->findByUserId($userId);
                if ($hashtagsData) {
                    $hashtags = [];
                    foreach ($hashtagsData as $hashtag) {
                        $hashtagText = str_replace('_', '', $hashtag->getHashtag());
                            $hashtags[] = mb_strtolower($hashtagText);
                    }
                    $vertexes[] = new VertexData($userName, $hashtags);
                } else {
                    $vertexes[] = new VertexData($userName, []);
                }
            }
            return $this->json($vertexes);
        } catch (GuzzleException $e) {
            return new Response('Ошибка при выполнении запроса', Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (Exception $e) {
            return new Response($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}