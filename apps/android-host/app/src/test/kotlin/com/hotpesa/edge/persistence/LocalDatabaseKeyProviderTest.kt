package com.hotpesa.edge.persistence

import org.junit.Assert.assertEquals
import org.junit.Test

class LocalDatabaseKeyProviderTest {
    @Test
    fun `exposes a stable keystore reference and no raw key material`() {
        val reference = KeystoreDatabaseKeyProvider().keyReference()

        assertEquals("hotpesa.edge.database-key", reference.alias)
    }
}
