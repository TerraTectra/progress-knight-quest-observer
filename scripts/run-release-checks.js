const childProcess = require("child_process")
const fs = require("fs")
const http = require("http")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const DEFAULT_PORT = Number(process.env.RELEASE_CHECK_PORT || 8124)
const DEFAULT_URL = process.env.TEST_URL || `http://127.0.0.1:${DEFAULT_PORT}/`

const scripts = [
    "save-compatibility.js",
    "meta-path-smoke.js",
    "regression-tabs.js",
    "release-stability.js",
    "long-idle-stress.js",
]

function listFiles(dir, suffix) {
    return fs.readdirSync(path.join(ROOT, dir))
        .filter(file => file.endsWith(suffix))
        .map(file => path.join(dir, file))
        .sort()
}

function mergedEnv(extra = {}) {
    const nodeModules = path.resolve(path.dirname(process.execPath), "..", "node_modules")
    const existingNodePath = process.env.NODE_PATH || ""
    const separator = process.platform == "win32" ? ";" : ":"
    const nodePath = fs.existsSync(nodeModules)
        ? existingNodePath
            ? `${existingNodePath}${separator}${nodeModules}`
            : nodeModules
        : existingNodePath

    return {
        ...process.env,
        NODE_PATH: nodePath,
        TEST_URL: DEFAULT_URL,
        ...extra,
    }
}

function run(command, args, options = {}) {
    const label = [command, ...args].join(" ")
    console.log(`\n> ${label}`)
    const result = childProcess.spawnSync(command, args, {
        cwd: ROOT,
        env: mergedEnv(options.env || {}),
        stdio: "inherit",
        shell: false,
    })

    if (result.error)
        throw result.error
    if (result.status !== 0)
        throw new Error(`${label} failed with exit code ${result.status}`)
}

function contentType(filePath) {
    const ext = path.extname(filePath).toLowerCase()
    if (ext == ".html")
        return "text/html; charset=utf-8"
    if (ext == ".js")
        return "text/javascript; charset=utf-8"
    if (ext == ".css")
        return "text/css; charset=utf-8"
    if (ext == ".json")
        return "application/json; charset=utf-8"
    if (ext == ".png")
        return "image/png"
    if (ext == ".jpg" || ext == ".jpeg")
        return "image/jpeg"
    if (ext == ".ico")
        return "image/x-icon"
    return "application/octet-stream"
}

function createStaticServer() {
    return http.createServer((request, response) => {
        try {
            const url = new URL(request.url, DEFAULT_URL)
            const decodedPath = decodeURIComponent(url.pathname)
            const relativePath = decodedPath == "/" ? "index.html" : decodedPath.replace(/^\/+/, "")
            const filePath = path.resolve(ROOT, relativePath)

            if (!filePath.startsWith(ROOT)) {
                response.writeHead(403)
                response.end("Forbidden")
                return
            }

            if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
                response.writeHead(404)
                response.end("Not found")
                return
            }

            response.writeHead(200, { "Content-Type": contentType(filePath) })
            fs.createReadStream(filePath).pipe(response)
        } catch (error) {
            response.writeHead(500)
            response.end(error.message)
        }
    })
}

async function startServerIfNeeded() {
    if (process.env.TEST_URL)
        return null

    const server = createStaticServer()
    return await new Promise(resolve => {
        server.once("error", error => {
            if (error.code == "EADDRINUSE") {
                console.log(`Port ${DEFAULT_PORT} is already in use; using existing server at ${DEFAULT_URL}`)
                resolve(null)
                return
            }
            throw error
        })
        server.listen(DEFAULT_PORT, "127.0.0.1", () => {
            console.log(`Serving ${ROOT} at ${DEFAULT_URL}`)
            resolve(server)
        })
    })
}

async function main() {
    const server = await startServerIfNeeded()
    try {
        for (const file of [...listFiles("js", ".js"), ...listFiles("scripts", ".js")])
            run(process.execPath, ["--check", file])

        for (const script of scripts)
            run(process.execPath, [path.join("scripts", script)])

        run("git", ["diff", "--check"])
        console.log("\nRelease checks passed.")
    } finally {
        if (server != null)
            await new Promise(resolve => server.close(resolve))
    }
}

main().catch(error => {
    console.error(`\nRelease checks failed: ${error.stack || error.message}`)
    process.exit(1)
})
