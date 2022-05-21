# (WIP) noreman
Clone of [goreman](https://github.com/mattn/goreman) written in Node.js.

status of WIP.


## Development

We use [@swc-node/register](https://www.npmjs.com/package/@swc-node/register) to run everything in development with ts.

Executes all commands defined in Procfile and displays output.

The RPC server used by noreman is also started in the background.  
It is possible to communicate instructions to noreman by hitting commands from another terminal.

```sh
yarn dev start
```


Checks the current process status.
Running processes are marked with `*`.

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
