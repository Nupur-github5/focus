# Focus

A calm, distraction-free Pomodoro timer. Open it and start focusing. 🍅

## What it does

- Focus, short break and long break sessions with a timer you can adjust
- A simple task list, so you can see how many pomodoros each task took
- Stats for today, this week, the last 7 days, and your current streak
- Light/dark theme, sound and notifications, keyboard shortcuts (press `?`)
- Installable as an app (PWA) and works offline

**No account needed.** There's no sign-up and no server-side database. Your tasks, settings and history are saved in your own browser (localStorage). They stay on that device, and clearing your browser data clears them too.

## Run it yourself

You'll need [Node.js](https://nodejs.org/) 20 or newer.

```bash
git clone https://github.com/Nupur-github5/focus.git
cd focus
npm install
npm run dev
```

Then open http://localhost:3000. There are no environment variables to set.

Other useful commands:

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run test        # unit tests (Vitest)
npm run test:e2e    # end-to-end test (Playwright)
```

## Deploy your own on Vercel

1. Fork https://github.com/Nupur-github5/focus on GitHub.
2. In [Vercel](https://vercel.com/new), click **Add New → Project** and import your fork.
3. Keep the default settings (Vercel detects Next.js) and click **Deploy**.
4. Optional: in your project, open the **Analytics** tab and enable Web Analytics to see page views. The `<Analytics />` component is already set up.

No database or environment variables are needed.

## Contributing

Issues and pull requests are welcome! For anything bigger than a small fix, please open an issue first so we can talk it over. Before you open a PR, run `npm run lint`, `npm run typecheck` and `npm run test`.

## License

[MIT](LICENSE)
