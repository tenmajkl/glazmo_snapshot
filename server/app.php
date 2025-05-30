<?php

use Workerman\Connection\ConnectionInterface;
use Workerman\Worker;

require __DIR__.'/vendor/autoload.php';

$worker = new Worker("ws://localhost:8001");

$portals = [];

$worker->onMessage = function(ConnectionInterface $connection, string $data) use ($portals, $password) {
    $message = json_decode($data, true);
    if ($message == null) {
        $connection->send("U DONT RESPECT THE PROTOCOL, EXECUTION DATE: ".(new DateTime())->setTimestamp(microtime() + rand(1000, 100000000000))->format(DATE_ISO8601));
        return;
    }

    $type = $message['TYPE'] ?? null;

    if ($type === null) {
        $connection->send("U DONT RESPECT THE PROTOCOL, EXECUTION DATE: ".(new DateTime())->setTimestamp(microtime() + rand(1000, 100000000000))->format(DATE_ISO8601));
        return;
    }

    if ($type === 'LOGIN') {
        $portals[] = $connection;

        return;
    }

    if ($type === 'EMIT') {
        foreach ($portals as $portal) {
            $portal->send($data);
        }

        return;
    }

    $connection->send("U DONT RESPECT THE PROTOCOL, EXECUTION DATE: ".(new DateTime())->setTimestamp(microtime() + rand(1000, 100000000000))->format(DATE_ISO8601));
};

$worker->onClose = function(ConnectionInterface $connection) use ($portals) {
    foreach ($portals as $index => $portal) {
        if ($portal == $connection) {
            unset($portals[$index]);
        }
        
    }
};

Worker::runAll();
