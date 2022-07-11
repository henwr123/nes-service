#!/usr/bin/env sh

# Creates the nes-games database with the initialization DB SQL
sqlite3 -batch "$PWD/nes-games.sqlite" <"$PWD/initdb.sql"