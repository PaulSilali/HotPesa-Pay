package com.hotpesa.edge.persistence

import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import android.content.Context

@Database(entities = [EdgeMetadataEntity::class], version = EdgeDatabase.SCHEMA_VERSION, exportSchema = true)
abstract class EdgeDatabase : RoomDatabase() {
    abstract fun metadataDao(): EdgeMetadataDao

    companion object {
        const val SCHEMA_VERSION = 1

        fun create(context: Context): EdgeDatabase = Room.databaseBuilder(
            context.applicationContext,
            EdgeDatabase::class.java,
            "hotpesa-edge.db",
        ).build()
    }
}
