# `gu`

> Experimental script runner, inspired by
> [`make`](https://www.gnu.org/software/make/manual/make.html) and GitHub's
> [Scripts To Rule Them All](https://github.com/github/scripts-to-rule-them-all).

> [!NOTE]
>
> _This is still very much in development, although it should work…_
>
> _If you find a bug, please
> [open an issue](https://github.com/guardian/gu/issues)._

## What is it?

A CLI application that wraps a layer of developer-convenience around running
`./scripts/*`.

It's intended for human's to use while working, rather than for CI systems etc.

### What does it offer?

- ability to define `makefile`-style dependencies in a `./gu.config.ts`
- can discover and list all available scripts for the current directory
- run multiple scripts at once (in series only, for now)
- provides visual feedback on what it's doing in your terminal

It also comes with some helper functions for a `gu.config.ts` that standardise
some common tasks (e.g. checking the current Node version) – see below.

### Screenshot

<img src="assets/screenshot.png" width="681" alt="screenshot of gu running" >

### What can it run?

If a file is executable and lives in `./scripts`, `gu` can run it.

#### Example

```sh
.scripts/
├── build.mjs #!/usr/bin/env node
├── lint      #!/usr/bin/env ruby
└── test      #!/usr/bin/env bash
```

Now you can run:

```sh
gu lint test build
```

> Note that file extensions are ignored by `gu`, so having both `lint.rb` and
> `lint.mjs` would throw an error.

## Installation

> For now, you'll need to install `gu` using Deno. See
> [deno.land](https://docs.deno.com/runtime/manual/getting_started/installation)
> if you need to install Deno as well.

```sh
deno install --allow-read --allow-run https://deno.land/x/gu_cli/gu.ts
```

## Usage

```sh
gu <script_name> [<script_name> ...] [-- args...]
```

#### Examples

```sh
# runs ./scripts/test
gu test
```

You can run multiple scripts:

```sh
# runs ./scripts/test and ./scripts/lint serially, in order
gu test lint
```

> [!NOTE] Like `make` (which inspired it), `gu` will only run a script once. So
> running `gu test lint test` is no different to running `gu test lint`.

You can pass arguments to individual scripts by quoting them:

```sh
gu test 'lint --cache'
```

You can pass arguments to all scripts by passing them after `--`:

```sh
gu test lint -- --cache
```

You can also provide globs:

```sh
gu 'build-*' # run all scripts in ./scripts/ that start with "build-"
gu '**/test' # run all 'test' scripts in ./scripts/, including subdirectories
gu '**/*'    # run all scripts in ./scripts
```

### Flags

#### `--list`, `-l`

List all available tasks in the current directory.

#### `--help`, `-h`

Show help.

#### `--version`, `-v`

Show the version number.

## Configuration

You can optionally define a `gu.config.ts` file in the root of your project.
This allows you to enhance the behaviour of the raw scripts while working with
them.

### Descriptions

You can define descriptions for scripts in the config file. This will be used
when running `gu --list` to describe them to users.

#### Example

```ts
// gu.config.ts
export default {
	'build': {
		description: 'Builds the project and the internal libraries it depends on.',
	},
} satisfies Config;
```

### Dependencies

You can define dependencies between scripts, like in a `makefile`.

#### Example

```ts
// gu.config.ts
export default {
	'build': { dependencies: ['test'] },
} satisfies Config;
```

Now `gu build` will run `./scripts/test` then `./scripts/build`.

Dependencies can also be TypeScript (or JavaScript) async functions:

```ts
// gu.config.ts

const cleanDist = async () => {};

export default {
	'build': { dependencies: [cleanDist] },
} satisfies Config;
```

Now `gu build` will call `cleanDist` then run `./scripts/build`.

Keys in the config file are the names of scripts, and like the CLI, they can be
globs:

```ts
// gu.config.ts
export default {
	'*': { dependencies: ['test'] },
	'build-*': { dependencies: [beforeBuild] },
} satisfies Config;
```

Now `gu build-foo` will run `./scripts/test`, call `beforeBuild` then run
`./scripts/build-foo`.

> [!NOTE] As with the CLI (and `make`), `gu` will only run a dependency once.
> So, given the example above, running `gu test build` will still only `test`
> run once.

### Helpers

`gu` provides some helpers for common tasks in the config file.

#### `checkNode`

Ensures the current Node version matches the one in your `.nvmrc`.

```ts
// gu.config.ts
import { checkNode } from 'https://deno.land/x/gu_cli/helpers/check-node.ts';

export default {
	'*': { dependencies: [checkNode] },
} satisfies Config;
```

_More helpers to come..._

## Why would I want this?

Currently, projects at the Guardian define tasks in a variety of ways:
[`makefile`](https://www.gnu.org/software/make/manual/make.html)s,
[`npm-scripts`](https://docs.npmjs.com/cli/v10/using-npm/scripts),
[shell scripts](https://en.wikipedia.org/wiki/Shell_script),
[`sbt`](https://www.scala-sbt.org/) (and probably more) are all in use across
our projects – often in the same project.

> For example, in DCR
> [right now](https://github.com/guardian/dotcom-rendering/tree/3392b7b893a6773d039e110f5837bc6f23b7d9f1),
> we use a mix of executable and non-executable files in `scripts` directories,
> a `makefile` and `npm-scripts` in multiple `package.json`s. CI workflows use a
> mixture of calls to those and direct calls to commands.

This creates a steep learning curve for newcomers to the project, and adds
complexity and confusion for people working on the project's workflows.

### Predictability aids productivity

The idea behind GitHub's
[Scripts To Rule Them All](https://github.com/github/scripts-to-rule-them-all)
is to standardise these kinds of tasks.

This means that people who know a project well can manage all the complexity of
running it (installing dependencies/runtimes, starting servers, running tests
etc), while people who don't can expect a standard set of scripts that abstract
that detail away.

> GitHub mandate a set of common scripts too. This is good if all your
> applications are similar, but many of ours are not. We have a range of stacks
> and configurations across multiple applications, and requiring a set of
> standard scripts for all of them would be too restrictive.

### Why `scripts`?

By standardising on writing executable scripts, we can (hopefully) make these
tasks:

1. easy to discover (all in one place)
2. simple to run (you just run the script)
3. flexible to write (much more so than, for example, `npm-scripts`)

### Why not just run them directly?

You can! That's part of the point.

`gu` is intended to ease pain-points that arise in development. If you (or your
project) don't feel that pain, you don't need it!

For example, in some projects, dependencies change frequently enough (and
between branches) that things frequently seem to break in development.

In this case, you might want to ensure you run `npm install` before running
anything in `./scripts`.

`gu` can help you do that.

But in CI, you only probably only need to run `npm install` once. Running it
every time you run a script would be wasteful.

In that case it makes more sense to do it once explicitly and then run
`./scripts/test` etc directly.

_That's the thinking, anyway..._

## Development

You will need Deno. See [deno.land](https://deno.land) for more information.

While developing, you can install `gu` from disk by running:

```sh
deno install --allow-read --allow-run gu.ts
```

Now running `gu` will use your local copy.
