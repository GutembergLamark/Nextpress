#!/usr/bin/env bash

PACKS=$(composer show -ND --no-dev | xargs echo)
ALL_PACKS=$(composer show -ND  | xargs echo)

DEV_PACKS=$(composer show -s | sed -n '/requires (dev)$/,/^$/p' | grep -v 'requires (dev)' | cut -d ' ' -f1)
echo $DEV_PACKS

composer remove $ALL_PACKS;
rm composer.lock;
composer require $PACKS;
rm composer.lock;
composer require --dev $DEV_PACKS;
#echo $ALL_PACKS | xargs -I _ sh -c "echo _"


