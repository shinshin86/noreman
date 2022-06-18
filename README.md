# (WIP) noreman

[![Test](https://github.com/shinshin86/noreman/actions/workflows/test.yml/badge.svg)](https://github.com/shinshin86/noreman/actions/workflows/test.yml)

Clone of [goreman](https://github.com/mattn/goreman) written in Node.js.

status of WIP.


## Development

We use [@swc-node/register](https://www.npmjs.com/package/@swc-node/register) to run everything in development with `.ts`.

### start

Executes all commands defined in Procfile and displays output.

```sh
# Procfile must exist in the current directory.
yarn dev start
```

Or, by reading the file `.noreman.json`, you can change the startup path, etc.

example: `.noreman.json`

```json
{
    "procfile": "Procfile",
    "port": 5000,
    "baseDir": "_example",
    "basePort": 5000
}
```

When executing, pass the path to `.noreman.json` with the `-c` option.

```sh
yarn dev start -c .noreman.json
```

When use `start` command then RPC server used by noreman is also started in the background.
It is possible to communicate instructions to noreman by hitting `run <command>` commands from another terminal.

### run list

Checks the current process status.

```sh
yarn dev run list

# display pid option
yarn dev run list -p # or --pid
```

### run restart

Restart a specific process.

```sh
yarn dev run restart foo
```

### run stop

Stop a specific process.

```sh
yarn dev run stop foo
```

### run start

Start a specific process.

```sh
yarn dev run start foo
```


## TODO

[Create a todo item in the issue](https://github.com/shinshin86/noreman/issues?q=is%3Aissue+is%3Aopen+%22TODO%3A%22)