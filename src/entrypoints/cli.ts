/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import { Command } from "commander";

import { VERSION } from "../version";

const program = new Command();
program
  .name("secret-me")
  .description("Flags secrets, tokens and passwords before they leave your machine")
  .version(VERSION);
program.parse();
