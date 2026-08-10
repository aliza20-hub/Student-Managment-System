// ============================================================
// Run this in your terminal with:  mongosh < init-mongo.js
// (or open mongosh, then: load("init-mongo.js"))
//
// Spring Data MongoDB will actually auto-create these collections
// the first time it saves a document - you do NOT strictly need
// this script to run the app. It's here so you can:
//   1) see collections created explicitly, with schema validation
//   2) get the right indexes in place from day one (scales better)
//   3) practice raw mongosh / collection commands
// ============================================================

db = db.getSiblingDB("sms_db");

// ---------- users ----------
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password", "roles"],
      properties: {
        username: { bsonType: "string" },
        email: { bsonType: "string" },
        password: { bsonType: "string" },
        roles: {
          bsonType: "array",
          items: { enum: ["ADMIN", "TEACHER", "STUDENT"] }
        },
        enabled: { bsonType: "bool" }
      }
    }
  },
  validationLevel: "moderate"
});
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

// ---------- students ----------
db.createCollection("students", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["firstName", "lastName", "email"],
      properties: {
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        email: { bsonType: "string" },
        phone: { bsonType: ["string", "null"] },
        enrolledCourseIds: { bsonType: "array" }
      }
    }
  },
  validationLevel: "moderate"
});
db.students.createIndex({ email: 1 }, { unique: true });
db.students.createIndex({ lastName: 1, firstName: 1 }); // supports sorted listing + name search

// ---------- courses ----------
db.createCollection("courses", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["code", "name"],
      properties: {
        code: { bsonType: "string" },
        name: { bsonType: "string" },
        credits: { bsonType: ["int", "double"] }
      }
    }
  },
  validationLevel: "moderate"
});
db.courses.createIndex({ code: 1 }, { unique: true });

print("sms_db ready: collections 'users', 'students', 'courses' created with indexes.");
print("Collections now: " + db.getCollectionNames());
