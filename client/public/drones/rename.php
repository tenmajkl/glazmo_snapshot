<?php

foreach (scandir(".") as $file) {
    if (!preg_match("/DRONES (\d+)-Audio.mp3.mp3/", $file, $matches)) {
        continue; 
    }

    rename($file, $matches[1].'.mp3');
}
