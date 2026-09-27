# Run — Sai Shreyas Animated Portfolio

Static site: plain HTML/CSS/JS (no build, no npm). Served with Python's built-in HTTP server.

## Reproduce artifacts

Nothing to generate — assets are committed in `assets/`:

- `assets/social-media-bg.mp4` — Social Creatives tile video (copied from user's Downloads)
- `assets/infosphere-news.jpg`, `assets/netflix-collage.jpg`, `assets/dentage-xray.jpg` — project card images
- No `.env` files, no dependency install needed.

## Run the server

Port 5500 must be free. From the project root:

```
python -m http.server 5500
```

Detached (Windows PowerShell) — stdout and stderr must go to different files:

```
powershell -NoProfile -Command "(Start-Process -FilePath 'python.exe' -ArgumentList '-m','http.server','5500' -RedirectStandardOutput '.freebuff\preview.log' -RedirectStandardError '.freebuff\preview.log.err' -WindowStyle Hidden -PassThru).Id"
```

Then verify: `curl -s -o /dev/null -w "%{http_code}" http://localhost:5500/index.html` → expect `200`.

Open http://localhost:5500/index.html

## Notes

- Two `python http.server` processes may legitimately coexist on Windows (IPv4 + IPv6 sockets); either serves the site.
- If 5500 is taken, run `python -m http.server 5510` and use that port instead.
- Cache-busting: `index.html` references `style.css?v=N` and `script.js?v=N`; bump N after styling/JS changes so browsers pick them up.
