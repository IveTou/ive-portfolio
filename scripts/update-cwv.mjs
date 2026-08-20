import { createReadStream } from 'node:fs'
import { readFile, stat, writeFile } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as chromeLauncher from 'chrome-launcher'
import lighthouse, { desktopConfig } from 'lighthouse'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const INDEX_PATH = path.join(ROOT, 'index.html')
const DEFAULT_PORT = 4173
const DEFAULT_RUNS = 3

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

const METRICS = [
  ['lcp', 'largest-contentful-paint'],
  ['fcp', 'first-contentful-paint'],
  ['cls', 'cumulative-layout-shift'],
]

function parseArgs(argv) {
  const args = { runs: DEFAULT_RUNS, url: null, dryRun: false, port: DEFAULT_PORT }

  for (const arg of argv) {
    if (arg === '--dry-run') args.dryRun = true
    else if (arg.startsWith('--url=')) args.url = arg.slice('--url='.length)
    else if (arg.startsWith('--runs=')) args.runs = Number(arg.slice('--runs='.length))
    else if (arg.startsWith('--port=')) args.port = Number(arg.slice('--port='.length))
  }

  if (!Number.isInteger(args.runs) || args.runs < 1) {
    throw new Error('--runs must be a positive integer')
  }

  return args
}

function startServer(port) {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${port}`)
    let relative = decodeURIComponent(url.pathname)
    if (relative.endsWith('/')) relative += 'index.html'
    if (relative === '/') relative = '/index.html'

    const filePath = path.resolve(ROOT, `.${relative}`)
    if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
      res.writeHead(403).end()
      return
    }

    try {
      const info = await stat(filePath)
      if (!info.isFile()) {
        res.writeHead(404).end()
        return
      }

      res.writeHead(200, {
        'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      })
      createReadStream(filePath).pipe(res)
    } catch {
      res.writeHead(404).end()
    }
  })

  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, '127.0.0.1', () => resolve(server))
  })
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

function formatDuration(ms) {
  return `${(ms / 1000).toFixed(1)}s`
}

function formatCls(value) {
  return value.toFixed(2)
}

function formatMetric(key, value) {
  return key === 'cls' ? formatCls(value) : formatDuration(value)
}

function lighthouseFlags(port) {
  return {
    port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance'],
  }
}

const mobileConfig = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance'],
  },
}

async function collectFormFactor(url, chromePort, config, runs) {
  const samples = Object.fromEntries(METRICS.map(([key]) => [key, []]))

  for (let run = 1; run <= runs; run += 1) {
    const result = await lighthouse(url, lighthouseFlags(chromePort), config)
    if (!result?.lhr) {
      throw new Error('Lighthouse did not return a result')
    }

    for (const [key, auditId] of METRICS) {
      const audit = result.lhr.audits[auditId]
      if (typeof audit?.numericValue !== 'number') {
        throw new Error(`Missing ${auditId} on run ${run}`)
      }
      samples[key].push(audit.numericValue)
    }
  }

  return Object.fromEntries(
    METRICS.map(([key]) => [key, median(samples[key])])
  )
}

function replaceCwvText(html, key, value) {
  const pattern = new RegExp(`(data-cwv=['"]${key}['"][^>]*>)[^<]*`)
  if (!pattern.test(html)) {
    throw new Error(`index.html is missing data-cwv="${key}"`)
  }
  return html.replace(pattern, `$1${value}`)
}

function updateIndexHtml(html, metrics, updatedAt) {
  const date = updatedAt.toISOString().slice(0, 10)
  const formatted = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(updatedAt)

  let next = html.replace(
    /(<time data-cwv=['"]updated-at['"] datetime=['"])[^'"]*(['"][^>]*>)[^<]*/,
    `$1${date}$2${formatted}`
  )

  for (const formFactor of ['mobile', 'desktop']) {
    for (const [key] of METRICS) {
      next = replaceCwvText(
        next,
        `${key}-${formFactor}`,
        formatMetric(key, metrics[formFactor][key])
      )
    }
  }

  return next
}

function logMetrics(label, values) {
  const formatted = METRICS.map(([key]) => `${key.toUpperCase()} ${formatMetric(key, values[key])}`).join(' | ')
  console.log(`${label}: ${formatted}`)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  let server

  const url = args.url ?? `http://127.0.0.1:${args.port}/`
  if (!args.url) {
    server = await startServer(args.port)
  }

  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
    ],
  })

  try {
    console.log(`Auditing ${url} (${args.runs} run${args.runs === 1 ? '' : 's'} per form factor)`)
    const mobile = await collectFormFactor(url, chrome.port, mobileConfig, args.runs)
    const desktop = await collectFormFactor(url, chrome.port, desktopConfig, args.runs)
    const metrics = { mobile, desktop }

    logMetrics('Mobile', mobile)
    logMetrics('Desktop', desktop)

    const html = await readFile(INDEX_PATH, 'utf8')
    const next = updateIndexHtml(html, metrics, new Date())

    if (html === next) {
      console.log('Core Web Vitals are already up to date.')
      return
    }

    if (args.dryRun) {
      console.log('Dry run: index.html was not written.')
      return
    }

    await writeFile(INDEX_PATH, next)
    console.log(`Updated ${path.relative(ROOT, INDEX_PATH)}`)
  } finally {
    await chrome.kill()
    if (server) {
      await new Promise((resolve) => server.close(resolve))
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
