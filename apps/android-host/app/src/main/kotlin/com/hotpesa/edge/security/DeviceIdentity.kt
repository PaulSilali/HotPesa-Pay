package com.hotpesa.edge.security

data class DeviceIdentity(
    val alias: String,
    val publicKey: ByteArray,
    val fingerprint: String,
    val hardwareBacked: Boolean?,
) {
    fun sign(challenge: ByteArray): ByteArray = signer(challenge)

    internal lateinit var signer: (ByteArray) -> ByteArray
}

interface DeviceIdentityProvider {
    fun getOrCreate(alias: String): DeviceIdentity
    fun verify(identity: DeviceIdentity, challenge: ByteArray, signature: ByteArray): Boolean
}
