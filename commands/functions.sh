#!/usr/bin/env bash

f_version="2.1.0"
f_authors="Marcos Freitas, Yuri Koster";


# colors
# Black        0;30     Dark Gray     1;30
# Red          0;31     Light Red     1;31
# Green        0;32     Light Green   1;32
# Brown/Orange 0;33     Yellow        1;33
# Blue         0;34     Light Blue    1;34
# Purple       0;35     Light Purple  1;35
# Cyan         0;36     Light Cyan    1;36
# Light Gray   0;37     White         1;37

RED='\033[0;31m';
CYAN='\033[0;36m';
YELLOW='\033[1;33m';

# No Color
NC='\033[0m';

SUDO=''
if (( $EUID != 0 )); then
    SUDO='sudo'
fi
#
# Common functions used into configuration.sh files for All Images
#
# Receive a current count number on position $1;
# Receive a function name on position $2;
# not using but $0 is the name of the script itself;
function Count() {

    # check if position $1 exists
    if [ -z "$1" ]; then
        echo "Expected param 1";
        exit 0;
    fi

    if [ -z "$2" ]; then
        echo "Expected param 2";
        exit 0;
    fi

    if [ ${1} -ge 1 ]; then
        count=$1;
    fi

    if [ ${count} -le 3 ]; then
        echo -e ${RED};
        printf "\nUma saída inesperada ocorreu durante a última instrução, mas tudo pode estar bem.\nDeseja executar novamente o processo $2?\n"
        echo -e ${NC};
        read -n1 -r -p "Pressione S para continuar ou N para cancelar: " key

        # $key is empty when ENTER/SPACE is pressed
        if [ "$key" = 'S' -o "$key" = 's' ]; then
            echo -e ${CYAN};
            echo "Tentativa " ${count} " de 3...";
            echo -e ${NC};
            ${2} $((count += 1));
        else
            return 1;
        fi

    else
        echo "Não foi possível realizar a operação em $2, abortando o processo";
    fi
}

# receive the output string on position $1 and a optional color on position $2
# version 1.1.0
function Separator() {
    echo '';
    echo '';

    # if $2 is empty
    if [ -z "$2" ]; then
        echo -e ${YELLOW};
    else
        echo -e ${2};
    fi

    echo '::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::';
    echo ' ' $1;
    echo '::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::';
    echo -e ${NC};
    echo '';
    echo '';
}

# wait a key press to continue the process
# version 1.0.0
function PressKeyToContinue() {
    printf "\n";
    read -n1 -r -p "Pressione S para continuar ou qualquer outra tecla para cancelar a execução do script: " key

    if [ "$key" = 'S' -o "$key" = 's' ]; then
        # $key is empty when ENTER/SPACE is pressed
        return 1;
    else
        exit 1;
    fi
}

# change values into configuration files. Receives $key $separator $value $file
# version 1.0.0
function changeValueConfig(){
    {
        $SUDO sed  -i "s|\('$1' *'$2'*\).*|\1'$3'|" '$4';
        Separator 'sed  -i "s|\('$1' *'$2'*\).*|\1'$3'|" '$4';';
    } || {
        Count $1 'ChangeValueConfig';
    }
}

function AptUpdate() {
    printf "\nAtualizando repositórios...\n";
    $SUDO apt-get -y update;
}

function AptUpgrade() {
    printf "\nAtualizando os pacotes...\n";
    $SUDO apt-get -y upgrade;
}

# Define the dialog exit status codes
: ${DIALOG_OK=0}
: ${DIALOG_CANCEL=1}
: ${DIALOG_HELP=2}
: ${DIALOG_EXTRA=3}
: ${DIALOG_ITEM_HELP=4}
: ${DIALOG_ESC=255}


Separator "Using functions.sh version $f_version | Authors: $f_authors" ${CYAN};