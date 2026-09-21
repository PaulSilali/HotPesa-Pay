package com.hotpesa.edge.server

interface LocalEdgeServer {
    val port: Int?
    fun start(healthResponse: () -> String)
    fun stop()
}
