package com.hotpesa.edge.server

import com.hotpesa.edge.config.EdgeDevelopmentConfiguration
import com.hotpesa.edge.service.EdgeRuntime
import java.net.HttpURLConnection
import java.net.URL
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class EdgeHttpServerTest {
    @Test
    fun `health endpoint is available while runtime runs and survives restart`() {
        val server = EdgeHttpServer("127.0.0.1", 0)
        val runtime = EdgeRuntime(EdgeDevelopmentConfiguration(bindAddress = "127.0.0.1", port = 8787, appVersion = "test"), server)

        runtime.start()
        val firstPort = requireNotNull(server.port)
        assertHealth(firstPort)
        runtime.stop()
        assertUnavailable(firstPort)

        runtime.start()
        assertHealth(requireNotNull(server.port))
        runtime.stop()
    }

    private fun assertHealth(port: Int) {
        val connection = URL("http://127.0.0.1:$port/edge/v1/health").openConnection() as HttpURLConnection
        connection.connectTimeout = 2_000
        connection.readTimeout = 2_000
        assertEquals(200, connection.responseCode)
        val response = connection.inputStream.bufferedReader().readText()
        assertTrue(response.contains("\"status\":\"ok\""))
        assertTrue(response.contains("\"runtimeState\":\"running\""))
    }

    private fun assertUnavailable(port: Int) {
        val connection = URL("http://127.0.0.1:$port/edge/v1/health").openConnection() as HttpURLConnection
        connection.connectTimeout = 500
        connection.readTimeout = 500
        assertTrue(runCatching { connection.responseCode }.isFailure)
    }
}
