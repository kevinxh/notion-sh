oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g notion-sh
$ notionsh COMMAND
running command...
$ notionsh (--version)
notion-sh/0.0.0 darwin-x64 node-v18.18.2
$ notionsh --help [COMMAND]
USAGE
  $ notionsh COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`notionsh hello PERSON`](#notionsh-hello-person)
* [`notionsh hello world`](#notionsh-hello-world)
* [`notionsh help [COMMANDS]`](#notionsh-help-commands)
* [`notionsh plugins`](#notionsh-plugins)
* [`notionsh plugins:install PLUGIN...`](#notionsh-pluginsinstall-plugin)
* [`notionsh plugins:inspect PLUGIN...`](#notionsh-pluginsinspect-plugin)
* [`notionsh plugins:install PLUGIN...`](#notionsh-pluginsinstall-plugin-1)
* [`notionsh plugins:link PLUGIN`](#notionsh-pluginslink-plugin)
* [`notionsh plugins:uninstall PLUGIN...`](#notionsh-pluginsuninstall-plugin)
* [`notionsh plugins:uninstall PLUGIN...`](#notionsh-pluginsuninstall-plugin-1)
* [`notionsh plugins:uninstall PLUGIN...`](#notionsh-pluginsuninstall-plugin-2)
* [`notionsh plugins update`](#notionsh-plugins-update)

## `notionsh hello PERSON`

Say hello

```
USAGE
  $ notionsh hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/kevinxh/notion-sh/blob/v0.0.0/src/commands/hello/index.ts)_

## `notionsh hello world`

Say hello world

```
USAGE
  $ notionsh hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ notionsh hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/kevinxh/notion-sh/blob/v0.0.0/src/commands/hello/world.ts)_

## `notionsh help [COMMANDS]`

Display help for notionsh.

```
USAGE
  $ notionsh help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for notionsh.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_

## `notionsh plugins`

List installed plugins.

```
USAGE
  $ notionsh plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ notionsh plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/index.ts)_

## `notionsh plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ notionsh plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ notionsh plugins add

EXAMPLES
  $ notionsh plugins:install myplugin 

  $ notionsh plugins:install https://github.com/someuser/someplugin

  $ notionsh plugins:install someuser/someplugin
```

## `notionsh plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ notionsh plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ notionsh plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/inspect.ts)_

## `notionsh plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ notionsh plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ notionsh plugins add

EXAMPLES
  $ notionsh plugins:install myplugin 

  $ notionsh plugins:install https://github.com/someuser/someplugin

  $ notionsh plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/install.ts)_

## `notionsh plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ notionsh plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help      Show CLI help.
  -v, --verbose
  --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ notionsh plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/link.ts)_

## `notionsh plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ notionsh plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ notionsh plugins unlink
  $ notionsh plugins remove
```

## `notionsh plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ notionsh plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ notionsh plugins unlink
  $ notionsh plugins remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/uninstall.ts)_

## `notionsh plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ notionsh plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ notionsh plugins unlink
  $ notionsh plugins remove
```

## `notionsh plugins update`

Update installed plugins.

```
USAGE
  $ notionsh plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/update.ts)_
<!-- commandsstop -->
