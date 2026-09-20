package com.hotpesa.edge.server

import java.net.InetAddress
import java.net.ServerSocket
import java.net.Socket
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

/** A deliberately narrow development HTTP server. It exposes only GET /edge/v1/health. */
class EdgeHttpServer(
    private val bindAddress: String,
    private val requestedPort: Int,
) : LocalEdgeServer {
    private val executor: ExecutorService = Executors.newSingleThreadExecutor { runnable ->
        Thread(runnable, "hotpesa-edge-http").apply { isDaemon = true }
    }
    @Volatile private var serverSocket: ServerSocket? = null
    @Volatile private var healthResponse: (() -> String)? = null

    override val port: Int?
        get() = serverSocket?.localPort

    @Synchronized
    override fun start(healthResponse: () -> String) {
        check(serverSocket == null) { "Local edge server is already running." }
        this.healthResponse = healthResponse
        serverSocket = ServerSocket(requestedPort, 50, InetAddress.getByName(bindAddress))
        executor.execute {
            while (true) {
                val socket = try {
                    serverSocket?.accept() ?: return@execute
                } catch (_: Exception) {
                    return@execute
                }
                socket.use(::respond)
            }
        }
    }

    @Synchronized
    override fun stop() {
        serverSocket?.close()
        serverSocket = null
        healthResponse = null
    }

    private fun respond(socket: Socket) {
        val requestLine = socket.getInputStream().bufferedReader().readLine().orEmpty()
        val body = if (requestLine.startsWith("GET /edge/v1/health ")) healthResponse?.invoke() else null
        val response = if (body == null) {
            "HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\nConnection: close\r\n\r\n"
        } else {
            "HTTP/1.1 200 OK\r\nContent-Type: application/json; charset=utf-8\r\nContent-Length: ${body.toByteArray().size}\r\nConnection: close\r\n\r\n$body"
        }
        socket.getOutputStream().bufferedWriter().use { it.write(response) }
    }
}
