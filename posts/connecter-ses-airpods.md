---
title: Connecter ses Airpods à un PC sous Arch Linux
summary: "Voici les étapes pour connecter ses Airpods à un PC sous Arch Linux"
date: 2022-10-04
cover: ./img/posts/airpods/airpods.webp
tags: [Arch, Linux]
published: true
---
Voici les étapes pour connecter ses Airpods à un PC sous Arch Linux :
##### Installer les paquets nécessaires
```bash
pacman -S bluetoothctl pulseaudio pavucontrol pulseaudio-alsa pulseaudio-bluetooth bluez-utils
```
##### Démarrer le service Bluetooth et redémarrer PulseAudio
```bash
systemctl start bluetooth.service
pulseaudio -k
```
##### Connecter les Airpods au PC avec BluetoothCTL
> Les Airpods doivent être dans le boîtier ouvert en mode jumelage!
```bash
bluetoothctl
power on
agent on
default-agent
scan on
# Vous allez voir ceci ↓↓↓
# [NEW] Device "DEVICE ID" "name" AirPods
# Faites les commandes suivante avec le "DEVICE ID" de vos Airpods
pair "DEVICE ID"
connect "DEVICE ID"
trust "DEVICE ID"
```
##### Vérifier dans pavucontrol
```bash
pavucontrol
```
Si dans l'onglet `output` vos Airpods apparaissent tout est bon!