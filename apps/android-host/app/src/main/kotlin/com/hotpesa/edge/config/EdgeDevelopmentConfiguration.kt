package com.hotpesa.edge.config

/** Development-only local transport configuration. Production TLS remains an open security decision. */
data class EdgeDevelopmentConfiguration(
    val bindAddress: String = "0.0.0.0",
    val port: Int = 8787,
    val appVersion: String,
) {
    init {
        require(port in 1..65535) { "Development port must be between 1 and 65535." }
    }
}
