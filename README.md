# `gu`

> PoC of a Guardian task runner, in the style of our [ergonomic but unorthodox uses of `make`](https://github.com/guardian/dotcom-rendering/blob/dc76d6b6676222d23ade13ede7282bd506470679/dotcom-rendering/makefile).

The idea is to standardise how and where we define project tasks, and to
make them:

1. flexible to write
2. easy to discover
3. simple to run

It's inspired by a lot of prior art, especially GitHub's [Scripts To Rule Them All](https://github.com/github/scripts-to-rule-them-all).

## Usage

> The examples assume the project is real, published and then installed locally.
>
> In this repo you can run `./gu` instead.

#### Example

```sh
# lists the project's tasks
gu

# runs tasks
gu <task> [args...] [<task> [args...]...]
```

## Tasks

Tasks are any executable files that live in the `./scripts` directory.

#### Example

```sh
.gu/
├── build #!/usr/bin/env node
├── lint  #!/usr/bin/env ruby
└── test  #!/bin/sh
```

Now you can run:

```sh
gu build
gu lint
gu test

# or run multiple tasks
gu lint test build
```

etc.

### Flags

Flags can be passed to tasks. They are passed to the directly preceding task.

#### Example

```
gu lint -q -s test -w
```

1. `lint` would receive `-q` and `-s` flags
2. `test` would receive a `-w` flag
