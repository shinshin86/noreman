# (WIP) noreman

[![Test](https://github.com/shinshin86/noreman/actions/workflows/test.yml/badge.svg)](https://github.com/shinshin86/noreman/actions/workflows/test.yml)

Clone of [goreman](https://github.com/mattn/goreman) written in Node.js.

status of WIP.


## Development

We use [@swc-node/register](https://www.npmjs.com/package/@swc-node/register) to run everything in development with `.ts`.

Executes all commands defined in Procfile and displays output.

```sh
yarn dev start
```

When use `start` command then RPC server used by noreman is also started in the background.
It is possible to communicate instructions to noreman by hitting `run <command>` commands from another terminal.


Checks the current process status.

```sh
yarn dev run list
```

Restart a specific process.

```sh
yarn dev run restart foo
```

Stop a specific process.

```sh
yarn dev run stop foo
```

Start a specific process.

```sh
yarn dev run start foo
```
