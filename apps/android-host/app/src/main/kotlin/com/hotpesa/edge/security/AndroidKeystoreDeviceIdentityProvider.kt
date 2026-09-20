package com.hotpesa.edge.security

import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.security.keystore.KeyInfo
import java.security.KeyFactory
import java.security.KeyPairGenerator
import java.security.KeyStore
import java.security.MessageDigest
import java.security.PrivateKey
import java.security.Signature

class AndroidKeystoreDeviceIdentityProvider : DeviceIdentityProvider {
    private val keyStore: KeyStore = KeyStore.getInstance(ANDROID_KEYSTORE).apply { load(null) }

    override fun getOrCreate(alias: String): DeviceIdentity {
        if (!keyStore.containsAlias(alias)) {
            val generator = KeyPairGenerator.getInstance(KeyProperties.KEY_ALGORITHM_EC, ANDROID_KEYSTORE)
            generator.initialize(
                KeyGenParameterSpec.Builder(
                    alias,
                    KeyProperties.PURPOSE_SIGN or KeyProperties.PURPOSE_VERIFY,
                )
                    .setDigests(KeyProperties.DIGEST_SHA256)
                    .build(),
            )
            generator.generateKeyPair()
        }

        val certificate = requireNotNull(keyStore.getCertificate(alias)) { "Keystore identity is unavailable." }
        val privateKey = requireNotNull(keyStore.getKey(alias, null) as? PrivateKey) {
            "Keystore private key is unavailable."
        }
        val publicKey = certificate.publicKey.encoded
        return DeviceIdentity(
            alias = alias,
            publicKey = publicKey,
            fingerprint = fingerprint(publicKey),
            hardwareBacked = hardwareBacked(privateKey),
        ).also { identity ->
            identity.signer = { challenge -> sign(alias, challenge) }
        }
    }

    override fun verify(identity: DeviceIdentity, challenge: ByteArray, signature: ByteArray): Boolean =
        Signature.getInstance(SIGNATURE_ALGORITHM).run {
            initVerify(keyStore.getCertificate(identity.alias).publicKey)
            update(challenge)
            verify(signature)
        }

    private fun sign(alias: String, challenge: ByteArray): ByteArray = Signature.getInstance(SIGNATURE_ALGORITHM).run {
        initSign(requireNotNull(keyStore.getKey(alias, null) as? PrivateKey))
        update(challenge)
        sign()
    }

    private fun hardwareBacked(privateKey: java.security.Key): Boolean? = runCatching {
        KeyFactory.getInstance(privateKey.algorithm, ANDROID_KEYSTORE)
            .getKeySpec(privateKey, KeyInfo::class.java)
            .isInsideSecureHardware
    }.getOrNull()

    private fun fingerprint(publicKey: ByteArray): String = MessageDigest.getInstance("SHA-256")
        .digest(publicKey)
        .joinToString("") { "%02x".format(it) }

    private companion object {
        const val ANDROID_KEYSTORE = "AndroidKeyStore"
        const val SIGNATURE_ALGORITHM = "SHA256withECDSA"
    }
}
