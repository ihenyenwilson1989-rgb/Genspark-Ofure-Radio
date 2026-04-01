export function layout(content: string, title: string = 'OFURE RADIO'): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;700;800&display=swap" rel="stylesheet">
  <link href="/static/styles.css" rel="stylesheet">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
</head>
<body class="bg-neutral-950 text-white font-sans min-h-screen">
  ${content}
  <script src="/static/app.js"></script>
</body>
</html>`
}
