package com.hotpesa.edge.service

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.util.Log
import com.hotpesa.edge.BuildConfig
import com.hotpesa.edge.config.EdgeDevelopmentConfiguration
import com.hotpesa.edge.persistence.EdgeDatabase
import com.hotpesa.edge.security.AndroidKeystoreDeviceIdentityProvider
import com.hotpesa.edge.server.EdgeHttpServer

/** Development lifecycle skeleton only; foreground-service endurance is a later field-validation gate. */
class EdgeRuntimeService : Service() {
    private lateinit var database: EdgeDatabase
    private lateinit var runtime: EdgeRuntime

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (!::runtime.isInitialized) {
            val configuration = EdgeDevelopmentConfiguration(appVersion = BuildConfig.VERSION_NAME)
            runtime = EdgeRuntime(configuration, EdgeHttpServer(configuration.bindAddress, configuration.port)) {
                database = EdgeDatabase.create(this)
                AndroidKeystoreDeviceIdentityProvider().getOrCreate(DEFAULT_KEY_ALIAS)
                Log.i(TAG, "Edge persistence and device identity initialized")
            }
        }
        runtime.start()
        Log.i(TAG, "Development edge runtime started")
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        if (::runtime.isInitialized) runtime.stop()
        if (::database.isInitialized) database.close()
        Log.i(TAG, "Development edge runtime stopped")
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private companion object {
        const val TAG = "HotPesaEdge"
        const val DEFAULT_KEY_ALIAS = "hotpesa.edge.device-signing"
    }
}
