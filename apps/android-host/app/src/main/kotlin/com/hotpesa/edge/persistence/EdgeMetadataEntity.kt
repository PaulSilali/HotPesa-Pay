package com.hotpesa.edge.persistence

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

/** Non-financial metadata only. Payment, provider, revenue and passenger entities are intentionally absent. */
@Entity(tableName = "edge_metadata")
data class EdgeMetadataEntity(
    @PrimaryKey
    @ColumnInfo(name = "metadata_key")
    val key: String,
    @ColumnInfo(name = "metadata_value")
    val value: String,
)
