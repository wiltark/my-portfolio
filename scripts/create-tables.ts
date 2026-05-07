import mysql from "mysql2/promise";

const c = await mysql.createConnection({
  host: "51.254.243.250",
  port: 39393,
  user: "mysql",
  password: "pbxayvlytcsj5ego",
  database: "mysql",
});

const tables = [
  {
    name: "Profile",
    sql: `CREATE TABLE IF NOT EXISTS \`Profile\` (
      \`id\` VARCHAR(191) NOT NULL DEFAULT 'main',
      \`name\` VARCHAR(191) NOT NULL DEFAULT '',
      \`title\` VARCHAR(191) NOT NULL DEFAULT '',
      \`bio\` TEXT NULL,
      \`longBio\` LONGTEXT NULL,
      \`location\` VARCHAR(191) NULL,
      \`email\` VARCHAR(191) NULL,
      \`github\` VARCHAR(191) NULL,
      \`twitter\` VARCHAR(191) NULL,
      \`linkedin\` VARCHAR(191) NULL,
      \`website\` VARCHAR(191) NULL,
      \`avatar\` VARCHAR(191) NULL,
      \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "Skill",
    sql: `CREATE TABLE IF NOT EXISTS \`Skill\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`name\` VARCHAR(191) NOT NULL,
      \`level\` INTEGER NOT NULL DEFAULT 50,
      \`category\` VARCHAR(191) NOT NULL DEFAULT 'Other',
      \`order\` INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "Project",
    sql: `CREATE TABLE IF NOT EXISTS \`Project\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`title\` VARCHAR(191) NOT NULL,
      \`description\` TEXT NULL,
      \`content\` LONGTEXT NULL,
      \`image\` VARCHAR(191) NULL,
      \`tags\` VARCHAR(1000) NOT NULL DEFAULT '[]',
      \`github\` VARCHAR(191) NULL,
      \`demo\` VARCHAR(191) NULL,
      \`featured\` BOOLEAN NOT NULL DEFAULT false,
      \`published\` BOOLEAN NOT NULL DEFAULT true,
      \`order\` INTEGER NOT NULL DEFAULT 0,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "BlogPost",
    sql: `CREATE TABLE IF NOT EXISTS \`BlogPost\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`title\` VARCHAR(191) NOT NULL,
      \`slug\` VARCHAR(191) NOT NULL,
      \`excerpt\` TEXT NULL,
      \`content\` LONGTEXT NULL,
      \`image\` VARCHAR(191) NULL,
      \`tags\` VARCHAR(1000) NOT NULL DEFAULT '[]',
      \`published\` BOOLEAN NOT NULL DEFAULT false,
      \`publishedAt\` DATETIME(3) NULL,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      UNIQUE INDEX \`BlogPost_slug_key\`(\`slug\`),
      FULLTEXT INDEX \`BlogPost_title_excerpt_content_idx\`(\`title\`, \`excerpt\`, \`content\`),
      PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "DocCategory",
    sql: `CREATE TABLE IF NOT EXISTS \`DocCategory\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`name\` VARCHAR(191) NOT NULL,
      \`slug\` VARCHAR(191) NOT NULL,
      \`order\` INTEGER NOT NULL DEFAULT 0,
      UNIQUE INDEX \`DocCategory_slug_key\`(\`slug\`),
      PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "DocPage",
    sql: `CREATE TABLE IF NOT EXISTS \`DocPage\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`title\` VARCHAR(191) NOT NULL,
      \`slug\` VARCHAR(191) NOT NULL,
      \`content\` LONGTEXT NULL,
      \`categoryId\` VARCHAR(191) NULL,
      \`order\` INTEGER NOT NULL DEFAULT 0,
      \`published\` BOOLEAN NOT NULL DEFAULT true,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      UNIQUE INDEX \`DocPage_slug_key\`(\`slug\`),
      FULLTEXT INDEX \`DocPage_title_content_idx\`(\`title\`, \`content\`),
      PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "Tutorial",
    sql: `CREATE TABLE IF NOT EXISTS \`Tutorial\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`title\` VARCHAR(191) NOT NULL,
      \`slug\` VARCHAR(191) NOT NULL,
      \`excerpt\` TEXT NULL,
      \`content\` LONGTEXT NULL,
      \`image\` VARCHAR(191) NULL,
      \`tags\` VARCHAR(1000) NOT NULL DEFAULT '[]',
      \`difficulty\` VARCHAR(191) NOT NULL DEFAULT 'beginner',
      \`duration\` INTEGER NULL,
      \`published\` BOOLEAN NOT NULL DEFAULT false,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      UNIQUE INDEX \`Tutorial_slug_key\`(\`slug\`),
      FULLTEXT INDEX \`Tutorial_title_excerpt_content_idx\`(\`title\`, \`excerpt\`, \`content\`),
      PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "FK_DocPage_categoryId",
    sql: `ALTER TABLE \`DocPage\` ADD CONSTRAINT \`DocPage_categoryId_fkey\`
      FOREIGN KEY (\`categoryId\`) REFERENCES \`DocCategory\`(\`id\`)
      ON DELETE SET NULL ON UPDATE CASCADE`,
  },
];

for (const t of tables) {
  try {
    await c.query(t.sql);
    console.log(`✅ ${t.name}`);
  } catch (e: unknown) {
    const msg = (e as { message: string }).message;
    if (
      msg.includes("already exists") ||
      msg.includes("Duplicate key") ||
      msg.includes("Duplicate foreign key") ||
      msg.includes("errno: 1826") ||
      msg.includes("errno: 1061") ||
      msg.includes("1061") ||
      msg.includes("1826")
    ) {
      console.log(`⏭  ${t.name} (already exists)`);
    } else {
      console.error(`❌ ${t.name}: ${msg}`);
    }
  }
}

await c.end();
console.log("\n✅ Done!");
