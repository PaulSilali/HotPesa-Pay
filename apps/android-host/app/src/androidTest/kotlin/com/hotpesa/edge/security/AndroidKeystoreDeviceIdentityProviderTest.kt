package com.hotpesa.edge.security

import androidx.test.ext.junit.runners.AndroidJUnit4
import java.util.UUID
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class AndroidKeystoreDeviceIdentityProviderTest {
    @Test
    fun creates_reuses_and_verifies_a_non_exported_keystore_identity() {
        val provider = AndroidKeystoreDeviceIdentityProvider()
        val alias = "hotpesa.edge.test.${UUID.randomUUID()}"
        val first = provider.getOrCreate(alias)
        val second = provider.getOrCreate(alias)
        val challenge = "phase-zero".encodeToByteArray()
        val signature = first.sign(challenge)

        assertEquals(first.fingerprint, second.fingerprint)
        assertTrue(provider.verify(first, challenge, signature))
        assertFalse(provider.verify(first, "different".encodeToByteArray(), signature))
    }
}
