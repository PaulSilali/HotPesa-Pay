package com.hotpesa.edge.service

import com.hotpesa.edge.config.EdgeDevelopmentConfiguration
import com.hotpesa.edge.domain.EdgeRuntimeState
import com.hotpesa.edge.server.LocalEdgeServer
import org.junit.Assert.assertEquals
import org.junit.Test

class EdgeRuntimeTest {
    @Test
    fun `starts stops and restarts safely`() {
        val server = FakeServer()
        val runtime = EdgeRuntime(EdgeDevelopmentConfiguration(appVersion = "test"), server)

        runtime.start()
        assertEquals(EdgeRuntimeState.RUNNING, runtime.state)
        runtime.stop()
        assertEquals(EdgeRuntimeState.STOPPED, runtime.state)
        runtime.start()

        assertEquals(2, server.starts)
        assertEquals(1, server.stops)
        assertEquals(EdgeRuntimeState.RUNNING, runtime.state)
    }

    private class FakeServer : LocalEdgeServer {
        override val port: Int? = 8787
        var starts = 0
        var stops = 0
        override fun start(healthResponse: () -> String) { starts++ }
        override fun stop() { stops++ }
    }
}
