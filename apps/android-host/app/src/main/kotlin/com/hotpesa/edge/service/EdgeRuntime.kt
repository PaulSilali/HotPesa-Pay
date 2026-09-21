package com.hotpesa.edge.service

import com.hotpesa.edge.config.EdgeDevelopmentConfiguration
import com.hotpesa.edge.domain.EdgeRuntimeState
import com.hotpesa.edge.server.LocalEdgeServer

class EdgeRuntime(
    private val configuration: EdgeDevelopmentConfiguration,
    private val server: LocalEdgeServer,
    private val initialize: () -> Unit = {},
) {
    @Volatile var state: EdgeRuntimeState = EdgeRuntimeState.STOPPED
        private set

    @Synchronized
    fun start() {
        if (state == EdgeRuntimeState.RUNNING) return
        state = EdgeRuntimeState.STARTING
        try {
            initialize()
            server.start(::healthResponse)
            state = EdgeRuntimeState.RUNNING
        } catch (exception: Exception) {
            state = EdgeRuntimeState.ERROR
            runCatching { server.stop() }
            throw exception
        }
    }

    @Synchronized
    fun stop() {
        if (state == EdgeRuntimeState.STOPPED) return
        state = EdgeRuntimeState.STOPPING
        server.stop()
        state = EdgeRuntimeState.STOPPED
    }

    private fun healthResponse(): String = """{"status":"ok","service":"hotpesa-android-edge","apiVersion":"v1","appVersion":"${configuration.appVersion}","runtimeState":"running"}"""
}
