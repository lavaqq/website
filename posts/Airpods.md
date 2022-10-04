---
title: Connecter ses Airpods à un PC sous ArchLinux
date: 2022-07-12
cover: ./img/airpods.webp
tags: [arch, linux, tips, airpods]
published: true
---
# Connecter ses Airpods à un PC sous ArchLinux
Voici les commandes pour connecter ses Airpods à un PC sous ArchLinux
```bash
pacman -S bluetoothctl pulseaudio pavucontrol pulseaudio-alsa pulseaudio-bluetooth bluez-utils
systemctl start bluetooth.service
pulseaudio -k
bluetoothctl
# in bluetoothctl
power on
agent on
default-agent
scan on
# AirPods in case with the lid open and keep the button the light flashes white.
# You should see this ↓
# [NEW] Device "DEVICE ID" "name" AirPods
pair "DEVICE ID"
connect "DEVICE ID"
trust "DEVICE ID"
```