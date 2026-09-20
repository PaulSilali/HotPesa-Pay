package com.hotpesa.edge.persistence

import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class EdgeDatabaseTest {
    private lateinit var database: EdgeDatabase

    @Before
    fun setUp() {
        database = Room.inMemoryDatabaseBuilder(ApplicationProvider.getApplicationContext(), EdgeDatabase::class.java)
            .allowMainThreadQueries()
            .build()
    }

    @After
    fun tearDown() = database.close()

    @Test
    fun metadata_can_be_created_read_and_reinitialized_at_schema_version_one() {
        database.metadataDao().upsert(EdgeMetadataEntity("runtime", "initialized"))

        assertEquals(EdgeDatabase.SCHEMA_VERSION, database.openHelper.readableDatabase.version)
        assertNotNull(database.metadataDao().findByKey("runtime"))
    }
}
