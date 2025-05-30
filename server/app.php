<?php

use Workerman\Worker;

require __DIR__.'/vendor/autoload.php';

$worker = new Worker("ws://localhost:8001");

