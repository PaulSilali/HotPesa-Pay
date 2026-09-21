package com.hotpesa.edge.persistence

/**
 * Boundary for a future encrypted Room implementation. This Phase 0 project never exposes or
 * persists raw key material, and does not claim that the Room database is encrypted yet.
 */
interface LocalDatabaseKeyProvider {
    fun keyReference(): DatabaseKeyReference
}

data class DatabaseKeyReference(val alias: String)

class KeystoreDatabaseKeyProvider : LocalDatabaseKeyProvider {
    override fun keyReference(): DatabaseKeyReference = DatabaseKeyReference("hotpesa.edge.database-key")
}
