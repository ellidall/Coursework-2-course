<?php
declare(strict_types=1);

namespace App\Controller;

use App\Service\VKService;
use GuzzleHttp\Exception\GuzzleException;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class VKController extends AbstractController
{

    private VKService $service;

    public function __construct()
    {
        $this->service = new VKService();
    }

    public function getGroupMembers(): Response
    {
//        try
//        {
            $walls = $this->service->getHashtags();
            var_dump($walls);
            return $this->json($walls);
//        }
//        catch (GuzzleException $e)
//        {
//            return new Response('Ошибка при выполнении запроса', Response::HTTP_INTERNAL_SERVER_ERROR);
//        }
//        catch (Exception $e)
//        {
//            return new Response($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
//        }
    }
}