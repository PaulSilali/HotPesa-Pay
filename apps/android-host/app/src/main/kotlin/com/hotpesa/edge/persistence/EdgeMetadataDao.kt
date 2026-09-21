package com.hotpesa.edge.persistence

import androidx.room.Dao
import androidx.room.Query
import androidx.room.Upsert

@Dao
interface EdgeMetadataDao {
    @Upsert
    fun upsert(metadata: EdgeMetadataEntity)

    @Query("SELECT * FROM edge_metadata WHERE metadata_key = :key")
    fun findByKey(key: String): EdgeMetadataEntity?
}
